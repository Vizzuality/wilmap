<?php
/**
 * @file
 * Contains wilmap_migration.drush.inc
 */

use Drupal\node\Entity\Node;
use Drupal\Core\Entity\EntityFieldManager;
use Drupal\redirect\Entity\Redirect;

/**
 * Implements hook_drush_command().
 *
 * Defines drush commands.
 */
function wilmap_migration_drush_command()
{
    // Index taxonomy entity bundle
    $items['taxonomy-index-entity-bundle'] = array(
      'description' => dt('Index taxonomy entity bundle.'),
      'aliases'     => array('tieb'),
      'options'            => [
        'simulate' => 'Does not apply changes',
        'idlist'   => 'Only apply to nodes in this list',
      ],
      'arguments'          => [
        'bundle'     => 'Entity bundle. Ej: entry'
      ],

      'examples'    => array(
        'drush taxonomy-index-entity-bundle entry' => 'Index taxonomy entities from "entry" bundle.',
        'drush taxonomy-index-entity-bundle entry --simulate' => 'Simulate index taxonomy entities from "entry" bundle.',
        'drush taxonomy-index-entity-bundle entry --idlist=123,124' => 'Index taxonomy entities from "entry" bundle with ids 123, 124.',
      ),
      'callback'    => 'wilmap_migration_taxonomy_index_entity_bundle',
    );

    return $items;
}


/********************************************************************/
/* Callbacks                                                        */
/********************************************************************/

/*
 *  Index taxonomy entity bundle
 */
function wilmap_migration_taxonomy_index_entity_bundle($bundle)
{

    // Parameter needed
    if (is_null($bundle)) {
        return drush_set_error('DRUSH_FRAMEWORK_ERROR',
          dt('Entity bundle is not defined'));
    }

    // Options
    $idlist = drush_get_option('idlist');
    $idlist = $idlist ? explode(',', $idlist) : null;
    $simulate = drush_get_option('simulate');

    if ($simulate) {
        drush_print('Simulation mode: ON');
    }

    // Get entities
    $query = \Drupal::entityQuery('node')
      ->condition('type', $bundle);

    // Select only nids set in 'idlist' condition
    if (is_array($idlist)) {
        $query->condition('nid', $idlist, 'IN');
    }

    $nids = $query->execute();

    drush_print(count($nids) . ' entities found.');

    foreach ($nids as $nid) {

        $node = Node::load($nid);
        if (!$simulate) {
          taxonomy_build_node_index($node);
        }

        drush_print('Taxonomy index updated [' . $nid . ']: ' . $node->label());
    }
}
