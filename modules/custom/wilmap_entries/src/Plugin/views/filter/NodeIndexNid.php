<?php

namespace Drupal\wilmap_entries\Plugin\views\filter;

use Drupal\Core\Entity\Element\EntityAutocomplete;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;
use Drupal\node\NodeStorageInterface;
use Drupal\views\ViewExecutable;
use Drupal\views\Plugin\views\display\DisplayPluginBase;
use Drupal\views\Plugin\views\filter\ManyToOne;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Filter by node id.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("node_index_nid")
 */
class NodeIndexNid extends ManyToOne {

    // Stores the exposed input for this filter.
    public $validated_exposed_input = NULL;

    /**
     * NodeType storage handler.
     *
     * @var \Drupal\Core\Entity\EntityStorageInterface
     */
    protected $nodeTypeStorage;

    /**
     * The node storage.
     *
     * @var \Drupal\node\NodeStorageInterface
     */
    protected $nodeStorage;


    /**
     * Constructs a NodeIndexNid object.
     *
     * @param array $configuration
     *   A configuration array containing information about the plugin instance.
     * @param string $plugin_id
     *   The plugin_id for the plugin instance.
     * @param mixed $plugin_definition
     *   The plugin implementation definition.
     * @param \Drupal\Core\Entity\EntityStorageInterface $node_type_storage
     *   The node storage.
     * @param \Drupal\node\NodeStorageInterface $node_storage
     *   The node storage.
     */
    public function __construct(array $configuration, $plugin_id, $plugin_definition, EntityStorageInterface $node_type_storage, NodeStorageInterface $node_storage) {
        parent::__construct($configuration, $plugin_id, $plugin_definition);
        $this->nodeTypeStorage = $node_type_storage;
        $this->nodeStorage = $node_storage;
    }

    /**
     * {@inheritdoc}
     */
    public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
        return new static(
          $configuration,
          $plugin_id,
          $plugin_definition,
          $container->get('entity.manager')->getStorage('node_type'),
          $container->get('entity.manager')->getStorage('node')
        );
    }

    /**
     * {@inheritdoc}
     */
    public function init(ViewExecutable $view, DisplayPluginBase $display, array &$options = NULL) {
        parent::init($view, $display, $options);

        if (!empty($this->definition['node'])) {
            $this->options['bundle'] = $this->definition['node'];
        }
    }

    public function hasExtraOptions() {
        return TRUE;
    }

    /**
     * {@inheritdoc}
     */
    public function getValueOptions() {
        return $this->valueOptions;
    }

    protected function defineOptions() {
        $options = parent::defineOptions();

        $options['type'] = array('default' => 'textfield');
        $options['limit'] = array('default' => TRUE);
        $options['bundle'] = array('default' => '');
        $options['error_message'] = array('default' => TRUE);

        return $options;
    }

    public function buildExtraOptionsForm(&$form, FormStateInterface $form_state) {
        $bundles = $this->nodeTypeStorage->loadMultiple();
        $options = array();
        foreach ($bundles as $bundle) {
            $options[$bundle->id()] = $bundle->label();
        }

        if ($this->options['limit']) {
            // We only do this when the form is displayed.
            if (empty($this->options['bundle'])) {
                $first_bundle = reset($bundles);
                $this->options['bundle'] = $first_bundle->id();
            }

            if (empty($this->definition['bundle'])) {
                $form['bundle'] = array(
                  '#type' => 'radios',
                  '#title' => $this->t('Bundle'),
                  '#options' => $options,
                  '#description' => $this->t('Select which bundle to show nodes for in the regular options.'),
                  '#default_value' => $this->options['bundle'],
                );
            }
        }

        $form['type'] = array(
          '#type' => 'radios',
          '#title' => $this->t('Selection type'),
          '#options' => array(
            'select' => $this->t('Dropdown'),
            'textfield' => $this->t('Autocomplete')
          ),
          '#default_value' => $this->options['type'],
        );

    }

    protected function valueForm(&$form, FormStateInterface $form_state) {
        $bundle = $this->nodeTypeStorage->load($this->options['bundle']);
        if (empty($bundle) && $this->options['limit']) {
            $form['markup'] = array(
              '#markup' => '<div class="js-form-item form-item">' . $this->t('An invalid type is selected. Please change it in the options.') . '</div>',
            );
            return;
        }

        if ($this->options['type'] == 'textfield') {
            $nodes = $this->value ? Node::loadMultiple(($this->value)) : array();
            $form['value'] = array(
              '#title' => $this->options['limit'] ? $this->t('Select nodes from bundle @bundle', array('@bundle' => $bundle->label())) : $this->t('Select content'),
              '#type' => 'textfield',
              '#default_value' => EntityAutocomplete::getEntityLabels($nodes),
            );

            if ($this->options['limit']) {
                $form['value']['#type'] = 'entity_autocomplete';
                $form['value']['#target_type'] = 'node';
                $form['value']['#selection_settings']['target_bundles'] = array($bundle->id());
                $form['value']['#tags'] = TRUE;
                $form['value']['#process_default_value'] = FALSE;
            }
        }
        else {
            $options = array();
            $query = \Drupal::entityQuery('node')
              // @todo Sorting on bundle properties -
              ->sort('title')
              ->addTag('node_access');
            if ($this->options['limit']) {
                $query->condition('type', $bundle->id());
            }
            $nodes = Node::loadMultiple($query->execute());
            foreach ($nodes as $node) {
                $options[$node->id()] = \Drupal::entityManager()
                  ->getTranslationFromContext($node)
                  ->label();
            }

            $default_value = (array) $this->value;

            if ($exposed = $form_state->get('exposed')) {
                $identifier = $this->options['expose']['identifier'];

                if (!empty($this->options['expose']['reduce'])) {
                    $options = $this->reduceValueOptions($options);

                    if (!empty($this->options['expose']['multiple']) && empty($this->options['expose']['required'])) {
                        $default_value = array();
                    }
                }

                if (empty($this->options['expose']['multiple'])) {
                    if (empty($this->options['expose']['required']) && (empty($default_value) || !empty($this->options['expose']['reduce']))) {
                        $default_value = 'All';
                    }
                    elseif (empty($default_value)) {
                        $keys = array_keys($options);
                        $default_value = array_shift($keys);
                    }
                    // Due to #1464174 there is a chance that array('') was saved in the admin ui.
                    // Let's choose a safe default value.
                    elseif ($default_value == array('')) {
                        $default_value = 'All';
                    }
                    else {
                        $copy = $default_value;
                        $default_value = array_shift($copy);
                    }
                }
            }
            $form['value'] = array(
              '#type' => 'select',
              '#title' => $this->options['limit'] ? $this->t('Select nodes from bundle @bundle', array('@bundle' => $bundle->label())) : $this->t('Select content'),
              '#multiple' => TRUE,
              '#options' => $options,
              '#size' => min(9, count($options)),
              '#default_value' => $default_value,
            );

            $user_input = $form_state->getUserInput();
            if ($exposed && isset($identifier) && !isset($user_input[$identifier])) {
                $user_input[$identifier] = $default_value;
                $form_state->setUserInput($user_input);
            }
        }

        if (!$form_state->get('exposed')) {
            // Retain the helper option
            $this->helper->buildOptionsForm($form, $form_state);

            // Show help text if not exposed to end users.
            $form['value']['#description'] = t('Leave blank for all. Otherwise, the first selected term will be the default instead of "Any".');
        }
    }

    protected function valueValidate($form, FormStateInterface $form_state) {
        // We only validate if they've chosen the text field style.
        if ($this->options['type'] != 'textfield') {
            return;
        }

        $tids = array();
        if ($values = $form_state->getValue(array('options', 'value'))) {
            foreach ($values as $value) {
                $tids[] = $value['target_id'];
            }
        }
        $form_state->setValue(array('options', 'value'), $tids);
    }

    public function acceptExposedInput($input) {
        if (empty($this->options['exposed'])) {
            return TRUE;
        }
        // We need to know the operator, which is normally set in
        // \Drupal\views\Plugin\views\filter\FilterPluginBase::acceptExposedInput(),
        // before we actually call the parent version of ourselves.
        if (!empty($this->options['expose']['use_operator']) && !empty($this->options['expose']['operator_id']) && isset($input[$this->options['expose']['operator_id']])) {
            $this->operator = $input[$this->options['expose']['operator_id']];
        }

        // If view is an attachment and is inheriting exposed filters, then assume
        // exposed input has already been validated
        if (!empty($this->view->is_attachment) && $this->view->display_handler->usesExposed()) {
            $this->validated_exposed_input = (array) $this->view->exposed_raw_input[$this->options['expose']['identifier']];
        }

        // If we're checking for EMPTY or NOT, we don't need any input, and we can
        // say that our input conditions are met by just having the right operator.
        if ($this->operator == 'empty' || $this->operator == 'not empty') {
            return TRUE;
        }

        // If it's non-required and there's no value don't bother filtering.
        if (!$this->options['expose']['required'] && empty($this->validated_exposed_input)) {
            return FALSE;
        }

        $rc = parent::acceptExposedInput($input);
        if ($rc) {
            // If we have previously validated input, override.
            if (isset($this->validated_exposed_input)) {
                $this->value = $this->validated_exposed_input;
            }
        }

        return $rc;
    }

    public function validateExposed(&$form, FormStateInterface $form_state) {
        if (empty($this->options['exposed'])) {
            return;
        }

        $identifier = $this->options['expose']['identifier'];

        // We only validate if they've chosen the text field style.
        if ($this->options['type'] != 'textfield') {
            if ($form_state->getValue($identifier) != 'All') {
                $this->validated_exposed_input = (array) $form_state->getValue($identifier);
            }
            return;
        }

        if (empty($this->options['expose']['identifier'])) {
            return;
        }

        if ($values = $form_state->getValue($identifier)) {
            foreach ($values as $value) {
                $this->validated_exposed_input[] = $value['target_id'];
            }
        }
    }

    protected function valueSubmit($form, FormStateInterface $form_state) {
        // prevent array_filter from messing up our arrays in parent submit.
    }

    public function buildExposeForm(&$form, FormStateInterface $form_state) {
        parent::buildExposeForm($form, $form_state);
        if ($this->options['type'] != 'select') {
            unset($form['expose']['reduce']);
        }
        $form['error_message'] = array(
          '#type' => 'checkbox',
          '#title' => $this->t('Display error message'),
          '#default_value' => !empty($this->options['error_message']),
        );
    }

    public function adminSummary() {
        // set up $this->valueOptions for the parent summary
        $this->valueOptions = array();

        if ($this->value) {
            $this->value = array_filter($this->value);
            $nodes = Node::loadMultiple($this->value);
            foreach ($nodes as $node) {
                $this->valueOptions[$node->id()] = \Drupal::entityManager()
                  ->getTranslationFromContext($node)
                  ->label();
            }
        }
        return parent::adminSummary();
    }

    /**
     * {@inheritdoc}
     */
    public function getCacheContexts() {
        $contexts = parent::getCacheContexts();
        // The result potentially depends on term access and so is just cacheable
        // per user.
        // @todo See https://www.drupal.org/node/2352175.
        $contexts[] = 'user';

        return $contexts;
    }

    /**
     * {@inheritdoc}
     */
    public function calculateDependencies() {
        $dependencies = parent::calculateDependencies();

        $bundle = $this->nodeTypeStorage->load($this->options['bundle']);
        $dependencies[$bundle->getConfigDependencyKey()][] = $bundle->getConfigDependencyName();

        foreach ($this->nodeStorage->loadMultiple($this->options['value']) as $term) {
            $dependencies[$term->getConfigDependencyKey()][] = $term->getConfigDependencyName();
        }

        return $dependencies;
    }

}