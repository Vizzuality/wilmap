<?php

/**
 * @file
 * Contains \Drupal\acl\Tests\Migrate\d7\MigrateAclListTest.
 */

namespace Drupal\acl\Tests\Migrate\d7;

use Drupal\acl\Tests\AclMigrationTestTrait;
use Drupal\migrate_drupal\Tests\MigrateDrupalTestBase;
use Drupal\migrate_drupal\Tests\d7\MigrateDrupal7TestBase;

/**
 * Tests migration of ACL columns from Drupal 7 to Drupal 8.
 *
 * @group acl
 */
class MigrateAclListTest extends MigrateDrupal7TestBase {

  use AclMigrationTestTrait;

  /**
   * Modules to load.
   */
  public static $modules = [
    'migrate_drupal',
    'acl',
    'acl_node_test',
    'comment',
    'datetime',
    'filter',
    'image',
    'link',
    'node',
    'taxonomy',
    'telephone',
    'text',
  ];

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

    $this->installEntitySchema('node');
    $this->installEntitySchema('comment');
    $this->installEntitySchema('taxonomy_term');
    $this->installConfig(static::$modules);
    $this->installSchema('system', ['sequences']);

    $this->executeMigrations([
      'd7_user_role',
      'd7_user',
      'd7_node_type',
      'd7_comment_type',
      'd7_field',
      'd7_field_instance',
      'd7_node__test_content_type',
      'd7_node_settings',
      'd7_node:*',
      'd7_node_revision:*',
    ]);
  }

}
