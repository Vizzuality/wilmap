<?php

namespace Drupal\Tests\migrate_plus\Kernel\Plugin\migrate_plus\data_fetcher;

use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\KernelTests\KernelTestBase;
use Drupal\migrate_plus\Plugin\migrate_plus\data_fetcher\Http;
use Drupal\Tests\Core\Test\KernelTestBaseTest;
use Drupal\Tests\UnitTestCase;

/**
 * Class HttpTest
 *
 * @group migrate_plus
 * @package Drupal\Tests\migrate_plus\Unit\migrate_plus\data_fetcher
 */
class HttpTest extends KernelTestBase {

  /**
   * Test http headers option.
   */
  function testHttpHeaders() {
    $expected = [
      'Accept' => 'application/json',
      'User-Agent' => 'Internet Explorer 6',
      'Authorization-Key' => 'secret',
      'Arbitrary-Header' => 'foobarbaz'
    ];

    $configuration = [
      'headers' => [
        'Accept' => 'application/json',
        'User-Agent' => 'Internet Explorer 6',
        'Authorization-Key' => 'secret',
        'Arbitrary-Header' => 'foobarbaz'
      ]
    ];

    $http = new Http($configuration, 'http', []);

    $this->assertEquals($expected, $http->getRequestHeaders());
  }
}
