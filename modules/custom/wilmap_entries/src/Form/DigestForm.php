<?php

namespace Drupal\wilmap_entries\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class DigestForm.
 *
 * @package Drupal\wilmap_entries\Form
 */
class DigestForm extends ConfigFormBase
{

    /**
     * {@inheritdoc}
     */
    protected function getEditableConfigNames()
    {
        return [
          'wilmap_entries.digest',
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
        $config = $this->config('wilmap_entries.digest');
        $form['enabled'] = array(
          '#type' => 'checkbox',
          '#title' => $this->t('Enable automatic digests'),
          '#default_value' => $config->get('enabled'),
        );
        $form['title'] = [
          '#type'          => 'textfield',
          '#title'         => $this->t('Digest title'),
          '#description'   => $this->t('Digest title. Ex "Monthly WILMap digest"'),
          '#default_value' => $config->get('title'),
        ];
        $form['days'] = [
          '#type'          => 'number',
          '#title'         => $this->t('Days'),
          '#description'   => $this->t('Generates digest every this ammount of days'),
          '#default_value' => $config->get('days'),
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

        $this->config('wilmap_entries.digest')
          ->set('enabled', $form_state->getValue('enabled'))
          ->set('title', $form_state->getValue('title'))
          ->set('days', $form_state->getValue('days'))
          ->save();
    }

}
