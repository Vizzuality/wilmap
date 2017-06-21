<?php

namespace Drupal\wilmap_contributors;

use Drupal\Core\Database\Connection;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class Ranking.
 *
 * @package Drupal\wilmap_contributors
 */
class Ranking
{

    /**
     * Database Service Object.
     *
     * @var \Drupal\Core\Database\Connection
     */
    protected $database;

    /**
     * @var Top Ranking
     *   Top current Ranking.
     */
    private $top_ranking;

    /**
     * Implements __construct().
     *
     * @param \Drupal\Core\Database\Connection $database
     *   Database Service Object.
     */
    public function __construct(Connection $database)
    {
        $this->database = $database;
    }

    /**
     * {@inheritdoc}
     */
    public static function create(ContainerInterface $container)
    {
        return new static($container->get('database'));
    }


    /**
     * Get user rank
     *
     * @param uid user uid
     *
     * @return int user rank between 0..99
     */
    public function getUserRanking($uid)
    {

        // Get node revisions done by user
        $result = $this->database->query(
          'SELECT count(*) as total FROM {node_revision} WHERE revision_uid = :uid',
          [':uid' => $uid]
        )->fetchField()[0];

        return (int) floor(100 * $result / $this->getTopRanking());

    }

    /**
     * Get top ranking
     *
     * @param $reset boolean, set to true to recalculate
     *
     * @return int top rank value between 0..99
     */
    public function getTopRanking($reset = false)
    {

        // If calculated, returns it
        if ($this->top_ranking && !$reset) {
            return $this->top_ranking;
        }

        // Get revisions done by user with most revisions
        $top_ranking = $this->database->query(
          'SELECT count(*) as total FROM {node_revision}
                WHERE revision_uid != 0
                GROUP BY revision_uid
                ORDER BY total DESC
                LIMIT 1'
        )->fetchField();

        // Prevents DIV BY ZERO
        $this->top_ranking = ($top_ranking) ? $top_ranking : 1;

        return $this->top_ranking;
    }

}
