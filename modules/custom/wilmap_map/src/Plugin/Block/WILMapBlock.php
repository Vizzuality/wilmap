<?php

namespace Drupal\wilmap_map\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'MapBlock' block.
 *
 * @Block(
 *  id = "wilmap_block",
 *  admin_label = @Translation("WILMap block"),
 * )
 */
class WILMapBlock extends BlockBase {


//  /**
//   * {@inheritdoc}
//   */
//  public function defaultConfiguration() {
//    return [
//         'test' => $this->t('test'),
//        ] + parent::defaultConfiguration();
//
// }

//  /**
//   * {@inheritdoc}
//   */
//  public function blockForm($form, FormStateInterface $form_state) {
//    $form['test'] = [
//      '#type' => 'checkbox',
//      '#title' => $this->t('Test'),
//      '#description' => $this->t('test'),
//      '#default_value' => $this->configuration['test'],
//      '#weight' => '0',
//    ];
//
//    return $form;
//  }

//  /**
//   * {@inheritdoc}
//   */
//  public function blockSubmit($form, FormStateInterface $form_state) {
//    $this->configuration['test'] = $form_state->getValue('test');
//  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = array(
        '#theme' => 'wilmap_block',
        '#title' => 'WILMap',
        #'#test' => $this->configuration['test'],
        '#attached' => array(
          'library' => array('wilmap_map/wilmap'),
        ),
      );
    return $build;
  }

}
