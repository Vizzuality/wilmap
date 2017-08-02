<?php

namespace Drupal\wilmap_migration\Plugin\migrate\process;

use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\Row;
use Datetime;

/**
 * This plugin extract urls in a string separated with comma.
 *
 * @MigrateProcessPlugin(
 *   id = "published_date",
 *   handle_multiples = FALSE
 * )
 */
class PublishedDate extends ProcessPluginBase
{

    /**
     * {@inheritdoc}
     */
    public function transform(
      $value,
      MigrateExecutableInterface $migrate_executable,
      Row $row,
      $destination_property
    ) {

        if(!$value) return null;

        $date = DateTime::createFromFormat('Y-m-d H:i', $value);
        //$newDate = $date->format("Y-m-d\TH:i:s");
        $newDate = $date->format("Y-m-d");
        //var_dump($newDate);

        return $newDate;
    }

}