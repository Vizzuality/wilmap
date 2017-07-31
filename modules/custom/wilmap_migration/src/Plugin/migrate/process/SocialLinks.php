<?php

namespace Drupal\wilmap_migration\Plugin\migrate\process;

use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\Row;

/**
 * This get social links from with values in this order:
 * 0: twitter
 * 1: linkedin
 * 2: web
 *
 * @MigrateProcessPlugin(
 *   id = "social_links"
 * )
 */
class SocialLinks extends ProcessPluginBase
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

        // Available platforms
        // $platform_values["contact"]["value"]="";
        $platform_values["facebook"]["value"]="";
        $platform_values["instagram"]["value"]="";
        $platform_values["linkedin"]["value"]="";
        $platform_values["twitter"]["value"]="";
        $platform_values["youtube"]["value"]="";
        $platform_values["web"]["value"]="";

        // Twitter
        if (isset($value[0]) && $value[0] && $$value[0] != '-') {
            $platform_values['linkedin']["value"] = str_replace("/", "",
              str_replace("https://twitter.com/", "", $value[0]));
        }
        // LinkedIn
        if (isset($value[1]) && $value[1] && $$value[0] != '-') {
            $platform_values['linkedin']["value"] = str_replace("/", "",
              str_replace("https://www.linkedin.com/in/", "", $value[1]));
        }
        // Twitter
        if (isset($value[2]) && $value[2] && $$value[0] != '-') {
            $platform_values['web']["value"] = $value[2];
        }

        return array(
          'platform_values' => $platform_values,
          'value'           => null,
          'platforms'       => null
        );
    }

}