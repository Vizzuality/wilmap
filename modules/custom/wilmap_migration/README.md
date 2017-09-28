# INTRODUCTION
WILMap migration instructions.


# MIGRATIONS 

## MIGRATION: countries, regions and continents (wilmap_countries)

### Preprocess
Remove countries, continents and regions from drupal.

### Source
Source: modules/custom/wilmap_migration/data/wilmap_countries_regions_matrix.csv

Preprocess CSV file:
1. Rename and remove columns:
    - A -> country
    - D -> continent
    - E -> region 
    - B -> remove
    - C -> remove
2. Lookup for country iso 2 codes and check each one, as vlookup fails sometimes

### Process
Process automatically generates Continents and Regions from CSV.
Region is a multivalue field separated by "+", the process explode it an generates needed entities.

### After migration
Nothing.


## MIGRATION: users (wilmap_users)

### Preprocess
- Remove countries, continents and regions from drupal.

### Source
Source: modules/custom/wilmap_migration/data/wilmap_users.csv

Preprocess CSV file:
1. Rename headers: name,firstname,lastname,position,affiliation,country,region,email,email2,uid,roles,active,access,twitter,linkedin,web,web2,contributor,role
2. Generate *firstname* and *lastname* columns from *name*. Some need manual edition.
3. Generate *role* column from *contributors* column
4. Replace long strings in *name* column
5. Join columns with multiple countries under same row separating countries with comma

### Process
*country* is a multivalue field separated by ",", the process explode it an looks up for needed entities.

### After migration
Nothing.



## MIGRATION: entries (wilmap_entries)

### Preprocess
- Remove entries.

### Source
Source: modules/custom/wilmap_migration/data/wilmap_entries.csv

Preprocess CSV file:
1. Añadimos una columna *id* a partir del número de fila
2. Rename headers
3. Generate *link_ok* column that generates link depending on provided info provided in other link columns
4. Generate *body_clean* that trims brackets from *body_html*

### Process
1. Taxonomy fields are multivalue fields separated by "+", the process explode it an looks up for needed entities.
2. *field_section* maps each term by name

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

Update migrations configuration file. Needs *config_devel* module:
```
# Configuration files added after install when developing as config files are only copied on module install
# The run:
drush cdi <module_name>
drush cr
```
Delete all content of certain type with devel module:
```
drush genc 0 --types=article --kill
```

Delete all terms from vocabulary with devel module:
```
drush gent focus_area 0 --kill
```


