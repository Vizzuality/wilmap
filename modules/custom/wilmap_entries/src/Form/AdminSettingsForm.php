<?php

/**
 * @file
 * Contains Drupal\wilmap_entries\Form\MessagesForm.
 */

namespace Drupal\wilmap_entries\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

class AdminSettingsForm extends ConfigFormBase {
  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'wilmap_entries.adminsettings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'wilmap_entries_admin_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('wilmap_entries.adminsettings');

    $form['permacc_api_key'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Perma.cc API key'),
      '#description' => $this->t('API key for Perma.cc'),
      '#default_value' => $config->get('permacc_api_key'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);

    $this->config('wilmap_entries.adminsettings')
      ->set('permacc_api_key', $form_state->getValue('permacc_api_key'))
      ->save();
  }
}
