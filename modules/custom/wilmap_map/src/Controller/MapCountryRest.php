<?php

namespace Drupal\wilmap_map\Controller;

use Drupal\Core\Controller\ControllerBase;

use Drupal\node\Entity\Node;
use Drupal\node\NodeInterface;
use Drupal\wilmap_map\CountryServices;
use Drupal\wilmap_map\MapServices;
use \Drupal\Core\Entity\EntityStorageInterface;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


/**
 * Class MapBrowsingRest.
 *
 * @package Drupal\wilmap_map\Controller
 */
class MapCountryRest extends ControllerBase
{

    /**
     * The node storage.
     *
     * @var \Drupal\Core\Entity\EntityStorageInterface
     */
    protected $nodeStorage;

    /**
     *
     * @var \Drupal\wilmap_map\CountryServices
     */
    protected $countryService;

    /**
     *
     * @var \Drupal\wilmap_map\MapServices
     */
    protected $mapService;

    /**
     * Constructs a new MapBrowsingRest object.

     * @param \Drupal\Core\Entity\EntityStorageInterface        $storage
     *   Map services instance.
     * @param \Drupal\wilmap_map\CountryServices                $country_service
     *   Map services instance.
     * @param \Drupal\wilmap_map\MapServices                    $map_service
     *   Map services instance.
     */
    public function __construct(
      EntityStorageInterface $storage,
      CountryServices $country_service,
      MapServices $map_services
    )
    {
        $this->nodeStorage = $storage;
        $this->countryService = $country_service;
        $this->mapService = $map_services;
    }

    /**
     * {@inheritdoc}
     */
    public static function create(ContainerInterface $container)
    {
        return new static(
          $container->get('entity.manager')->getStorage('node'),
          $container->get('wilmap_map.country'),
          $container->get('wilmap_map.map')
        );
    }

    /**
     *
     * Callback for `/api/country/data/iso2/{code}/layer/{layer}` API method.
     *
     * @param string                                                   $code
     *     iso2 country code. Ej: FR
     *
     * @param \Drupal\node\NodeInterface                               $layer
     *     layer node, null if not applied
     *
     * @param \Symfony\Component\HttpFoundation\Request                $request
     *     request object
     *
     * @return string
     *   Return JSON string containing browsing tree.
     */
    public function getByLayer($code, NodeInterface $layer = NULL, Request $request)
    {

        $country_nid = $this->countryService->getCountryFromIso($code);

        // Check there is a node with that iso2
        if (empty($country_nid)) {
            throw new NotFoundHttpException();
        }

        // Check node is a country
        $country = Node::load($country_nid);
        if (!$country || $country->getType() != 'country') {
            throw new NotFoundHttpException();
        }

        // Get country data
        $data = $this->mapService->getCountryDataByLayer($country, $layer);

        $response['data'] = $data;
        $response['method'] = 'GET';

        return new JsonResponse($response);

    }

    /**
     *
     * Callback for `/api/country/data/iso2/{code}/layer/{layer}` API method.
     *
     * @param string                                                   $code
     *     iso2 country code. Ej: FR
     *
     * @param \Drupal\node\NodeInterface                               $layer
     *     layer node, null if not applied
     *
     * @param \Symfony\Component\HttpFoundation\Request                $request
     *     request object
     *
     * @return string
     *   Return JSON string containing browsing tree.
     */
    public function get($code, Request $request)
    {

        $country_nid = $this->countryService->getCountryFromIso($code);

        // Check there is a node with that iso2
        if (empty($country_nid)) {
            throw new NotFoundHttpException();
        }

        // Check node is a country
        $country = Node::load($country_nid);
        if (!$country || $country->getType() != 'country') {
            throw new NotFoundHttpException();
        }

        // Get parameters from URL
        $params = $request->query->all();

        // Get conditions from parameters
        $conditions = $this->mapService->getMapConditionsFromParams($params);

        // Get country data
        $data = $this->mapService->getCountryData($country, $conditions);

        $response['data'] = $data;
        $response['method'] = 'GET';

        return new JsonResponse($response);

    }

}
