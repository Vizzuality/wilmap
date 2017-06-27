<?php

namespace Drupal\wilmap_entries;

/**
 * Class Ranking.
 *
 * @package Drupal\wilmap_contributors
 */
class Digest
{

    /**
     * @var From date
     *   Digest from date
     */
    public $dateFrom;

    /**
     * @var to date
     *   Digest from date
     */
    public $dateTo;

    /**
     * @var digest entries
     *   Entries in digest
     */
    public $entries;

    /**
     * Constructs new NodeBlock.
     *
     * @param \Drupal\Core\Entity\EntityStorageInterface $node_storage
     *   The node storage.
     */
    public function __construct(
      $date_from,
      $date_to = null
    ) {

        if (!$date_to) {
            $date_to = time();
        }
        $this->dateFrom = $date_from;
        $this->dateTo = $date_to;
        $this->entries = [];
    }

    /**
     * Get entries created/updated in specified date range
     *
     * @param from unix timestamp
     * @param to unix timestamp
     *
     * @return array with entries entities
     */
    public function getEntries($from = null, $to = null)
    {
        if ($from) {
            $this->dateFrom = $from;
        }

        if ($to) {
            $this->dateTo = $to;
        }

        // TODO: group by type?
        $query = \Drupal::service('entity.query')
          ->get('node')
          ->condition('type', 'entry')
          ->condition('status', 1)
          ->condition('created', $this->dateFrom, '>')
          ->condition('created', $this->dateTo, '<=')
        ;

        $nids = $query->execute();


        $this->entries = \Drupal\node\Entity\Node::loadMultiple($nids);
        //$this->entries = $nids;
        return $this->entries;

    }

    /**
     * Create a new entry node from selected entries and publish it
     *
     * @return entry node entity
     */
    public function publish()
    {
        $config = \Drupal::config('wilmap_entries.digest');
        $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
        $renderer = \Drupal::service('renderer');

        $node = \Drupal\node\Entity\Node::create(array(
          'type'             => 'entry',
          'title'            => $config->get('title') . ' - ' . date('F j, Y',
              $this->dateTo),
          'langcode'         => $language,
          'uid'              => 1,
          'status'           => 1,
          'field_body_entry' => [
            'value'  => $renderer->renderPlain(node_view_multiple($this->entries, 'digest')),
            'format' => 'full_html',
          ],
        // TODO: set taxonomy fields ¿?
        // Add your custom field values like this
        // 'field_date' => array("2000-01-30"),
        //'field_fields' => array('Custom values'),
        ));

        $node->save();

//        $content = [
//          '#theme' => 'item_list',
//          '#list_type' => 'ul',
//          '#title' => 'My List',
//          '#items' => ['item 1', 'item 2'],
//          '#attributes' => ['class' => 'mylist'],
//          '#wrapper_attributes' => ['class' => 'container'],
//        ];
    }


}
