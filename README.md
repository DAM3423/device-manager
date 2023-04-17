# Device Manager

Device Manager is a web application for managing devices. It can be initialized using a shell script that runs the app in a Dockerized environment. The app supports two modes: **development** and **production**.

The tech stack for this application includes PostgreSQL for the database, Node.js with Express for the server-side framework, and Vue.js with Vuetify for the client-side framework. This stack provides a reliable, scalable, and feature-rich platform for building web applications with powerful database functionality and beautiful user interfaces.

## Starting the application

Before you run the application you will need to add a **.env** file for each environment mode.

For development mode it is `.env.dev`.
For production mode it is `.env.prod`.

An example .env file is provided below:

```
#PGSQL
POSTGRES_USER=sammy
POSTGRES_PASSWORD=password
POSTGRES_DB=device_manager
#API
DB_HOST: db
DB_PORT: 5432
DB_NAME: device_manager
DB_USER: sammy
DB_PASSWORD: password
```

The environments for the Device Manager web application can be easily deployed using the shell script **start.sh**. This script takes two parameters, **dev** or **prod**, to indicate whether the app should be run in development or production mode, respectively. Additionally, the second parameter **rebuild** can be set to rebuild the Docker container before starting the app.

**To deploy in development mode and rebuild the environment from scratch, please use** `./start.sh dev rebuild`.

**To deploy in production mode, please use** `./start.sh prod`.

The [API](http://localhost) is avaliable at `http://localhost:8080/`.

The Client is avaliable at `http://localhost:3000/` for [development](http://localhost:3000) mode and `http://localhost` for [production](http://localhost) mode.

The Docker dev environment supports hot reloading, allowing for faster iteration and testing. The production container is optimized for performance and stability, and should only be used for live deployment.

## Testing

The unit test are created using Jest and Supertest. You can run these tests by using the docker exec command to run a command in the API container.

i.e. `docker exec {CONTAINER_ID} npm run test`

In order to run this command, you will need to find the API container ID either in Docker Desktop or using the command line. `docker ps` will allow you to find the API container ID

## Project Structure

The project is structured as follows:

```
.
├── db
│   ├── devices.sql
├── api
│   ├── Dockerfile.dev
│   ├── Dockerfile.prod
│   ├── index.js
│   └── package.json
├── client
│   ├── Dockerfile.dev
│   ├── Dockerfile.prod
│   ├── public
│   ├── src
│   └── package.json
├── docker-compose.dev.yml
└── docker-compose.prod.yml
```

- db: Contains the PostgreSQL database schema file.
- api: Contains the Node.js and Express API that provides a RESTful interface to the database.
- client: Contains the Vue.js client application that consumes the API and presents the user interface.
- docker-compose.dev.yml: Defines the services that make up the development environment, including the database, API, and client, as well as any additional services required.
- docker-compose.prod.yml: Defines the services that make up the production environment, including the database, API, and client, as well as any additional services required.


