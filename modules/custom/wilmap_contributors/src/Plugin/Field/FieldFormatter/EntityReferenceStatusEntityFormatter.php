<?php

namespace Drupal\wilmap_contributors\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\Plugin\Field\FieldFormatter\EntityReferenceEntityFormatter;

/**
 * Plugin implementation of the 'entity_reference_status_entity_formatter' formatter.
 *
 * @FieldFormatter(
 *   id = "entity_reference_status_entity_formatter",
 *   label = @Translation("Rendered entity + visibility"),
 *   field_types = {
 *     "entity_reference_status"
 *   }
 * )
 */
class EntityReferenceStatusEntityFormatter extends EntityReferenceEntityFormatter
{

    /**
     * {@inheritdoc}
     */
    /**
     * {@inheritdoc}
     */
    public function viewElements(FieldItemListInterface $items, $langcode) {
        $elements = parent::viewElements($items, $langcode);
        $values = $items->getValue();

        // Return only elements with status enabled
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
