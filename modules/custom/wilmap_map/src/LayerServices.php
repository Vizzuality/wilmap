<?php

namespace Drupal\wilmap_map;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\Query\QueryFactory;
use \Drupal\node\Entity\Node;

/**
 * Class LayerServices.
 *
 * @package Drupal\wilmap_map
 */
class LayerServices
{

    /**
     * @var \Drupal\Core\Entity\EntityTypeManagerInterface
     */
    protected $entityTypeManager;
    /**
     * @var \Drupal\Core\Entity\Query\QueryFactory
     */
    protected $entityQuery;

    /**
     * DebugCommand constructor.
     *
     * @param EntityTypeManagerInterface $entityTypeManager
     * @param QueryFactory               $entityQuery
     */
    public function __construct(
      EntityTypeManagerInterface $entityTypeManager,
      QueryFactory $entityQuery
    ) {
        $this->entityTypeManager = $entityTypeManager;
        $this->entityQuery = $entityQuery;

    }

    /**
     * {@inheritdoc}
     */
    public
    static function create(
      ContainerInterface $container
    ) {
        return new static(
          $container->get('entity_type.manager'),
          $container->get('entity.query')
        );
    }


    /**
     * Get Layer from nid
     *
     * @param $nid , layer node id
     *
     * @return \Drupal\Core\Entity\EntityInterface|null
     */
    public
    function getLayer(
      $nid
    ) {
        return Node::load($nid);
    }

    /**
     * Get Layer from nid
     *
     * @param $nid , layer node id
     *
     * @return array
     *  assoc array with conditions (field_name, value)
     */
    public
    function getLayerConditions(
      $nid
    ) {
        $conditions = [];

        // Get field conditions from Layer
        // Each field value in Layer defines a condition
        if ($layer = $this->getLayer($nid)) {
            // var_dump($layer->toArray());

            // Get node fields definitions and get only fields with name "field_"
            $fields = array_filter($layer->getFieldDefinitions(),
              function ($key) {
                  return strpos($key, 'field_') === 0;
              },
              ARRAY_FILTER_USE_KEY);

            // Get non empty fields
            foreach ($fields as $field_name => $field_definition) {
                if ($value = $layer->get($field_name)->getValue()) {
//                    var_dump($field_name);
//                    var_dump(array_column($value, 'target_id'));

                    // field_year and field_year_to special treatment
                    switch ($field_name) {
                        case 'field_year':
                            $condition_field = 'field_year';
                            $condition_value = $value[0]['value'];
                            $condition_operator = '>=';
                            break;
                        case 'field_year_to':
                            $condition_field = 'field_year';
                            $condition_value = $value[0]['value'];
                            $condition_operator = '<=';
                            break;
                        default:
                            $condition_field = $field_name;
                            $condition_value = array_column($value, 'target_id');
                            $condition_operator = 'in';
                    }

                    // Add condition to conditions
                    $conditions[] = array(
                      'field_name' => $condition_field,
                      'values'     => (array) $condition_value,
                      'operator'   => $condition_operator
                    );

                }
            }
        }

        return $conditions;
    }

}
