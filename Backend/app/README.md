## FLASK RESTFUL SURVEY - INT3306-6
### Start app with docker
#### Prerequisites
- Os: Windows or Linux
- Docker
- Docker-compose

#### Start app for development
- Copy .env.example => .env
- Edit mapping port, or environment if need
- Run `docker-compose up`
- Open http://localhost:{APP_PORT}/api . Enjoy!

#### Deployment
- Copy .env.example => .env
- Edit mapping port, or environment if need
- Copy docker-compose.override.sample.yml => docker-compose.override.yml
- Run `docker-compose up`

#### Database Migrations
- Create new migration: `docker-compose exec app flask db migrate -m "add_user"`  
- Upgrade: `docker-compose exec app flask db upgrade`  
- Downgrade: `docker-compose exec app flask db downgrade`  


### Console commands

- To run application: `python -m flask run`

### Database migration

1. Initiate a migration folder (once only)

```bash
flask db init
```

2. Create migration script from detected changes in the model
```bash
flask db migrate --message 'initial database migration'
```

3. Apply the migration script to the database
```bash
flask db upgrade
``` 

### Viewing the app ###

Open the following url on your browser to view swagger documentation
[http://127.0.0.1:5000/](http://127.0.0.1:5000/)   

#### Module structure
Each module is spitted by repository pattern
##### Repository Pattern
![alt text](https://i.imgur.com/cNUvEwZ.png "Repository Pattern")


##### Module folder structure
:file_folder: /api: define api url, request body, params  
:file_folder: /commands: define flask command  
:file_folder: /extensions: setup base configuration  
:file_folder: /helpers: define helper function  
:file_folder: /models: define orm model  
:file_folder: /repositories: define repository to access data  
:file_folder: /services: handle business logic  
:file_folder: /tests: app test script  


#### Libraries
- Flask http://flask.pocoo.org/  
- Flask restplus: document api https://flask-restplus.readthedocs.io/en/stable/  
- Pytest: testing framework https://docs.pytest.org/en/latest/
- SqlAlchemy: orm http://flask-sqlalchemy.pocoo.org/2.3/
- Faker: data faker for test https://faker.readthedocs.io/en/master/