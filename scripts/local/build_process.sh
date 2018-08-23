#!/usr/bin/env bash

cd ../../;
source ./scripts/utilities/script_utilities.sh

print_dashed_line_with_text "Quasar Build Process Start"

docker-compose -f docker-compose.build.yml down;
docker-compose -f docker-compose.build.yml build;
docker-compose -f docker-compose.build.yml up --remove-orphans;

print_dashed_line_with_text "Quasar Build Process Finished"
