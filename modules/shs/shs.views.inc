<?php

/**
 * @file
 * Provides views data for shs.module.
 */

use Drupal\field\FieldStorageConfigInterface;

/**
 * Implements hook_views_data_alter().
 */
function shs_views_data_alter(array &$data) {
  // If (for whatever reasons) the filter is not set or someone changed it to
  // a custom implementation, skip this.
  if (!empty($data['taxonomy_term_field_data']['tid']['filter']['id']) && ('taxonomy_index_tid' === $data['taxonomy_term_field_data']['tid']['filter']['id'])) {
    $data['taxonomy_term_field_data']['tid']['filter']['id'] = 'shs_taxonomy_index_tid';
  }
  if (!empty($data['taxonomy_index']['tid']['filter']['id']) && ('taxonomy_index_tid' === $data['taxonomy_index']['tid']['filter']['id'])) {
    $data['taxonomy_index']['tid']['filter']['id'] = 'shs_taxonomy_index_tid';
  }
  if (!empty($data['node_field_data']['term_node_tid_depth']['filter']['id']) && ('taxonomy_index_tid_depth' === $data['node_field_data']['term_node_tid_depth']['filter']['id'])) {
    $data['node_field_data']['term_node_tid_depth']['filter']['id'] = 'shs_taxonomy_index_tid_depth';
  }
}

/**
 * Implements hook_field_views_data_alter().
 *
 * @see taxonomy_field_views_data_alter()
 */
function shs_field_views_data_alter(array &$data, FieldStorageConfigInterface $field_storage) {
  if (('entity_reference' !== $field_storage->getType()) || ('taxonomy_term' !== $field_storage->getSetting('target_type'))) {
    return;
  }
  foreach ($data as $table_name => $table_data) {
    foreach ($table_data as $field_name => $field_data) {
      if (isset($field_data['filter']) && ('delta' !== $field_name) && ('taxonomy_index_tid' === $field_data['filter']['id'])) {
        $data[$table_name][$field_name]['filter']['id'] = 'shs_taxonomy_index_tid';
      }
    }
  }
}
