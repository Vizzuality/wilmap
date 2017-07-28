<?php

namespace Drupal\wilmap_migration\Plugin\migrate\process;

use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\Row;

/**
 * This plugin move an image from source to destination folder.
 *
 * @MigrateProcessPlugin(
 *   id = "trace"
 * )
 */
class Trace extends ProcessPluginBase {

  /**
   * {@inheritdoc}
   */
  public function transform($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) {


      drush_print($value);

      return  $value;
  }


    /**
     * {@inheritdoc}
     */
    public function multiple() {
        return TRUE;
    }

}