<?php

namespace Drupal\migrate_spreadsheet;

/**
 * Provides an interface for spreadsheet iterators.
 */
interface SpreadsheetIteratorInterface extends \Iterator{

  /**
   * Sets the iterator configuration.
   *
   * The caller should assure sane values.
   *
   * @param array $configuration
   *   An associative array with the next keys:
   *   - worksheet (\PhpOffice\PhpSpreadsheet\Worksheet): The worksheet object.
   *   - columns (string[]): An indexed array of columns.
   *   - keys (string[]): A list of columns that are giving the primary key.
   *   - header_row (int): The index of the first row from where the table
   *     starts. It's the value of the spreadsheet row that contains the table
   *     header. If the table row is the first this should be 1. A value of 3
   *     would mean that the table header is on the third row.
   *   - row_index_column (string): The row index column name. The 'row index
   *     column' is a pseudo-column, that not exist on the worksheet, containing
   *     the current index/position/delta of each row. The caller can pass a
   *     name to be used for that column. If a name was passed, that column will
   *     be also outputted along with the row, in ::current(). The same name can
   *     be passed also in 'keys' list. In that case the row index will be or
   *     will be part of the primary key.
   *
   * @return $this
   */
  public function setConfiguration(array $configuration);

  /**
   * Gets the iterator configuration.
   *
   * @return array
   */
  public function getConfiguration();

  /**
   * Gets the worksheet.
   *
   * @return \PhpOffice\PhpSpreadsheet\Worksheet
   *
   * @throws \InvalidArgumentException
   *   If an empty or invalid 'worksheet' has been passed.
   */
  public function getWorksheet();

  /**
   * Retrieves the top-left origin of data area.
   *
   * @return string
   */
  public function getOrigin();

  /**
   * Gets the list of columns.
   *
   * @return string[]
   *   The list of columns.
   *
   * @throws \InvalidArgumentException
   *   If a column passed in 'columns' does not exist in the header.
   *
   * @see \Drupal\migrate_spreadsheet\SpreadsheetIteratorInterface::setColumns()
   */
  public function getColumns();

  /**
   * Gets the list of columns that are composing the primary key.
   *
   * @return string[]
   *   A list of column names.
   *
   * @throws \InvalidArgumentException
   *   If a key passed in 'keys' does not exist in the header.
   */
  public function getKeys();

  /**
   * Gets the header row index.
   *
   * @return int
   */
  public function getHeaderRow();

  /**
   * Gets the name of the row index column.
   *
   * @return string
   */
  public function getRowIndexColumn();

  /**
   * Retrieves a full list of headers.
   *
   * @return string[]
   *   An associative array having the header name as key and header column
   *   index as value. If there is no header row defined, the key is the same as
   *   the value. The column index has a letter representation (A, B, C, ...).
   *
   * @throws \RuntimeException
   *   If a header cell is duplicated.
   */
  public function getHeaders();

  /**
   * Gets the total number of rows in the worksheet.
   *
   * @return int
   */
  public function getRowsCount();

  /**
   * Gets the total number of columns in the worksheet.
   *
   * @return int
   */
  public function getColumnsCount();

  /**
   * Clears the internal cache.
   */
  public function clearCache();

}
