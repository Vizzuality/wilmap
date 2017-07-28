# INTRODUCTION
WILMap migration instructions.


# MIGRATIONS 

## MIGRATION: countries, regions and continents (wilmap_countries)

### Preprocess
Remove countries, continents and regions from drupal.

### Source
Source: modules/custom/wilmap_migration/data/wilmap_countries.csv

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

