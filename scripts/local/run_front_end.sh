#!/usr/bin/env bash

cd ../../;
source ./scripts/utilities/script_utilities.sh

print_dashed_line_with_text "Quasar Front End Start"

#python3 ./scripts/local/_utility_scripts/ensure_host_connection_network.py

#docker-compose down;
docker-compose -f docker-compose.front_end.yml build;
docker-compose -f docker-compose.front_end.yml up;
#docker-compose up --remove-orphans;

print_dashed_line_with_text "Quasar Front End Finished"
