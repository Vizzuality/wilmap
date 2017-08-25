<?php

namespace Drupal\wilmap_news\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class DigestForm.
 *
 * @package Drupal\wilmap_news\Form
 */
class DigestForm extends ConfigFormBase
{

    /**
     * {@inheritdoc}
     */
    protected function getEditableConfigNames()
    {
        return [
          'wilmap_news.digest',
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function getFormId()
    {
        return 'digest_form';
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(array $form, FormStateInterface $form_state)
    {
        $config = $this->config('wilmap_news.digest');
        $form['enabled'] = array(
          '#type' => 'checkbox',
          '#title' => $this->t('Enable automatic digests'),
          '#default_value' => $config->get('enabled'),
        );
        $form['title'] = [
          '#type'          => 'textfield',
          '#title'         => $this->t('Digest title'),
          '#description'   => $this->t('To set current date use PHP date format between brackets. Ex: "[F Y] updates report"'),
          '#default_value' => $config->get('title'),
        ];
        $form['days'] = [
          '#type'          => 'number',
          '#title'         => $this->t('Days'),
          '#description'   => $this->t('Generates digest every this ammount of days'),
          '#default_value' => $config->get('days'),
        ];

        $form['author'] = [
          '#type' => 'entity_autocomplete',
          '#target_type' => 'user',
          '#selection_settings' => ['include_anonymous' => FALSE],
          '#default_value' => ($config->get('author')) ? \Drupal\user\Entity\User::load($config->get('author')) : '',
          '#title' => $this->t('Authored by'),
          '#description' => $this->t('Digest author. Must be other than admin_WILMAP (uid=1)'),
        ];

        return parent::buildForm($form, $form_state);
    }

    /**
     * {@inheritdoc}
     */
    public function validateForm(array &$form, FormStateInterface $form_state)
    {
        parent::validateForm($form, $form_state);
    }

    /**
     * {@inheritdoc}
     */
    public function submitForm(array &$form, FormStateInterface $form_state)
    {
        parent::submitForm($form, $form_state);

        $this->config('wilmap_news.digest')
          ->set('enabled', $form_state->getValue('enabled'))
          ->set('title', $form_state->getValue('title'))
          ->set('days', $form_state->getValue('days'))
          ->set('author', $form_state->getValue('author'))
          ->save();
    }

}
