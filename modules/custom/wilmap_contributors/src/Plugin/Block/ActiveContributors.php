<?php

namespace Drupal\wilmap_contributors\Plugin\Block;

use Drupal\Core\Block\BlockBase;

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

    $query = \Drupal::entityQuery('user')
      ->condition('status', 1)
      ->condition('roles', 'contributors');

    $uids = $query->execute();

    $users = entity_load_multiple ('user', $uids);

    $contributors = "<ul>";

    foreach ($users as $user){
      //$view_builder = \Drupal::entityManager()->getViewBuilder('user');
      //dump($view_builder);
      //$renderarray = $view_builder->view($user, 'teaser');
      //dump($renderarray);
      //$html = \Drupal::service('renderer')->renderRoot($renderarray);
      //$contributors .= "<li>".$html."</li>";
      

      //$urlimage = file_create_url($user->user_picture->entity->getFileUri());
      $contributors .= "<li>".$user->name->value."<br/>".$user->field_profile_title->value."</li>";

      //$contributors .= "<li>".entity_view($user,'teaser')."</li>";
      //dump($contributors);
    }

    $contributors .= "</ul>";

    //dump($contributors);

    return array(
      '#type' => 'markup',
      '#markup' => $contributors,
    );
  }

}
