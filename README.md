# About the World Intermediary Liabilty Map (WILMap).
[World Intermediary Liabilty Map](http://cyberlaw.stanford.edu/our-work/projects/world-intermediary-liability-map-wilmap) (WILMap) is an online resource informing the public about evolving Internet regulation affecting freedom of expression and user rights worldwide.

This repository contains the new WILMap web app of 2017.

![Cover picture](/code/themes/wilmap/screenshot.png?raw=true "Cover Home page")

# Production
To build the project for production you need to run the following command:
```
npm run build
```
# Developing

The WILMap web app rides on [Drupal 8.2.5](https://www.drupal.org/project/drupal/releases/8.2.5).

To run the project can use [Docker](https://www.docker.com/) or a local database server.

# Initial development set up
- Install dependencies:
```
npm install
```

## How to run the WILMap image in Docker
#### Populate the database
 * See the instructions bellow on how to import existing data to your database:

#### Build the image using npm command
 ```
 npm start
 ```
 This initializes also [Gulp](http://gulpjs.com/) for compile css and js(babel) files.

#### Enjoy it!
   * Open the browser and access [http://localhost:8090](http://localhost:8090)

##### If you run project using local database server
Just need to run  
```
gulp watch
```
for compile css and js(babel) files


# First time you build the project
You need configure Drupal database completing the following form, with the necessary data.

- **Database name**: wilmap_db
- **Database username**: wilmap
- **Database password**: wilmap_root
- **Host**: postgres

![Cover picture](/assets/first_step.png?raw=true "Form")

And then we choose the option **View your existing site**.


## Managing your database

As Drupal projects realy heavily on the database, you need to make sure to import and export your database at relevant times

This project includes a dump of each table under **`database/w_backup.sql`**.

### Using a local database server

#### Importing from source to local database server

```
gunzip < database/w_backup.sql.gz | mysql -u <user> -p <database_name>
```

#### Exporting from local database server to source

```
mysqldump -u <user> -p <database_name> | gzip > .database/w_backup.sql.gz
```

### Using a docker database container

#### Importing from source to local database server

```
docker exec -it mysql-wilmap script /dev/null -c "gunzip < database/w_backup.sql.gz | mysql -u wilmap -pwilmap_root  wilmap_db"
```

#### Exporting from local database server to source

Use the following to clear caches:

```
docker exec -it drupal_wilmap drush cache-rebuild
```

Then, use this command to export the database:

```
docker exec -it mysql-wilmap script /dev/null -c "mysqldump -u wilmap -pwilmap_root --default-character-set=utf8 wilmap_db  | gzip > database/w_backup.sql.gz"
```
