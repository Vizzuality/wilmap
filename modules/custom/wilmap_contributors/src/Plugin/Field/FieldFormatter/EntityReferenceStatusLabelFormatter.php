<?php

namespace Drupal\wilmap_contributors\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\Plugin\Field\FieldFormatter\EntityReferenceLabelFormatter;

/**
 * Plugin implementation of the 'entity_reference_status_label_formatter' formatter.
 *
 * @FieldFormatter(
 *   id = "entity_reference_status_label_formatter",
 *   label = @Translation("Label + visibility"),
 *   field_types = {
 *     "entity_reference_status"
 *   }
 * )
 */
class EntityReferenceStatusLabelFormatter extends EntityReferenceLabelFormatter
{

    /**
     * {@inheritdoc}
     */
    public function viewElements(FieldItemListInterface $items, $langcode)
    {
        $elements = parent::viewElements($items, $langcode);
        $values = $items->getValue();

        // Return only elements with enabled
        $elements_enabled = array();
        foreach ($elements as $delta => $entity) {
            //$values[$delta]['#attributes']['class'][] = ($values[$delta]['status']) ? 'enabled' : 'disabled';
            if ($values[$delta]['status']) {
                $elements_enabled[] = $entity;
            }
        }

        return $elements_enabled;
    }

}
