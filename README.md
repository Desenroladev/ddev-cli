# PGDDEV

![](https://desenroladev.com.br/public/logo-180x180.png)

![](https://img.shields.io/github/stars/Desenroladev/pgddev.svg) ![](https://img.shields.io/github/forks/Desenroladev/pgddev.svg) ![](https://img.shields.io/github/issues/Desenroladev/pgddev.svg)

## Setup

#### Installing pgddev

`$ npm i -g @ddev-cli` or `$ yarn global add @ddev-cli`

#### Creating a new project

Creating a new project is quite simple with the DDEV. you can create a new DDEV project with the following commands in your OS terminal:

`$ ddev new project_name`

#### Setting up .env

For your PGDDEV project to work correctly you must configure the application .env as follows:

```.env
DB_HOST=my_host
DB_PORT=my_port
DB_DATABASE=my_database
DB_PASSWORD=my_password
DB_USER=my_username

```

## Avaliable commands

#### Creating a DML

`$ ddev dml table_name`

Creating a standard DML framework facilitates and standardizes the development process for any application, so much of the CRUD work will be abstracted.

##### Available instructions

| Instruction    				| Functionality                                         |
| ----------------------------- | ----------------------------------------------------- |
| -s or --schema 				| Specifies the schema                                  |
| -f or --folder 				| Specifies the folder where scripts will be generated. |
| -p or --pk_name 				| Specifies Primary Key name                            |
| -t or --pk_type 				| Specifies Primary Key type                            |
| -d or --deploy 				| Deploy DML                                            |
| -w or --with-delete-software 	| With Software Delete or Not                           |

#### Example

Create the DML structure in the database, with the specified schema, in the specified folder and deploy.

`ddev dml table_name -s schema_name -f folder_path --deploy`

### Using DML

#### Generated files

- dmlapi_table_name_j2r.sql
- dmlapi_table_name_r2j.sql
- dmlapi_table_name_merge.sql
- dmlapi_table_name_purge.sql
- dmlapi_table_name_select.sql

#### Query examples

| Query                                                        | Description                                                                       |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `schema_name.dmlapi_table_name_j2r(payload::jsonb)`          | turns a jsonb into table record.                                                  |
| `schema_name.dmlapi_table_name_r2j(payload::table_name)`     | receives a record from the table and transforms it into jsonb.                    |
| `schema_name.dmlapi_table_name_merge(payload::jsonb)`        | Generates a JSON in the exact format of the table from a RECORD input.            |
| `schema_name.dmlapi_table_name_purge(resource_id, user_id)`  | Soft delete a record in a table from the resource id and user id that deleted it. |
| `schema_name.dmlapi_table_name_select(resource_id, locking)` | Returns record from id (locking=true locks the record at transaction time)        |


#### Deploy a DML Scripts

`$ ddev deploy script_or_folder_name`

Passing in the path of a script or folder will execute all SQL commands in the scripts..

### End
