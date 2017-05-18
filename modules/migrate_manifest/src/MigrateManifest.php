<?php

/**
 * @file
 * Contains \Drupal\migrate_tools\MigrateManifest
 */

namespace Drupal\migrate_manifest;

use Drupal\Component\Utility\NestedArray;
use Drupal\Core\Database\Database;
use Drupal\migrate\Plugin\MigrationInterface;
use Drupal\migrate_tools\DrushLogMigrateMessage;
use Drupal\migrate_tools\MigrateExecutable;
use Symfony\Component\HttpFoundation\File\Exception\FileNotFoundException;
use Symfony\Component\Yaml\Yaml;

class MigrateManifest {

  /**
   * The path to the manifest file.
   *
   * @var string
   */
  protected $manifestFile;

  /**
   * Constructs a new MigrateManifest object.
   * @param string $manifest_file
   *   The location of the manifest file.
   */
  public function __construct($manifest_file) {
    $this->manifestFile = $manifest_file;
  }

  /**
   * Drush execution method. Runs imports on the supplied manifest.
   */
  public function import() {
    if (\Drupal::hasService('migrate.template_storage')) {
      $legacy = new MigrateManifest80($this->manifestFile);
      return $legacy->import();
    }

    $this->setupLegacyDb();
    $migration_ids = [];
    $migrations = [];

    /** @var \Drupal\migrate\Plugin\MigrationPluginManager $manager */
    $manager = \Drupal::service('plugin.manager.migration');

    if (!file_exists($this->manifestFile)) {
      throw new FileNotFoundException($this->manifestFile);
    }

    $migration_manifest = Yaml::parse(file_get_contents($this->manifestFile));
    // Build initial list of migrations.
    foreach ($migration_manifest as $migration_info) {
      if (is_array($migration_info)) {
        // The migration is stored as the key in the info array.
        $migration_id = key($migration_info);
      }
      else {
        // If it wasn't an array then the info is just the migration_id.
        $migration_id = $migration_info;
        $migration_info = [];
      }
      // createInstances doesn't use the configuration given but the keyed value
      // so you can provide multiple IDs so work around that.
      // Note: createInstance() doesn't work around this so we always have to
      // do this.
      $migration_info = [$migration_id => $migration_info];

      /** @var \Drupal\migrate\Plugin\MigrationInterface $migration */
      // createInstance and createInstances doesn't follow the plugin interface
      // so this won't throw an exception. Instead we have to check the return
      // value to confirm that a migration was returned.
      // https://www.drupal.org/node/2744323
      $migration_instances = $manager->createInstances($migration_id, $migration_info);
      if (!empty($migration_instances)) {
        // Merge any created instances into the full migration list.
        $migrations = array_merge($migrations, $migration_instances);
        // Add to the list of migrations we've found.
        $migration_ids[] = $migration_id;
      }
      else {
        $nonexistent_migrations[] = $migration_id;
      }
    }

    $run_migrations = [];
    foreach ($migrations as $migration_instance) {
      $migrations_to_run = $this->injectDependencies($migration_instance, $migrations);
      foreach ($migrations_to_run as $migration) {
        $executable = $this->executeMigration($migration);
        // Store all the migrations for later.
        $run_migrations[$migration->id()] = [
          'executable' => $executable,
          'migration' => $migration,
          'source' => $migration->get('source'),
          'destination' => $migration->get('destination'),
        ];
      }
    }

    // Warn the user if any migrations were not found.
    if (count($nonexistent_migrations) > 0) {
      drush_log(dt('The following migrations were not found: @migrations', [
        '@migrations' => implode(', ', $nonexistent_migrations),
      ]), 'warning');
    }

    return $run_migrations;
  }


  /**
   * A naive graph flattener for compressing dependencies into a list.
   *
   * @param \Drupal\migrate\Plugin\MigrationInterface $migration
   * @param \Drupal\migrate\Plugin\MigrationInterface[] $manifest_list
   * @return \Drupal\migrate\Plugin\MigrationInterface[]
   */
  protected function injectDependencies(MigrationInterface $migration, array $manifest_list) {
    $migrations = [$migration->id() => $migration];
    if ($required_Ids = $migration->get('requirements')) {
      /** @var \Drupal\migrate\Plugin\MigrationPluginManager $manager */
      $manager = \Drupal::service('plugin.manager.migration');
      /** @var \Drupal\migrate\Plugin\MigrationInterface[] $required_migrations */
      $required_migrations = [];
      foreach ($required_Ids as $id) {
        // See if there are any configured versions of the migration already
        // in the manifest list.
        if (isset($manifest_list[$id])) {
          $required_migrations[$id] = $manifest_list[$id];
        }
        // Otherwise, create a new instance.
        else {
          $required_migrations += $manager->createInstances($id);
        }
      }

      // Merge required migrations, using requirements as the base so they
      // bubble to the front.
      $migrations = $required_migrations + $migrations;
    }
//    $this->doInjectDependencies($migrations, $manifest_list);
    return $migrations;
  }

  /**
   * @param \Drupal\migrate\Plugin\MigrationInterface[] $migrations
   * @param \Drupal\migrate\Plugin\MigrationInterface[] $manifest_list
   */
  protected function doInjectDependencies(array &$migrations, array $manifest_list) {
    /** @var \Drupal\migrate\Plugin\MigrationPluginManager $manager */
    $manager = \Drupal::service('plugin.manager.migration');
    foreach ($migrations as $migration) {
      if ($required_Ids = $migration->get('requirements')) {
        /** @var \Drupal\migrate\Plugin\MigrationInterface[] $required_migrations */
        $required_migrations = [];
        foreach ($required_Ids as $id) {
          // See if there are any configured versions of the migration already
          // in the manifest list.
          if (isset($manifest_list[$id])) {
            $required_migrations[$id] = $manifest_list[$id];
          }
          // Otherwise, create a new instance.
          else {
            $required_migrations += $manager->createInstances($id);
          }
        }

        // Recurse to find any nested dependencies.
        $this->doInjectDependencies($required_migrations, $manifest_list);
        // Merge required migrations, using requirements as the base so they
        // bubble to the front.
        $migrations = $required_migrations + $migrations;
      }
    }
  }

  /**
   * Execute a single migration.
   *
   * @param \Drupal\migrate\Plugin\MigrationInterface $migration
   *   The migration to run.
   *
   * @return \Drupal\migrate_tools\MigrateExecutable
   *   The migration executable.
   */
  protected function executeMigration(MigrationInterface $migration) {
    drush_log('Running ' . $migration->id(), 'ok');
    $executable = new MigrateExecutable($migration, new DrushLogMigrateMessage());
    // drush_op() provides --simulate support.
    drush_op([$executable, 'import']);

    return $executable;
  }

  /**
   * Setup the legacy database connection to migrate from.
   */
  protected function setupLegacyDb() {
    $db_url = drush_get_option('legacy-db-url');
    $db_spec = drush_convert_db_from_db_url($db_url);
    $db_spec['prefix'] = drush_get_option('legacy-db-prefix');
    Database::removeConnection('migrate');
    Database::addConnectionInfo('migrate', 'default', $db_spec);
  }

}
