<?php
/**
 * User: jorge
 * Date: 3/10/17
 * Time: 9:14
 */

$nodes = \Drupal::entityTypeManager()
  ->getStorage('node')
  ->loadByProperties(array('type' => 'your_content_type'));

foreach ($nodes as $node) {
    $node->delete();
}