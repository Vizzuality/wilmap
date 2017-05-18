<?php

/**
 * @file
 * Contains \Drupal\acl\Tests\Migrate\d6\MigrateAclListTest.
 */

namespace Drupal\acl\Tests\Migrate\d6;

use Drupal\acl\Tests\AclMigrationTestTrait;
use Drupal\node\Entity\Node;
use Drupal\Core\Cache\Cache;
use Drupal\migrate_drupal\Tests\d6\MigrateDrupal6TestBase;

/**
 * Tests migration of ACL columns from Drupal 6 to Drupal 8.
 *
 * @group acl
 */
class MigrateAclListTest extends MigrateDrupal6TestBase {

  use AclMigrationTestTrait;

  /**
   * Modules to load.
   */
  public static $modules = ['migrate_drupal', 'node', 'acl', 'acl_node_test'];

  /**
   * {@inheritdoc}
   */
  protected function setUp() {
    parent::setUp();

    $this->loadFixture(__DIR__ . '/../../../../tests/fixtures/d6_d7_table.php');
    $this->installSchema('acl', ['acl', 'acl_user', 'acl_node']);
    $this->installSchema('node', ['node_access']);

    $this->executeMigration('d6_d7_acl');
    $this->executeMigration('d6_d7_acl_user');
    $this->executeMigration('d6_d7_acl_node');

    $this->migrateContent(TRUE);
  }

}
