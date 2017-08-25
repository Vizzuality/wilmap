<?php

namespace Drupal\wilmap_news;

use \Drupal\node\Entity\Node;

/**
 * Creates a Digest as a News node from content of type entries, news and topics.
 * Each content type should have a 'digest' display.
 *
 * @package Drupal\wilmap_contributors
 */
class Digest
{

    /**
     * @var int unix date
     *   Digest from date
     */
    public $dateFrom;

    /**
     * @var int unix date
     *   Digest from date
     */
    public $dateTo;

    /**
     * @var digest entries
     *   Entries in digest
     */
    public $entries;

    /**
     * @var digest news
     *   Entries in digest
     */
    public $news;

    /**
     * @var digest topics
     *   Entries in digest
     */
    public $topics;

    /**
     * Constructs new NodeBlock.
     *
     * @param $date_from int unix timestamp
     * @param $date_to int unix timestamp
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
        $this->topics = [];
        $this->news = [];
    }

    /**
     * Get content count from current digest
     *
     * @return int number of items in current digest
     */
    public function count()
    {
        return count($this->entries) + count($this->topics) + count($this->news);
    }

    /**
     * Get content created/updated in specified date range
     *
     * @param from int unix timestamp
     * @param to int unix timestamp
     *
     * @return Digest object
     */
    public function get($from = null, $to = null)
    {
        $this->entries = $this->getNodes($from, $to, "entry");
        $this->topics = $this->getNodes($from, $to, "topics");
        $this->news = $this->getNodes($from, $to, "news");

        return $this;
    }

    /**
     * Get entries created/updated in specified date range
     *
     * @param from int unix timestamp
     * @param to int unix timestamp
     *
     * @return array with entries entities
     */
    public function getEntries($from = null, $to = null)
    {
        $this->entries = $this->getNodes($from, $to, "entry");
        return $this->entries;
    }

    /**
     * Get topics created/updated in specified date range
     *
     * @param from \Drupal\Core\Datetime\Element\Datetime unix timestamp
     * @param to \Drupal\Core\Datetime\Element\Datetime unix timestamp
     *
     * @return array with topics entities
     */
    public function getTopics($from = null, $to = null)
    {
        $this->topics = $this->getNodes($from, $to, "topics");
        return $this->topics;
    }

    /**
     * Get news created/updated in specified date range
     *
     * @param from int unix timestamp
     * @param to int unix timestamp
     *
     * @return array with news entities
     */
    public function getNews($from = null, $to = null)
    {
        $this->news = $this->getNodes($from, $to, "news");
        return $this->news;
    }

    /**
     * Get entries created/updated in specified date range
     *
     * @param from int timestamp
     * @param to int timestamp
     * @param node string type
     *
     * @return array with entries entities
     */
    public function getNodes($from = null, $to = null, $type = null)
    {
        if ($from) {
            $this->dateFrom = $from;
        }

        if ($to) {
            $this->dateTo = $to;
        }

        $query = \Drupal::service('entity.query');


        if ($type) {
            $nids = $query->get('node')
              ->condition('status', 1)
              ->condition('type', $type)
              ->condition('changed', $this->dateFrom, '>')
              ->condition('changed', $this->dateTo, '<=')
              ->execute();
        } else {
            $nids = $query->get('node')
              ->condition('status', 1)
              ->condition('changed', $this->dateFrom, '>')
              ->condition('changed', $this->dateTo, '<=')
              ->execute();
        }

        return Node::loadMultiple($nids);

    }

    /**
     * Create a News node from selected content and publish it
     *
     * @return \Drupal\Core\Entity\Entity node entity
     */
    public function publish()
    {
        $config = \Drupal::config('wilmap_news.digest');
        $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
        $renderer = \Drupal::service('renderer');

        // Renderable array for body
        $body = [
          '#theme'   => 'wilmap_digest',
          '#entries' => ($this->entries) ? node_view_multiple($this->entries,
            'digest') : null,
          '#news'    => ($this->news) ? node_view_multiple($this->news,
            'digest') : null,
          '#topics'  => ($this->topics) ? node_view_multiple($this->topics,
            'digest') : null,
        ];

        // Get title and replace date pattern with formatted date
        $matches = [];
        preg_match('/[\[].*[\]]/U', $config->get('title'), $matches);
        if (isset($matches[0])) {
            $title = preg_replace('/[\[].*[\]]/U', date(substr($matches[0],1,-1)),
              $config->get('title'));
        } else {
            $title = $config->get('title');
        }

        // Create News node with digest entries, using 'digest' display for each one
        $node = Node::create(array(
          'type'          => 'news',
          'title'         => $title,
          'langcode'      => $language,
          'uid'           => ($config->get('author')) ? $config->get('author') : 1,
          'status'        => 1,
          'field_summary' => [
            'value'  => $renderer->renderPlain($body),
            'format' => 'full_html',
          ],
//          'field_summary' => [
//            'value'  => $renderer->renderPlain(node_view_multiple($this->entries,
//              'digest')),
//            'format' => 'full_html',
//          ],

            // Add your custom field values like this
            // 'field_date' => array("2000-01-30"),
            //'field_fields' => array('Custom values'),
        ));

        return $node->save();

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
