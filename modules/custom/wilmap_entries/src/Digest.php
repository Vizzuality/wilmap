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
     * The node storage.
     *
     * @var \Drupal\Core\Entity\EntityStorageInterface
     */
    protected $nodeStorage;

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
        $this->dateFrom = $date_from;
        $this->dateTo = $date_to;
    }

    /**
     * {@inheritdoc}
     */
    public static function create(
      $date_from,
      $date_to = null
    ) {
        return new static($date_from, $date_to);
    }

    /**
     * Get entries created/updated in specified date range
     *
     * @param from unix timestamp
     * @param to unix timestamp
     *
     * @return array with entries entities
     */
    public function getEntries($from, $to = null)
    {
        if (!$to) {
            $to = time();
        }

        $this->dateFrom = $from;
        $this->dateTo = $to;

        $query = \Drupal::service('entity.query')
          ->get('node')
          ->condition('type', 'entry')
          ->condition('status', 1, '>')
          ->condition('updated', $from, '>')
          ->condition('updated', $to, '<=');
        
        $this->entries = $query->execute();

        return $this->entries;

    }

    /**
     * Create a new entry node from selected entries and publish it
     *
     * @return entry node entity
     */
    public function publish()
    {
        $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
        $node = \Drupal\node\Entity\Node::create(array(
          'type'     => 'entry',
          'title'    => 'Digest + [Fecha]',
            // TODO: set date in title from $this->dateTo
          'langcode' => $language,
          'uid'      => 1,
          'status'   => 1,
          'body'     => [ // TODO: Render Entries as an HTML list from $this->entries
            'summary' => '',
            'value'   => "<p>The body of my node.</p>",
            'format'  => 'full_html',
          ],
            // TODO: set taxonomy fields ¿?
            // 'field_date' => array("2000-01-30"),
            //'field_fields' => array('Custom values'), // Add your custon field values like this
        ));
        $node->save();
    }


}
