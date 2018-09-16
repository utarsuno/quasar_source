#!/usr/bin/env bash

cd ../../;
source ./scripts/utilities/script_utilities.sh

print_dashed_line_with_text "Quasar Run Process Start"

python3 ./scripts/local/_utility_scripts/ensure_docker_network_exists.py

docker-compose down;
docker-compose build;
docker-compose up --remove-orphans;

print_dashed_line_with_text "Quasar Run Process Finished"
