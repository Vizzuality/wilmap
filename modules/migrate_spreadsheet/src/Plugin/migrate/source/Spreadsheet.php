<?php

namespace Drupal\migrate_spreadsheet\Plugin\migrate\source;

use Drupal\Component\Plugin\ConfigurablePluginInterface;
use Drupal\Component\Utility\NestedArray;
use Drupal\migrate\MigrateException;
use Drupal\migrate\Plugin\migrate\source\SourcePluginBase;
use Drupal\migrate\Plugin\MigrationInterface;
use PhpOffice\PhpSpreadsheet\IOFactory;

/**
 * Provides a source plugin that migrate from spreadsheet files.
 *
 * This source plugin uses the PhpOffice/PhpSpreadsheet library to read
 * spreadsheet files.
 *
 * @MigrateSource(
 *   id = "spreadsheet"
 * )
 */
class Spreadsheet extends SourcePluginBase implements ConfigurablePluginInterface/*, ContainerFactoryPluginInterface*/ {

  /**
   * Constructs a spreadsheet migration source plugin object.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\migrate\Plugin\MigrationInterface
   *   The current migration.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, MigrationInterface $migration) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $migration);
    $this->setConfiguration($configuration);
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'file' => NULL,
      'worksheet' => NULL,
      'origin' => 'A2',
      'header_row' => NULL,
      'columns' => [],
      'keys' => [],
      'row_index_column' => NULL,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function setConfiguration(array $configuration) {
    $this->configuration = NestedArray::mergeDeep(
      $this->defaultConfiguration(),
      $configuration
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getConfiguration() {
    return $this->configuration;
  }

  /**
   * {@inheritdoc}
   */
  public function __toString() {
    return $this->configuration['file'] . ':' . $this->configuration['worksheet'];
  }

  /**
   * {@inheritdoc}
   */
  public function getIds() {
    $config = $this->getConfiguration();

    if (empty($config['keys'])) {
      if (empty($config['row_index_column'])) {
        throw new \RuntimeException("Row index should act as key but no name has been provided. Set 'row_index_column' in source config to provide a name for this column.");
      }
      // If no keys are defined, we'll use the 'zero based' index of the
      // spreadsheet current row.
      return [$config['row_index_column'] => ['type' => 'integer']];
    }

    return $config['keys'];
  }

  /**
   * {@inheritdoc}
   */
  public function fields() {
    $columns = $this->getConfiguration()['columns'];
    if (!empty($row_index_column = $this->getConfiguration()['row_index_colums'])) {
      $columns[] = $row_index_column;
    }
    return array_combine($columns, $columns);
  }

  /**
   * {@inheritdoc}
   */
  public function initializeIterator() {
    $configuration = $this->getConfiguration();
    $configuration['worksheet'] = $this->loadWorksheet();
    $configuration['keys'] = array_keys($configuration['keys']);
    // The 'file' and 'plugin' items are not part of iterator configuration.
    unset($configuration['file'], $configuration['plugin']);
    return \Drupal::service('migrate_spreadsheet.iterator')
      ->setConfiguration($configuration);
  }

  /**
   * Loads the worksheet.
   *
   * @return \PhpOffice\PhpSpreadsheet\Worksheet
   *   The source worksheet.
   *
   * @throws \Drupal\migrate\MigrateException
   *   When it's impossible to load the file or the worksheet does not exist.
   */
  protected function loadWorksheet() {
    $config = $this->getConfiguration();

    // Check that the file exists.
    if (!file_exists($config['file'])) {
      throw new MigrateException("File with path '{$config['file']}' doesn't exist.");
    }

    // Check that a non-empty worksheet has been passed.
    if (empty($config['worksheet'])) {
      throw new MigrateException('No worksheet was passed.');
    }

    // Load the workbook.
    try {
      // Identify the type of the input file.
      $type = IOFactory::identify($config['file']);

      // Create a new Reader of the file type.
      /** @var \PhpOffice\PhpSpreadsheet\Reader\BaseReader $reader */
      $reader = IOFactory::createReader($type);

      // Advise the Reader that we only want to load cell data.
      $reader->setReadDataOnly(TRUE);

      // Advise the Reader of which worksheet we want to load.
      $reader->setLoadSheetsOnly($config['worksheet']);

      /** @var \PhpOffice\PhpSpreadsheet\Spreadsheet $workbook */
      $workbook = $reader->load($config['file']);

      return $workbook->getSheet();
    }
    catch (\Exception $e) {
      $class = get_class($e);
      throw new MigrateException("Got '$class', message '{$e->getMessage()}'.");
    }
  }

  /**
   * {@inheritdoc}
   */
  public function calculateDependencies() {
    return [];
  }

}
