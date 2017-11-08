<?php

namespace Drupal\easy_install\Form;

use Drupal\Core\Config\ConfigManagerInterface;
use Drupal\Core\Config\Entity\ConfigDependencyDeleteFormTrait;
use Drupal\Core\Entity\EntityManagerInterface;
use Drupal\Core\Extension\ModuleInstallerInterface;
use Drupal\Core\Form\ConfirmFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\KeyValueStore\KeyValueStoreExpirableInterface;
use Drupal\Core\Config\InstallStorage;

/**
 * Builds a confirmation form to uninstall selected modules.
 */
class PurgeConfigurationsConfirmForm extends ConfirmFormBase {
  use ConfigDependencyDeleteFormTrait;

  /**
   * The module installer service.
   *
   * @var \Drupal\Core\Extension\ModuleInstallerInterface
   */
  protected $moduleInstaller;

  /**
   * The expirable key value store.
   *
   * @var \Drupal\Core\KeyValueStore\KeyValueStoreExpirableInterface
   */
  protected $keyValueExpirable;

  /**
   * The configuration manager.
   *
   * @var \Drupal\Core\Config\ConfigManagerInterface
   */
  protected $configManager;

  /**
   * The entity manager.
   *
   * @var \Drupal\Core\Entity\EntityManagerInterface
   */
  protected $entityManager;

  /**
   * An array of modules to uninstall.
   *
   * @var array
   */
  protected $modules = [];

  /**
   * Constructs a ModulesUninstallConfirmForm object.
   *
   * @param \Drupal\Core\Extension\ModuleInstallerInterface $module_installer
   *   The module installer.
   * @param \Drupal\Core\KeyValueStore\KeyValueStoreExpirableInterface $key_value_expirable
   *   The key value expirable factory.
   * @param \Drupal\Core\Config\ConfigManagerInterface $config_manager
   *   The configuration manager.
   * @param \Drupal\Core\Entity\EntityManagerInterface $entity_manager
   *   The entity manager.
   */
  public function __construct(ModuleInstallerInterface $module_installer, KeyValueStoreExpirableInterface $key_value_expirable, ConfigManagerInterface $config_manager, EntityManagerInterface $entity_manager) {
    $this->moduleInstaller = $module_installer;
    $this->keyValueExpirable = $key_value_expirable;
    $this->configManager = $config_manager;
    $this->entityManager = $entity_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('module_installer'),
      $container->get('keyvalue.expirable')->get('easy_install_purgeconfigs'),
      $container->get('config.manager'),
      $container->get('entity.manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getQuestion() {
    return $this->t('Confirm Purge Configurations');
  }

  /**
   * {@inheritdoc}
   */
  public function getConfirmText() {
    return $this->t('Purge Configurations');
  }

  /**
   * {@inheritdoc}
   */
  public function getCancelUrl() {
    return new Url('easy_install.purge_configurations');
  }

  /**
   * {@inheritdoc}
   */
  public function getDescription() {
    return $this->t('Would you like to continue with purge the above?');
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'purge_configuration_confirm_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    // Retrieve the list of modules from the key value store.
    $account = $this->currentUser()->id();
    $this->modules = $this->keyValueExpirable->get($account);
    // Prevent this page from showing when the module list is empty.
    if (empty($this->modules['install'])) {
      drupal_set_message($this->t('The selected modules could not be Purged, either due to a website problem or due to the uninstall confirmation form timing out. Please try again.'), 'error');
      return $this->redirect('easy_install.purge_configurations');
    }

    $form['text']['#markup'] = '<p>' . $this->t('Select the following configurations, selected configs will be completely deleted from your site!') . '</p>';
    $form['modules'] = [
      '#theme' => 'item_list',
      '#items' => $this->modules['install'],
    ];
    foreach ($this->modules['install'] as $module => $module_name) {
      $install_dir = drupal_get_path('module', $module) . '/' . InstallStorage::CONFIG_INSTALL_DIRECTORY;
      $details = file_scan_directory($install_dir, "/\.(yml)$/");
      if (!empty($details)) {
        $form['modules_config'][$module] = [
          '#type' => 'details',
          '#title' => t('@name', ['@name' => $module]),
          '#description' => t('We found that @description module have configurations with it, if you like to delete it Please select the checkbox', ['@description' => $module]),
          '#weight' => 0,
          '#validated' => TRUE,
          '#open' => TRUE,
        ];
        $details = file_scan_directory($install_dir, "/\.(yml)$/");
        $options = [];
        foreach ($details as $config_value) {
          $options[$config_value->name] = $config_value->name;
        }
        if(!empty($options)) {
          $form['modules_config'][$module]['configs'] = [
            '#type' => 'checkboxes',
            '#label' => $config_value->name,
            '#title' => t('Select the configurations to be deleted'),
            '#options' => $options,
            '#validated' => TRUE,
          ];
        }
      }
    }
    if(!empty($options)) {
      $form['all_configs'] = [
        '#type' => 'checkbox',
        '#label' => t('Delete all the listed configurations'),
        '#title' => t('Delete all the listed configurations'),
        '#validated' => TRUE,
      ];
    }

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Clear the key value store entry.
    $account = $this->currentUser()->id();
    $configs = $form_state->getValue('configs') ? $form_state->getValue('configs') : [];
    if ($form_state->getValue('all_configs') != 0) {
      foreach ($configs as $key => $value) {
        \Drupal::configFactory()->getEditable($key)->delete();
      }
    }
    else {
      foreach ($configs as $key => $values) {
        if ($values !== 0) {
          \Drupal::configFactory()->getEditable($key)->delete();
        }
      }
    }

    $this->keyValueExpirable->delete($account);

    drupal_set_message($this->t('The selected configurations have
      been deleted.'));
    $form_state->setRedirectUrl($this->getCancelUrl());
  }

}
