<?php

namespace Drupal\wilmap_contributors\Plugin\Field\FieldType;

use Drupal\Core\Field\Plugin\Field\FieldType\EntityReferenceItem;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\StringTranslation\TranslatableMarkup;
use Drupal\Core\TypedData\DataDefinition;

/**
 * Plugin implementation of the 'entity_reference_status' field type.
 *
 * @FieldType(
 *   id = "entity_reference_status",
 *   label = @Translation("Entity Reference with Status"),
 *   description = @Translation("An entity field containing an entity reference with an enable/disable status."),
 *   category = @Translation("Reference with status"),
 *   default_widget = "entity_reference_autocomplete_status",
 *   default_formatter = "entity_reference_status_label_formatter",
 *   list_class = "\Drupal\Core\Field\EntityReferenceFieldItemList",
 * )
 */
class EntityReferenceStatus extends EntityReferenceItem
{


    /**
     * {@inheritdoc}
     */
    public static function propertyDefinitions(
      FieldStorageDefinitionInterface $field_definition
    ) {
        $properties = parent::propertyDefinitions($field_definition);
        $status_definition = DataDefinition::create('integer')
          ->setLabel(new TranslatableMarkup('Status'));
        $properties['status'] = $status_definition;
        return $properties;
    }

    /**
     * {@inheritdoc}
     */
    public static function schema(
      FieldStorageDefinitionInterface $field_definition
    ) {
        $schema = parent::schema($field_definition);
        $schema['columns']['status'] = array(
          'type'     => 'int',
          'size'     => 'tiny',
          'unsigned' => true,
        );

        return $schema;
    }

    /**
     * {@inheritdoc}
     */
    public function getConstraints()
    {
        $constraints = parent::getConstraints();

        if ($max_length = $this->getSetting('max_length')) {
            $constraint_manager = \Drupal::typedDataManager()
              ->getValidationConstraintManager();
            $constraints[] = $constraint_manager->create('ComplexData', [
              'value' => [
                'Length' => [
                  'max'        => $max_length,
                  'maxMessage' => t('%name: may not be longer than @max characters.',
                    [
                      '%name' => $this->getFieldDefinition()->getLabel(),
                      '@max'  => $max_length
                    ]),
                ],
              ],
            ]);
        }

        return $constraints;
    }

}
