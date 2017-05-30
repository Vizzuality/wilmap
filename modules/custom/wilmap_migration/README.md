# INTRODUCTION
WILMap migration instructions


# MIGRATIONS 

## MIGRATION: countries, regions and continents

### Source
Source: public://csv/wilmap_countries_regions_matrix.csv

Preprocess CSV file:
1. Rename and remove columns:
    - A -> country
    - D -> continent
    - E -> region 
    - B -> remove
    - C -> remove

### Process
Process automatically generates Continents and Regions from CSV.
Region is a multivalue field separated by "+", the process explode it an generates needed entities.

### After migration
Nothing.







# REMEMBER, REMEMBER

Migrations status:
```
drush migrate-status
```
Run a migration:
```
drush migrate-import [migration_id]
```
Migration rollback:
```
drush migrate-rollback [migration_id]
```
