# Migrate Spreadsheet

## Overview

The module provides a migrate source plugin for importing data from spreadsheet files. This source plugin uses the [PhpOffice/PhpSpreadsheet](https://github.com/PHPOffice/PhpSpreadsheet) library to read from the spreadsheet files.

[The supported source files](https://github.com/PHPOffice/PhpSpreadsheet#file-formats-supported) includes .ods, .xls, .xlsx, .csv.

## Installing PHPSpreadsheet

Usually we use [Composer](https://getcomposer.org/) to install dependencies in Drupal 8. All you need to do is to add this module as dependency in your project top `composer.json` file:

```json
{
    ...
    "require": {
        ...
        "drupal/migrate_spreadsheet": "~1.0-beta2",
        ...
    },
    "repositories": [
        {
            "type": "composer",
            "url": "https://packages.drupal.org/8"
        },
        ...
    ],
    ...
}
```

Then a `$ composer update` should be issued and Composer will install the [PhpOffice/PhpSpreadsheet](https://github.com/PHPOffice/PhpSpreadsheet) dependency.

## Usage

In the migration file add the plugin provided by this module as source plugin:

```yaml
source:
  plugin: spreadsheet

  # The source file. The path can be either relative to Drupal root but it can
  # be a also an absolute reference such as a stream wrapper.
  file: ../resources/source_file.xlsx

  # The name of the worksheet to read from.
  worksheet: 'Personnel list'

  # The top-left cell where data area starts (excluding the header, if exists).
  # It should use a spreadsheet representation such as B4, A3, etc. The data
  # area does NOT include the header. If this configuration is missed, the
  # assumption is that the first row contains the table header and the data
  # origin is the first cell of the second row. And that is A2. In this example
  # the data area starts from the second column of the third row.
  origin: B3

  # The row where the header is placed, if any. If this configuration is missed,
  # there's no table header and the spreadsheet columns (A, B, C, ...) will be
  # automatically used as table header. If the table header is on the first row,
  # this configuration should be 1. The header cell values will act as column
  # names. The value of 2 means that the table header is on the second row.
  header_row: 2

  # The list of columns to be returned. Is basically a list of table header cell
  # values, if a header has been defined with `header_row`. If there's no table
  # header (i.e. `header_row` is missing), it should contain a list/sequence of
  # column letters (A, B, C, ...). If this configuration is missed, all columns
  # that contain data will be be returned (not recommended).
  columns:
    - ID
    - Revision
    - 'First name'
    - 'Sure name'
    - Gender

  # The name to be given to the column containing the row index. If this setting
  # is specified, the source will return also a pseudo-column, with this name,
  # containing the row index. In this example 'Row no.' can be used later in
  # `keys` list to make this column a primary key column. This name doesn't
  # need to be appended to the `columns` list, it will be added automatically.
  row_index_column: 'Row no.'

  # The primary key as a list of keys. It's a list of source columns that are
  # composing the primary key. The list is keyed by column name and has the
  # field storage definition as value. If the table have a header (i.e.
  # `header_row` is set) the keys will be set as the name of header cells acting
  # as primary index. Otherwise the column letters (A, B, C, ...) can be used.
  # If no keys are defined here, the current row position will be returned as
  # primary key, but in this case, `row_index_column` must have a value.
  keys:
    ID:
      type: integer
      size: big
    Revision:
      type: string
      max_length: 32
      is_ascii: true
```

## Author

Claudiu Cristea ([claudiu.cristea](https://www.drupal.org/u/claudiu.cristea))
