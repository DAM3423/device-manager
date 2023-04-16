# Device Manager

Device Manager is a web application for managing devices. It can be initialized using a shell script that runs the app in a Dockerized environment. The app supports two modes: **development** and **production**.

## Starting the application

Before you run the application you will need to add a **.env** file for each environment mode.

For development mode it is `.env.dev`.
For production mode it is `.env.prod`.

An example .env file is provided below:

`#PGSQL
POSTGRES_USER=sammy
POSTGRES_PASSWORD=password
POSTGRES_DB=device_manager
#API
DB_HOST: db
DB_PORT: 5432
DB_NAME: device_manager
DB_USER: sammy
DB_PASSWORD: password`

The environments for the Device Manager web application can be easily deployed using the shell script **start.sh**. This script takes two parameters, **dev** or **prod**, to indicate whether the app should be run in development or production mode, respectively. Additionally, the second parameter **rebuild** can be set to rebuild the Docker container before starting the app.

**To deploy in development mode and rebuild the environment from scratch, please use** `./start.sh dev rebuild`.

**To deploy in production mode, please use** `./start.sh prod`.

The [API](http://localhost) is avaliable at `http://localhost:8080/`.

The Client is avaliable at `http://localhost:3000/` for [development](http://localhost:3000) mode and `http://localhost` for [production](http://localhost) mode.

