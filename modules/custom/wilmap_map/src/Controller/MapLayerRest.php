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
class MapLayerRest extends ControllerBase
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
     * @param \Drupal\node\NodeInterface                               $layer
     *     layer node, null if not applied
     *
     * @param \Symfony\Component\HttpFoundation\Request                $request
     *     request object
     *
     * @return string
     *   Return JSON string containing browsing tree.
     *
     * @deprecated
     */
    public function getFilters(NodeInterface $layer = NULL, Request $request)
    {

        // Check node is a country
        if (!$layer || $layer->getType() != 'layer') {
            throw new NotFoundHttpException();
        }

        // Get country data
        $params = $this->mapService->getParamsFromLayer( $layer->id() );

        $query_params=[];
        foreach ($params as $param => $values){
            $query_params[]=$param.'='.join(',', $values);
        }

        $response['query'] = join('&', $query_params);
        $response['parameters'] = $params;

        return new JsonResponse($response);

    }


}
