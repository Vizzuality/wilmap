<?php

namespace Drupal\Tests\migrate_spreadsheet\Unit;

use Drupal\migrate_spreadsheet\SpreadsheetIterator;
use Drupal\Tests\UnitTestCase;
use PhpOffice\PhpSpreadsheet\Worksheet;

/**
 * Tests the spreadsheet iterator.
 *
 * @coversDefaultClass \Drupal\migrate_spreadsheet\SpreadsheetIterator
 */
class SpreadsheetIteratorTest extends UnitTestCase  {

  /**
   * A worksheet.
   *
   * @var \PhpOffice\PhpSpreadsheet\Worksheet
   */
  protected $worksheet;

  /**
   * The spreadsheet iterator.
   *
   * @var \Drupal\migrate_spreadsheet\SpreadsheetIteratorInterface
   */
  protected $iterator;

  /**
   * {@inheritdoc}
   */
  protected function setUp() {
    parent::setUp();

    $this->iterator = (new SpreadsheetIterator())
      ->setConfiguration([
        'worksheet' => $this->getWorksheet(),
        'origin' => 'B3',
        'header_row' => 2,
        'columns' => ['column b', 'column d', 'column e'],
      ]);
  }

  /**
   * @covers ::getRowsCount
   * @covers ::getColumnsCount
   */
  public function testRowsAndColumnsCount() {
    $this->assertEquals(5, $this->iterator->getRowsCount());
    $this->assertEquals(5, $this->iterator->getColumnsCount());
  }

  /**
   * @covers ::getOrigin
   * @dataProvider providerTestGetException
   *
   * @param string $origin
   *   The origin cell reference to be tested.
   * @param bool $expect_exception
   *   If a exception is expected.
   */
  public function testGetOrigin($origin, $expect_exception) {
    $config = ['origin' => $origin] + $this->iterator->getConfiguration();
    $this->iterator->setConfiguration($config);
    if ($expect_exception) {
      $this->setExpectedException('InvalidArgumentException');
    }
    $this->assertEquals($origin, $this->iterator->getOrigin());
  }

  /**
   * Provides test cases for ::testGetOrigin()
   *
   * @return array[]
   */
  public function providerTestGetException() {
    return [
      // The minimum valid origin.
      ['A1', FALSE],
      // A valid origin.
      ['B3', FALSE],
      // Column out of bounds.
      ['F3', TRUE],
      // Row out of bounds.
      ['E6', TRUE],
      // Both, row and column, out of bounds.
      ['F6', TRUE],
      // The maximum valid value.
      ['E5', FALSE],
    ];
  }

  /**
   * @covers ::getHeaders
   */
  public function testGetHeaders() {
    $cols = ['column b' => 'B', 'column c' => 'C', 'column d' => 'D', 'column e' => 'E'];
    $this->assertSame($cols, $this->iterator->getHeaders());

    // Check headers when there's no header row.
    $config = $this->iterator->getConfiguration();
    unset($config['header_row']);
    $this->iterator->setConfiguration($config);
    $this->assertSame(['B' => 'B', 'C' => 'C', 'D' => 'D', 'E' => 'E'], $this->iterator->getHeaders());

    // Check duplicate headers.
    $this->getWorksheet()->setCellValue('C2', 'column b');
    $config['header_row'] = 2;
    $this->iterator->setConfiguration($config);
    $this->setExpectedException('RuntimeException');
    $this->iterator->getHeaders();
  }

  /**
   * @covers ::current
   */
  public function testIteration() {
    $config = $this->iterator->getConfiguration();
    $config['row_index_column'] = 'row';
    $this->iterator->setConfiguration($config);

    $this->assertTrue($this->iterator->valid());
    $this->assertSame([3], $this->iterator->key());
    $this->assertSame(['row' => 3, 'column b' => 'cell b0', 'column d' => 'cell d0', 'column e' => 'cell e0'], $this->iterator->current());

    // Move the cursor.
    $this->iterator->next();
    $this->assertTrue($this->iterator->valid());
    $this->assertSame([4], $this->iterator->key());
    $this->assertSame(['row' => 4, 'column b' => 'cell b1', 'column d' => 'cell d1', 'column e' => 'cell e1'], $this->iterator->current());

    // Move the cursor.
    $this->iterator->next();
    $this->assertTrue($this->iterator->valid());
    $this->assertSame([5], $this->iterator->key());
    $this->assertSame(['row' => 5, 'column b' => 'cell b2', 'column d' => 'cell d2', 'column e' => 'cell e2'], $this->iterator->current());

    // Move the cursor. Should run out of set.
    $this->iterator->next();
    $this->assertFalse($this->iterator->valid());

    // Rewind.
    $this->iterator->rewind();
    $this->assertTrue($this->iterator->valid());
    $this->assertSame([3], $this->iterator->key());
    $this->assertSame(['row' => 3, 'column b' => 'cell b0', 'column d' => 'cell d0', 'column e' => 'cell e0'], $this->iterator->current());

    // Try to return all columns.
    $config['columns'] = [];
    $this->iterator->setConfiguration($config);
    $this->assertTrue($this->iterator->valid());
    $this->assertSame([3], $this->iterator->key());
    $this->assertSame(['row' => 3, 'column b' => 'cell b0', 'column c' => 'cell c0', 'column d' => 'cell d0', 'column e' => 'cell e0'], $this->iterator->current());

    // Use different primary keys.
    $config['columns'] = ['column b', 'column e'];
    $config['keys'] = ['column c', 'column d'];
    unset($config['row_index_column']);
    $this->iterator->setConfiguration($config);
    $this->assertTrue($this->iterator->valid());
    $this->assertSame(['cell c0', 'cell d0'], $this->iterator->key());
    $this->assertSame(['column b' => 'cell b0', 'column c' => 'cell c0', 'column d' => 'cell d0', 'column e' => 'cell e0'], $this->iterator->current());

    // Test with no header_row.
    unset($config['header_row']);
    $config['columns'] = ['B', 'E'];
    $config['keys'] = ['C', 'D'];
    $this->iterator->setConfiguration($config);
    $this->assertTrue($this->iterator->valid());
    $this->assertSame(['cell c0', 'cell d0'], $this->iterator->key());
    $this->assertSame(['B' => 'cell b0', 'C' => 'cell c0', 'D' => 'cell d0', 'E' => 'cell e0'], $this->iterator->current());
  }

  /**
   * Populates a testing worksheet.
   *
   * @return \PhpOffice\PhpSpreadsheet\Worksheet
   */
  protected function getWorksheet() {
    if (!isset($this->worksheet)) {
      // Test case:
      // - origin: B3
      // - header_row: 2
      $this->worksheet = (new Worksheet())
        // The header row starts on the 2nd line.
        ->setCellValue('B2', 'column b')
        ->setCellValue('C2', 'column c')
        ->setCellValue('D2', 'column d')
        ->setCellValue('E2', 'column e')
        // Data row with index 0 starts on row 3.
        ->setCellValue('B3', 'cell b0')
        ->setCellValue('C3', 'cell c0')
        ->setCellValue('D3', 'cell d0')
        ->setCellValue('E3', 'cell e0')
        // Data row with index 1.
        ->setCellValue('B4', 'cell b1')
        ->setCellValue('C4', 'cell c1')
        ->setCellValue('D4', 'cell d1')
        ->setCellValue('E4', 'cell e1')
        // Data row with index 2.
        ->setCellValue('B5', 'cell b2')
        ->setCellValue('C5', 'cell c2')
        ->setCellValue('D5', 'cell d2')
        ->setCellValue('E5', 'cell e2');
    }
    return $this->worksheet;
  }

}
