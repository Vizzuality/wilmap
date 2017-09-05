<?php

namespace Drupal\wilmap_map;

use Drupal\Core\Entity\Query\QueryFactory;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class CountryServices.
 *
 * @package Drupal\wilmap_map
 */
class CountryServices
{

    /**
     * @var \Drupal\Core\Entity\Query\QueryFactory
     */
    protected $entityQueryFactory;

    /**
     * Implements __construct().
     *
     * @param \Drupal\Core\Entity\Query\QueryFactory    $query_factory
     *   Query Factory Service Object.
     */
    public function __construct(QueryFactory $query_factory) {
        $this->entityQueryFactory = $query_factory;
    }

    /**
     * {@inheritdoc}
     */
    public static function create(ContainerInterface $container) {
        return new static(
          $container->get('entity.query')
        );
    }


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

        $query = $this->entityQueryFactory->get('node');
        $query->condition('status', 1);
        $query->condition('type', 'country');
        $query->condition('field_iso2', $iso2);
        $entity_ids = $query->execute();

        return reset($entity_ids);

    }

    /**
     * Get all countries
     *
     * @return array, country nids
     */
    public function getCountries()
    {

        $query = $this->entityQueryFactory->get('node');
        $query->condition('status', 1);
        $query->condition('type', 'country');
        $entity_ids = $query->execute();

        return $entity_ids;

    }



}
