<?php

namespace Drupal\wilmap_map\Plugin\rest\resource;

use Drupal\Core\Session\AccountProxyInterface;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpFoundation\Request;
use Psr\Log\LoggerInterface;
use Drupal\node\Entity\Node;

/**
 * Provides a resource to get country data from nid.
 *
 * @RestResource(
 *   id = "country_data_rest_resource",
 *   label = @Translation("Country Data Rest Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/country/data/nid/{nid}",
 *   }
 * )
 */
class CountryDataRestResource extends ResourceBase
{

    /**
     * A current user instance.
     *
     * @var \Drupal\Core\Session\AccountProxyInterface
     */
    protected $currentUser;
    /**
     *
     * @var \Symfony\Component\HttpFoundation\Request
     */
    protected $currentRequest;

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
    public function __construct(
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
          $container->get('request_stack')->getCurrentRequest()
        );
    }

    /**
     * Responds to GET requests.
     *
     * Returns country data in "group_data_popup" field group as defined in Country form.
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     *   Throws exception expected.
     */
    public function get($nid = null)
    {

        // You must to implement the logic of your REST Resource here.
        // Use current user after pass authentication to validate access.
        if (!$this->currentUser->hasPermission('access content')) {
            throw new AccessDeniedHttpException();
        }

        //
        // Only show fields in "group_data_popup" field_group in Country node type form
        $field_group = field_group_load_field_group('group_data_popup',
          'node', 'country', 'form', 'default');

        if (!isset($field_group->children)) {
            return array();
        }

        $node = Node::load($nid);

        if (!$node || $node->getType()!='country'){
            throw new AccessDeniedHttpException();
        }

        // Only fields from node in "group_data_popup" plus id, title and iso2
        $data = array();
        $data['id'] = $node->id();
        $data['title'] = $node->getTitle();
        $data['iso2'] = $node->get('field_iso2')->value;
        foreach ($field_group->children as $field_name) {
            $data[$field_name] = $node->get($field_name)->value;
        }

        return new ResourceResponse($data);
    }

}
