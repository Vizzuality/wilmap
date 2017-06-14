<?php

namespace Drupal\wilmap_contributors\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\Plugin\Field\FieldWidget\EntityReferenceAutocompleteWidget;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'entity_reference_autocomplete_status' widget.
 *
 * @FieldWidget(
 *   id = "entity_reference_autocomplete_status",
 *   label = @Translation("Entity reference autocomplete status"),
 *   field_types = {
 *     "entity_reference_status"
 *   }
 * )
 */
class EntityReferenceAutocompleteStatus extends EntityReferenceAutocompleteWidget
{

    /**
     * {@inheritdoc}
     */
    public function formElement(
      FieldItemListInterface $items,
      $delta,
      array $element,
      array &$form,
      FormStateInterface $form_state
    ) {
        $widget = parent::formElement($items, $delta, $element, $form,
          $form_state);

        $widget['status'] = array(
          '#title'         => $this->t('Visible'),
          '#type'          => 'checkbox',
          '#default_value' => isset($items[$delta]) ? $items[$delta]->status : 0,
          '#weight'        => 10
        );

        return $widget;
    }

}
