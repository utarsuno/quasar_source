#!/usr/bin/env bash

cd ../../;

docker-compose down;

docker-compose build;

docker-compose up --remove-orphans;
