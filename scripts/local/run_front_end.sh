#!/usr/bin/env bash

# Location of this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
# Load utility functions.
source ${DIR}/../../scripts/utilities/script_utilities.sh
# Go to project base directory.
cd ${DIR}/../..;


./scripts/local/build_process.sh;


print_dashed_line_with_text "Quasar Front End Start"

python3 ./scripts/local/_utility_scripts/ensure_docker_network_exists.py


# TODO: automate checking if build process needs to occur.
# TEMPORARY COMMENT OUT TO SPEED UP BUILD PROCESS
docker-compose -f docker-compose.dev.front_end_only.yml build;


docker-compose -f docker-compose.dev.front_end_only.yml up;

docker-compose -f docker-compose.dev.front_end_only.yml down;


print_dashed_line_with_text "Quasar Front End Finished"
