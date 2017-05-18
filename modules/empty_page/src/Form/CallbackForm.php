<?php

namespace Drupal\empty_page\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Builds the form for callbacks add/edit form.
 */
class CallbackForm extends FormBase {

  private $cid;

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'empty_page_callback_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $cid = NULL) {
    // If $cid exists, we're editing.
    $callback = NULL;
    if (!empty($cid)) {
      $callback = self::emptyPageGetCallback($cid);
    }
    if ($callback) {
      $this->cid = $callback->cid;
      $form_title = t('Edit callback');
    }
    else {
      $form_title = t('Create a new callback');
    }
    $form['empty_page_basic'] = array(
      '#type' => 'details',
      '#title' => $form_title,
      '#description' => '',
      '#open' => TRUE,
    );
    $form['empty_page_basic']['empty_page_callback_path'] = array(
      '#type' => 'textfield',
      '#title' => t('Internal path'),
      '#description' => '',
      '#required' => 1,
      '#default_value' => $callback ? $callback->path : '',
    );
    $form['empty_page_basic']['empty_page_callback_page_title'] = array(
      '#type' => 'textfield',
      '#title' => t('Page title'),
      '#description' => '',
      '#default_value' => $callback ? $callback->page_title : '',
    );
    $form['empty_page_basic']['buttons']['submit'] = array(
      '#type' => 'submit',
      '#value' => $callback ? t('Save') : t('Add'),
    );

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {

  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $values = $form_state->getValues();

    $callback = new \stdClass();

    if ($this->cid) {
      // We're editing an existing callback.
      $callback->cid = $this->cid;
    }
    else {
      // This is a new editor.
      $callback->created = REQUEST_TIME;
    }

    $callback->path = $values['empty_page_callback_path'];
    $callback->page_title = $values['empty_page_callback_page_title'];
    // TODO: Handle saving of custom perms.
    $callback->changed = REQUEST_TIME;

    $this->emptyPageSaveCallback($callback);
    \Drupal::service('router.builder')->rebuild();
    drupal_set_message(t('Changes saved.'));
    $form_state->setRedirect('empty_page.administration');
  }
  /**
   * Get an Empty Page callback.
   *
   * @param int $cid
   *   The Callback id.
   *
   * @return object $callback
   *   The Callback Object.
   */
  public static function emptyPageGetCallback($cid) {
    $callback = db_select('empty_page')
      ->fields('empty_page', array('cid',
        'path',
        'page_title',
        'data',
        'changed',
        'created',
      ))
      ->condition('cid', $cid)
      ->execute()
      ->fetchObject();
    return $callback;
  }
  /**
   * Save an Empty Page callback.
   *
   * @param object $callback
   *   The callback object.
   *
   * @return int $cid
   *   The callback id.
   */
  public function emptyPageSaveCallback($callback) {
    if (property_exists($callback, 'cid')) {
      db_update('empty_page')
        ->fields(array(
          'path' => $callback->path,
          'page_title' => $callback->page_title,
          'changed' => REQUEST_TIME,
        ))
        ->condition('cid', $callback->cid)
        ->execute();
      $ret = $callback->cid;
    }
    else {
      $id = db_insert('empty_page')
        ->fields(array(
          'path' => $callback->path,
          'page_title' => $callback->page_title,
          'created' => REQUEST_TIME,
          'changed' => REQUEST_TIME,
        ))
        ->execute();
      $ret = $id;
    }
    return $ret;
  }

}
