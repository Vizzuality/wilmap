<?php

namespace Drupal\wilmap_map;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Database\Connection;
use Drupal\node\Entity\Node;
use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\Core\Entity\EntityManagerInterface;
use Drupal\Core\DependencyInjection\DependencySerializationTrait;
use Drupal\Core\StringTranslation\StringTranslationTrait;

//use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class MapServices.
 *
 * @package Drupal\wilmap_map
 *
 * @see \Drupal\Core\DependencyInjection\ContainerInjectionInterface
 */
class MapServices implements ContainerInjectionInterface
{

    use StringTranslationTrait;
    use DependencySerializationTrait {
        __wakeup as defaultWakeup;
        __sleep as defaultSleep;
    }
    /**
     * @var \Drupal\Core\Entity\EntityManagerInterface
     */
    protected $entityManager;
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
     * @var \Drupal\taxonomy\TermStorage
     */
    protected $termStorage;
//    /*
//     * @var \Symfony\Component\HttpFoundation\RequestStack
//     */
//    protected $requestStack;

    /**
     * Implements __construct().
     *
     * @param \Drupal\Core\Entity\EntityManagerInterface     $entity_manager
     *   Entity Manager.
     *
     * @param \Drupal\Core\Database\Connection               $database
     *   Database Service Object.
     *
     * @param \Drupal\Core\Entity\Query\QueryFactory         $query_factory
     *   Query Factory Service Object.
     *
     * @param \Drupal\wilmap_map\CountryServices             $country_services
     *   Country Service Object.
     *
     * @param \Drupal\wilmap_map\LayerServices               $layer_services
     *   Layer Service Object.
     *
     * @param \Symfony\Component\HttpFoundation\RequestStack $request_stack
     *   RequestStack object
     */
    public function __construct(
      EntityManagerInterface $entity_manager,
      Connection $database,
      QueryFactory $query_factory,
      CountryServices $country_services,
      LayerServices $layer_services
        //, RequestStack $request_stack
    )
    {
        $this->entityManager = $entity_manager;
        $this->database = $database;
        $this->entityQueryFactory = $query_factory;
        $this->countryService = $country_services;
        $this->layerService = $layer_services;
        $this->termStorage = $entity_manager->getStorage('taxonomy_term');
        // $this->requestStack = $request_stack;
    }

    /**
     * @var array countries
     *   Available countries.
     */
    private $countries;

    /**
     * {@inheritdoc}
     */
    public static function create(ContainerInterface $container)
    {
        return new static(
          $container->get('entity.manager'),
          $container->get('database'),
          $container->get('entity.query'),
          $container->get('wilmap_map.country'),
          $container->get('wilmap_map.layer')
        //, $container->get('request_stack')
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
            // Array join if multiple values
//            $values = (is_array($condition['values'])) ? join(',',
//              $condition['values']) : $condition['values'];
            $query->condition($condition['field_name'], $condition['values'],
              $condition['operator']);
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
     * Get countries entries count with conditions set
     *
     * @param $conditions array, conditions to apply to query like in
     *      getCountryEntriesCount()
     * @param $reset boolean, true tu recalculate entries count.
     *
     * @return array, iso2 -> entries count
     */
    public function getCountriesEntriesCount($conditions, $reset = false)
    {

        $countries_entries = [];

        // Get Countries if not calculated previously or reset required
        if ($reset || !$this->countries) {
            $this->countries = Node::loadMultiple($this->countryService->getCountries());
        }

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

    /**
     * Get countries entries count with conditions set in layer
     *
     * @param $layer_nid int, layer node id. If not set retrieve all entries from country.
     * @param $reset boolean, true tu recalculate entries count.
     *
     * @return array, iso2 -> entries count
     */
    public function getCountriesEntriesCountByLayer(
      $layer_nid = null,
      $reset = false
    ) {

        $countries_entries = [];
        $conditions = [];

        // Get Countries if not calculated previously or reset required
        if ($reset || !$this->countries) {
            $this->countries = Node::loadMultiple($this->countryService->getCountries());
        }

        // Get Conditions if layer present
        if ($layer_nid) {
            $conditions = $this->layerService->getLayerConditions($layer_nid);
        }

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

    /**
     * Get countries entries count with conditions
     *
     * @param \Drupal\node\NodeInterface $country
     *     country node object
     * @param array $layer
     *     conditions array, null to get all country data
     *
     * @return array, iso2 -> country data for selected layer
     */
    public function getCountryData ($country, $conditions = null)
    {

        // Entries with:
        // - "Legislation" (vid='section', tid=125 and children)
        // - "Bills and Pending Proposals" (vid='section', tid=126 and children)
        // - "Decisions" (vid='section', tid=127 and children)
        $terms_shown = [125, 126, 127];

        // Basic country date
        $data = array();
        $data['id'] = $country->id();
        $data['title'] = $country->getTitle();
        $data['iso2'] = $country->get('field_iso2')->value;
        $data['values'] = [];

        // Return data for each term to show.
        // For each term launch a query with base conditions and a specific
        // condition for the term to show an its children
        foreach ($terms_shown as $term_id) {

            // Get term
            $term = \Drupal\taxonomy\Entity\Term::load($term_id);

            // Get term children
            $children = $this->termStorage->loadTree('section', $term_id, null,
              false);

            // Get terms ids from terms
            $terms = $this->getTermsIds($children);

            // Add the term itself to the array
            $terms[] = (string) $term_id;

            // Generate condition from term ids
            $term_condition[0] = [
              'field_name' => 'field_tax_section',
              'values'     => $terms,
              'operator'   => 'IN'
            ];

            // Return data for this term
            $data['values'][$term_id] = [
              'label' => $term->label(),
              'count' => $this->getCountryEntriesCount($country->id(),
                array_merge($conditions, $term_condition))
            ];
        }

        return $data;
    }


    /**
     * Get countries entries count with conditions set in layer
     *
     * @param \Drupal\node\NodeInterface $country
     *     country node object
     * @param \Drupal\node\NodeInterface $layer
     *     layer node object, null to get all country data
     *
     * @return array, iso2 -> country data for selected layer
     */
    public function getCountryDataByLayer ($country, $layer = null)
    {

        $conditions = [];

        // Get Conditions if layer present
        if ($layer && $layer->getType() == 'layer') {
            $conditions = $this->layerService->getLayerConditions($layer->id());
        }

        return $this->getCountryData($country, $conditions);

    }

    /**
     * Get Map conditions from parameters
     *
     * @param $params , parameters
     *
     * @return array
     *  assoc array with conditions (field_name, value)
     */
    public function getMapConditionsFromParams(
      $params
    ) {

        // URL parameters mapping with Entry fields

        $parameter_field_mapping = [
          'country'           => 'field_location_entry',
          'claim'             => 'field_tax_topic_claim_defense',
          'document'          => 'field_tax_document.type',
          'fromyear'          => 'field_year',
          'toyear'            => 'field_year_to',
          'section'           => 'field_tax_section',
          'issuing'           => 'field_tax_issuing_entity',
          'liability'         => 'field_tax_type_liability',
          'law'               => 'field_tax_type_law',
          'service'           => 'field_tax_type_service_provider',
          'general_immunity'  => 'field_tax_general_immunity',
          'general_liability' => 'field_tax_general_liability',
          'title'             => 'title'
        ];

        $conditions = [];

        // Set a condition for each param
        foreach ($params as $param => $value) {

            // Only parameters mapped with fields, ignore others
            if (array_key_exists($param, $parameter_field_mapping)) {

                // Get field mapped with param
                $field = $parameter_field_mapping[$param];

                // Fields special treatments
                switch ($field) {
                    case 'title':
                        $condition_field = 'title';
                        $condition_value = $value;
                        $condition_operator = 'CONTAINS';
                        break;
                    case 'field_year':
                        $condition_field = 'field_year';
                        $condition_value = $value;
                        $condition_operator = '>=';
                        break;
                    case 'field_year_to':
                        $condition_field = 'field_year';
                        $condition_value = $value;
                        $condition_operator = '<=';
                        break;
                    default:
                        $condition_field = $field;
                        $condition_value = explode(',', $value);
                        $condition_operator = 'IN';
                }

                // Add condition to conditions
                $conditions[] = array(
                  'field_name' => $condition_field,
                  'values'     => $condition_value,
                  'operator'   => $condition_operator
                );
            }


        }

        return $conditions;
    }


    /**
     * Get terms id from array of terms objects
     *
     * @param array $terms
     *     Array of term objects
     *
     * @return array
     *      Array with terms ids
     */
    private function getTermsIds($terms)
    {
        $tids = [];
        foreach ($terms as $term) {
            $tids[] = $term->tid;
        }
        return $tids;
    }
}
