<?php

namespace Drupal\wilmap_contributors\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\user\Entity\User;
use Drupal\Core\Database\Connection;

/**
 * Provides a 'Active contributors' block.
 *
 * Drupal\Core\Block\BlockBase gives us a very useful set of basic functionality
 * for this configurable block. 
 *
 * @Block(
 *   id = "ActiveContributors",
 *   admin_label = @Translation("Active contributors"),
 *   category = @Translation("Active contributors of a country/region"),
 * )
 */
class ActiveContributors extends BlockBase {
  /**
   * {@inheritdoc}
   */
  public function build() {

    //Get the nid of the country/region from the URL
    $node = \Drupal::routeMatch()->getParameter('node');
    if ($node){
      $nid = $node->id();
    }

    //Get the uids who has made a revision of the conuntry/region
    $connection = \Drupal::database();
        
    $query = $connection->select('node_revision', 'e')
      ->fields('e', array('revision_uid'))
      ->condition('e.nid', $nid); 
        
    $revision_uids = $query->execute()->fetchAllKeyed();
    $keys = array_keys($revision_uids);
    
    //Select only the contributors
    $query = \Drupal::entityQuery('user')
      ->condition('status', 1)
      ->condition('roles', 'contributors')
      ->condition('uid', $keys, 'IN');

    $uids = $query->execute();

    $contributors = User::loadMultiple($uids);
    
    // Render each user using 'avatar' display
    return user_view_multiple($contributors, 'teaser');
    
    //        // Render each user using 'teaser' display
    //        $items = [];
    //        foreach ($contributors as $key => $contributor) {
    //            $items[$key] = user_view($contributor, 'teaser');
    //        }
    //
    //        $content = [
    //          '#theme'              => 'item_list',
    //          '#list_type'          => 'ul',
    //          '#title'              => 'My List',
    //          '#items'              => $items,
    //          '#attributes'         => ['class' => ['mylist']],
    //          '#wrapper_attributes' => ['class' => ['container']],
    //        ];
    //        return $content;
  }

}
