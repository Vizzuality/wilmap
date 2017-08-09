<?php

namespace Drupal\wilmap_map\Plugin\rest\resource;

use Drupal\Core\Session\AccountProxy;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpFoundation\Request;
use Psr\Log\LoggerInterface;
use Drupal\wilmap_map\MapServices;


/**
 * Provides a resource to get countries entries depending on layer conditions.
 *
 * @RestResource(
 *   id = "countries_entries_by_layer_count_rest_resource",
 *   label = @Translation("Countries entries by layer count Rest Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/countries/entries/count/{layer}",
 *   }
 * )
 */
class CountriesEntriesByLayerCountRestResource extends ResourceBase
{

    /**
     * A current user instance.
     *
     * @var \Drupal\Core\Session\AccountProxy
     */
    protected $currentUser;
    /**
     *
     * @var \Symfony\Component\HttpFoundation\Request
     */
    protected $currentRequest;
    /**
     *
     * @var \Drupal\wilmap_map\MapServices
     */
    protected $map;

    /**
     * Constructs a new CountryRestResource object.
     *
     * @param array                                         $configuration
     *   A configuration array containing information about the plugin instance.
     * @param string                                        $plugin_id
     *   The plugin_id for the plugin instance.
     * @param mixed                                         $plugin_definition
     *   The plugin implementation definition.
     * @param array                                         $serializer_formats
     *   The available serialization formats.
     * @param \Psr\Log\LoggerInterface                      $logger
     *   A logger instance.
     * @param \Drupal\Core\Session\AccountProxy             $current_user
     *   A current user instance.
     * @param \Symfony\Component\HttpFoundation\Request     $current_request
     *   A current user instance.
     * @param \Drupal\wilmap_map\MapServices                $map_service
     *   A current user instance.
     */
    public function __construct(
      array $configuration,
      $plugin_id,
      $plugin_definition,
      array $serializer_formats,
      LoggerInterface $logger,
      AccountProxy $current_user,
      Request $current_request,
      MapServices $map_service
    ) {
        parent::__construct($configuration, $plugin_id, $plugin_definition,
          $serializer_formats, $logger);

        $this->currentUser = $current_user;
        $this->currentRequest = $current_request;
        $this->map = $map_service;
    }

    /**
     * {@inheritdoc}
     */
    public static function create(
      ContainerInterface $container,
      array $configuration,
      $plugin_id,
      $plugin_definition
    ) {
        return new static(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $container->getParameter('serializer.formats'),
          $container->get('logger.factory')->get('wilmap_map'),
          $container->get('current_user'),
          $container->get('request_stack')->getCurrentRequest(),
          $container->get('wilmap_map.map')
        );
    }

    /**
     * Responds to GET requests.
     *
     * Returns entries by country that satisfied conditions of given layer. If
     * no layer provided all entries returned for each country.
     *
     * @param $layer_nid int layer nid, all entries by default.
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     *   Throws exception expected.
     *
     * @return string json assoc array with country iso2 and entries count
     */
    public function get($layer_nid = null)
    {

        // Use current user after pass authentication to validate access.
        if (!$this->currentUser->hasPermission('access content')) {
            throw new AccessDeniedHttpException();
        }

        // Use 'wilmap_map.map' service to retrieve countries entries.
        $countries_entries = $this->map->getCountriesEntriesCount($layer_nid);

        return new ResourceResponse($countries_entries);
    }

}
