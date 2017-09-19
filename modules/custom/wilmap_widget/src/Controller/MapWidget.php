<?php

namespace Drupal\wilmap_widget\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\EntityManager;

/**
 * Class MapWidget.
 *
 * @package Drupal\wilmap_widget\Controller
 */
class MapWidget extends ControllerBase {

  /**
   * Drupal\Core\Entity\EntityManager definition.
   *
   * @var \Drupal\Core\Entity\EntityManager
   */
  protected $entityManager;

  /**
   * Constructs a new MapWidget object.
   */
  public function __construct(EntityManager $entity_manager) {
    $this->entityManager = $entity_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity.manager')
    );
  }

  /**
   * Get.
   *
   * @return string
   *   Return Hello string.
   */
  public function get() {

    // Allow embedding
    //  $request->headers->remove('X-Frame-Options');

    // We return nothing as only need to render blocks placed in this page
    // To place any block go to /admin/structure/block
    return [
      '#type' => 'markup',
      '#markup' => '',
    ];
  }

}
