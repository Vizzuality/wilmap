<?php

namespace Drupal\empty_page\Routing;

use Symfony\Component\Routing\Route;
use Drupal\empty_page\Controller\EmptyPageController;

/**
 * Defines a route subscriber to register a url from empty pages.
 */
class EmptyPages {

  /**
   * {@inheritdoc}
   */
  public function routes() {
    $routes = array();
    $callbacks = EmptyPageController::emptyPageGetCallbacks();
    foreach ($callbacks as $cid => $callback) {
      $routes['empty_page.page_' . $cid] = new Route(
        $callback->path,
        array(
          '_controller' => '\Drupal\empty_page\Controller\EmptyPage::emptyCallback',
          '_title' => $callback->page_title,
        ),
        array(
          '_permission'  => 'view empty pages',
        )
      );
    }
    return $routes;
  }

}
