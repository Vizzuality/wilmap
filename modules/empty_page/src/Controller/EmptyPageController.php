<?php

namespace Drupal\empty_page\Controller;

use Drupal\Core\Url;
use Drupal\Core\Link;

/**
 * Manage empty pages.
 */
class EmptyPageController {

  /**
   * List out the pages created via empty page.
   */
  public function emptyPageList() {
    $header = array(
      t('INTERNAL PATH'),
      array(
        'data' => t('Operations'),
        'colspan' => 2,
      ),
    );
    $rows = array();
    $callbacks = self::emptyPageGetCallbacks();
    if (!empty($callbacks)) {
      foreach ($callbacks as $cid => $callback) {
        $view_url = Url::fromRoute('empty_page.page_' . $cid);
        $edit_url = Url::fromRoute('empty_page.edit_callback', ['cid' => $cid]);
        $delete_url = Url::fromRoute('empty_page.delete_callback', ['cid' => $cid]);
        $title = $callback->page_title ?: 'No title';
        $row    = array(
          \Drupal::l($title, $view_url),
          Link::fromTextAndUrl(t('Edit'), $edit_url),
          Link::fromTextAndUrl(t('Delete'), $delete_url),
        );
        $rows[] = $row;
      }
    }
    $table = array(
      '#type' => 'table',
      '#header' => $header,
      '#rows' => $rows,
      '#empty' => t('No callbacks exist yet.'),
    );
    $build = array(
      '#type' => 'details',
      '#title' => 'Manage',
      '#children' => $table,
      '#open' => TRUE,
    );
    return $build;
  }

  /**
   * Get all Empty Page callbacks.
   *
   * @return callbacks
   *   An Array of Callbacks.
   */
  public static function emptyPageGetCallbacks() {
    $callbacks = array();
    $results = db_select('empty_page')
      ->fields('empty_page', array('cid',
        'path',
        'page_title',
        'data',
        'changed',
        'created',
      ))
      ->orderBy('changed', 'DESC')
      ->execute();
    foreach ($results as $callback) {
      $callbacks[$callback->cid] = $callback;
    }
    return $callbacks;
  }

}
