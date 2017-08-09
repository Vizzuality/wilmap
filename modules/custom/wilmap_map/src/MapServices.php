<?php

namespace Drupal\wilmap_map;

use Drupal\Core\Database\Connection;
use Drupal\node\Entity\Node;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\Query\QueryFactory;


/**
 * Class Ranking.
 *
 * @package Drupal\wilmap_contributors
 */
class MapServices
{

    /**
     * Database Service Object.
     *
     * @var \Drupal\Core\Database\Connection
     */
    protected $database;
    /**
     * @var \Drupal\Core\Entity\Query\QueryFactory
     */
    protected $entityQueryFactory;
    /**
     * @var \Drupal\wilmap_map\CountryServices
     */
    protected $countryService;
    /**
     * @var \Drupal\wilmap_map\LayerServices
     */
    protected $layerService;

    /**
     * @var array countries
     *   Available countries.
     */
    private $countries;

    /**
     * Implements __construct().
     *
     * @param \Drupal\Core\Database\Connection       $database
     *   Database Service Object.
     *
     * @param \Drupal\Core\Entity\Query\QueryFactory $query_factory
     *   Query Factory Service Object.
     */
    public function __construct(
      Connection $database,
      QueryFactory $query_factory,
      CountryServices $country_services,
      LayerServices $layer_services
    ) {
        $this->database = $database;
        $this->entityQueryFactory = $query_factory;
        $this->countryService = $country_services;
        $this->layerService = $layer_services;
    }

    /**
     * {@inheritdoc}
     */
    public static function create(ContainerInterface $container)
    {
        return new static(
          $container->get('database'),
          $container->get('entity.query'),
          $container->get('wilmap_map.country'),
          $container->get('wilmap_map.layer')
        );
    }

    /**
     * Get a country entries count with conditions set in layer
     *
     * @param $country_nid int, country nid.
     * @param $conditions array, array with conditions(string field_name, array values, string operator)
     *
     * @return array, country entries
     */
    public function getCountryEntriesCount(
      $country_nid,
      $conditions = []
    ) {

        // Base query to get Entries from Country
        $query = $this->entityQueryFactory->get('node');
        $query->condition('status', 1);
        $query->condition('type', 'entry');
        $query->condition('field_location_entry', $country_nid);
        $query->count();

        // Adds additional query conditions got from layer
        foreach ($conditions as $condition) {
            $query->condition($condition['field_name'],
              join(',', $condition['values']), $condition['operator']);
        }

        $entries_count = $query->execute();

        return $entries_count;

//        // ALTERNATIVE: Query string using SQL
//        $query = [];
//        $query['select'] = 'SELECT COUNT(*) FROM {node__field_location_entry} e';
//        // Add where conditions, consider always AND op
//        $query['join'][] = 'JOIN {node} n ON n.nid = e.field_location_entry_target_id';
//        $query['where'] = $conditions;
//        $query['where'][] = 'field_location_entry_target_id = ' . $country_nid;
//
//        // Query database
//        $entries = $this->database->query(
//          $query['select']
//                        . ' ' . join(' ', $query['join'])
//                        . ' WHERE ' . join(' AND ', $query['where'])
//        )->fetchField();

        // return $entries;
    }


    /**
     * Get countries entries count with conditions set in layer
     *
     * @param $layer_nid int, layer node id. If not set retrieve all entries from country.
     * @param $reset boolean, true tu recalculate entries count.
     *
     * @return array, iso2 -> entries count
     */
    public function getCountriesEntriesCount($layer_nid = null, $reset = false)
    {

        $countries_entries = [];

        // Get Countries if not calculated previously or reset required
        if ($reset || !$this->countries) {
            $this->countries = Node::loadMultiple($this->countryService->getCountries());
        }

        // Get Conditions from layer
        $conditions = $this->layerService->getLayerConditions($layer_nid);

        // For each country, get entries count
        foreach ($this->countries as $country) {

            // Get entries count
            $countries_entries[$country->get('field_iso2')->value] = array(
              'nid'     => $country->id(),
              'entries' => $this->getCountryEntriesCount($country->id(),
                $conditions)
            );

        }

        return $countries_entries;
    }

}
