<?php

namespace Drupal\wilmap_map;


/**
 * Class Country.
 *
 * @package Drupal\wilmap_map
 */
class CountryServices
{
    /**
     * Get country from ISO2 code
     *
     * @param $iso2 string iso2 country code
     *
     * @return int country nid
     */
    public function getCountryFromIso($iso2)
    {
        // Country with iso2
//        $query = \Drupal::service('entity.query')
//          ->get('node')
//          ->condition('status', 1)
//          ->condition('field_iso2', $iso2);
//
//        $entity_ids = $query->execute();

        $query = \Drupal::entityQuery('node');
        $query->condition('status', 1);
        $query->condition('type', 'country');
        $query->condition('field_iso2', $iso2);
        $entity_ids = $query->execute();

        return $entity_ids;

    }

}
