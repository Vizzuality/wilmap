<?php

namespace Drupal\empty_page\Form;

use Drupal\Core\Form\ConfirmFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\empty_page\Form\CallbackForm;
use Drupal\Core\Url;

/**
 * Provides a form to delete a empty page.
 */
class CallbackDeleteForm extends ConfirmFormBase {

  private $callback;

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'empty_page_callback_delete_form';
  }

  /**
   * {@inheritdoc}
   */
  public function getQuestion() {
    return $this->t('Are you sure you want to delete the callback for <em>:path</em>?', array(':path' => $this->callback->path));
  }

  /**
   * {@inheritdoc}
   */
  public function getConfirmText() {
    return $this->t('Delete callback');
  }

  /**
   * {@inheritdoc}
   */
  public function getCancelUrl() {
    return Url::fromRoute('empty_page.administration');
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $cid = NULL) {
    $callback = CallbackForm::emptyPageGetCallback($cid);
    $this->callback = $callback;
    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $callback = $this->callback;
    self::emptyPageDeleteCallback($callback->cid);
    \Drupal::service('router.builder')->rebuild();
    drupal_set_message(t('Callback <em>:path</em> deleted.', array(':path' => $callback->path)));
    $form_state->setRedirect('empty_page.administration');
  }

  /**
   * Delete an Empty Page callback.
   *
   * @param int $cid
   *   The callback id.
   */
  public static function emptyPageDeleteCallback($cid) {
    if (is_numeric($cid)) {
      db_delete('empty_page')
        ->condition('cid', $cid)
        ->execute();
    }
  }

}
