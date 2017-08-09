<?php

namespace Drupal\wilmap_map\Plugin\rest\resource;

use Drupal\Core\Session\AccountProxyInterface;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpFoundation\Request;
use Psr\Log\LoggerInterface;

/**
 * Provides a resource to get all countries entries.
 *
 * @RestResource(
 *   id = "countries_entries_count_rest_resource",
 *   label = @Translation("Countries entries count Rest Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/countries/entries/count",
 *   }
 * )
 */
class CountriesEntriesCountRestResource extends ResourceBase
{

    /**
     * A current user instance.
     *
     * @var \Drupal\Core\Session\AccountProxyInterface
     */
    protected
      $currentUser;
    /**
     *
     * @var \Symfony\Component\HttpFoundation\Request
     */
    protected
      $currentRequest;

    /**
     * Constructs a new CountryRestResource object.
     *
     * @param array                                      $configuration
     *   A configuration array containing information about the plugin instance.
     * @param string                                     $plugin_id
     *   The plugin_id for the plugin instance.
     * @param mixed                                      $plugin_definition
     *   The plugin implementation definition.
     * @param array                                      $serializer_formats
     *   The available serialization formats.
     * @param \Psr\Log\LoggerInterface                   $logger
     *   A logger instance.
     * @param \Drupal\Core\Session\AccountProxyInterface $current_user
     *   A current user instance.
     */
    public
    function __construct(
      array $configuration,
      $plugin_id,
      $plugin_definition,
      array $serializer_formats,
      LoggerInterface $logger,
      AccountProxyInterface $current_user,
      Request $current_request
    ) {
        parent::__construct($configuration, $plugin_id, $plugin_definition,
          $serializer_formats, $logger);

        $this->currentUser = $current_user;
        $this->currentRequest = $current_request;
    }

    /**
     * {@inheritdoc}
     */
    public
    static function create(
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
          $container->get('request_stack')->getCurrentRequest()
        );
    }

    /**
     * Responds to GET requests.
     *
     * Returns entries by country that satisfied conditions of given layer. If
     * no layer provided all entries returned for each country.
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     *   Throws exception expected.
     *
     * @return array assoc array with country iso2 and entries count
     */
    public
    function get()
    {

        // Use current user after pass authentication to validate access.
        if (!$this->currentUser->hasPermission('access content')) {
            throw new AccessDeniedHttpException();
        }

        // Use 'wilmap_map.map' service to retrieve countries entries.
        $countries_entries = \Drupal::service('wilmap_map.map')
          ->getCountriesEntriesCount();

        return new ResourceResponse($countries_entries);
    }

}
