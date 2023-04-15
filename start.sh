#!/bin/bash

# VDocker container for back end and DB

if [ "$1" == "dev" ]; then
    COMPOSE_FILE=docker-compose.dev.yml
elif [ "$1" == "prod" ]; then
    COMPOSE_FILE=docker-compose.prod.yml
else
    echo "Invalid argument. Usage: $0 [dev|prod] [rebuild]"
    exit 1
fi

if [ "$2" == "rebuild" ]; then
    docker compose -f ./"$COMPOSE_FILE" up --build
else
    docker compose -f ./"$COMPOSE_FILE" up
fi
