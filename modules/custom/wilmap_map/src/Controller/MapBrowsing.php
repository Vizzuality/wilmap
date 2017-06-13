<?php

namespace Drupal\wilmap_map\Controller;

use Drupal\Core\Controller\ControllerBase;

use Drupal\node\Entity\Node;
use Symfony\Component\DependencyInjection\ContainerInterface;
use \Drupal\Core\Entity\EntityStorageInterface;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Class MapBrowsing.
 *
 * @package Drupal\wilmap_map\Controller
 */
class MapBrowsing extends ControllerBase
{

    /**
     * The node storage.
     *
     * @var \Drupal\Core\Entity\EntityStorageInterface
     */
    protected $nodeStorage;

    /**
     * Constructs a new MapBrowsing object.
     */
    public function __construct(EntityStorageInterface $storage)
    {
        $this->nodeStorage = $storage;
    }

    /**
     * {@inheritdoc}
     */
    public static function create(ContainerInterface $container)
    {
        return new static(
          $container->get('entity.manager')->getStorage('node')
        );
    }

    /**
     *
     * Callback for `api/map/browse.json` API method.
     *
     * @return string
     *   Return JSON string containing browsing tree.
     */
    public function get(Request $request)
    {

        $tree = array();
        $continents = $this->get_continents();

        kint($continents);

        foreach ($continents as $nid) {
            $tree[$nid] = $this->set_tree_leaf($nid);

            // For each Continent get its regions
            $continent['regions'] = $this->get_regions($nid);

//            // For each Continent get its countries
//            $continent['countries'] = $this->get_countries($nid);

        }

        // TODO: clean json data

        $response['data'] = $tree;
        $response['method'] = 'GET';

        return new JsonResponse($response);

    }

    /**
     *
     * Get continents
     *
     * @return array
     *   Return array with node ids.
     */
    public function get_continents()
    {

        // Get continents
        $continent_nids = $this->nodeStorage->getQuery()
          ->condition('status', \Drupal\node\NodeInterface::PUBLISHED)
          ->condition('type', 'continent')
          ->execute();

        return $continent_nids;

    }

    /**
     *
     * Get all regions from given continent. If continent not provided,
     * all regions returned.
     *
     * @param $continent continent node nid
     *
     * @return array
     *   Return array with node continents.
     */
    public function get_regions($continent_nid)
    {
        $query = $this->nodeStorage->getQuery()
          ->condition('status', \Drupal\node\NodeInterface::PUBLISHED)
          ->condition('type', 'region');

        if ($continent_nid) {
            $query->condition('field_continent.entity.target', $continent_nid);
        }

        return $query->execute;
    }

    /**
     *
     * Get all continent from given continent. If continent not provided,
     * all continent returned.
     *
     * @param $continent continent node nid
     *
     * @return array
     *   Return array with node continents.
     */
    public function get_countries($continent_nid)
    {
        $countries = array();

        return $countries;

    }

    /**
     *
     * Set a browser tree leaf from node.
     *
     * @param $nid node nid
     *
     * @return array
     *   Return leaf array.
     */
    private function set_tree_leaf($nid)
    {
        $node = Node::load($nid);

        return array(
          'title' => $node->title->value,
          'path'  => \Drupal::service('path.alias_manager')
            ->getAliasByPath('/node/' . $nid)
        );

    }


}
