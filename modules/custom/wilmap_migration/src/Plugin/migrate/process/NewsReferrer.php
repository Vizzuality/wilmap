<?php

namespace Drupal\wilmap_migration\Plugin\migrate\process;

use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\Row;
use \Drupal\Core\Link;
use \Drupal\Core\Url;

/**
 * Generates a referrer test from source params:
 * 1. title
 * 2. nid
 * 3. timestamp
 *
 * @MigrateProcessPlugin(
 *   id = "news_referrer"
 * )
 */
class NewsReferrer extends ProcessPluginBase
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

        list($title, $nid, $timestamp) = $value;
        $link = Link::fromTextAndUrl($title,
          Url::fromUri('http://cyberlaw.stanford.edu/node/' . $nid));
        $date =  \Drupal::service('date.formatter')->format($timestamp, 'custom', 'F j, Y');

        $result = "This article was originally published at the CIS Blog " . $link->toString();
        $result .= "<br/>Date published: " . $date;

        return $result;
    }


    /**
     * {@inheritdoc}
     */
    public function multiple()
    {
        return true;
    }

}