#!/usr/bin/env bash

# Location of this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
# Load utility functions.
source ${DIR}/../../../scripts/utilities/script_utilities.sh
source ${DIR}/../../../scripts/utilities/docker_utilities.sh
# Go to project base directory.
cd ${DIR}/../../..;

###
SCRIPT_NAME="Front End Only"
DOCKER_COMPOSE_FILE="docker-compose.dev.front_end_only.yml"
###

start_script

./scripts/local/front_end_only/build.sh;
BUILD_PROCESS_RESULT_CODE=$?

if [ ${BUILD_PROCESS_RESULT_CODE} -eq 199 ]; then
    print_red_text "Build process failed so not running service."
    finish_script 199
elif [ ${BUILD_PROCESS_RESULT_CODE} -eq 0 ]; then
    # TODO: dynamic build
    docker_compose_up
    docker_compose_down
    finish_script 0
else
    print_red_text "UNKNOWN STATUS CODE [ ${BUILD_PROCESS_RESULT_CODE} ]"
    finish_script 198
fi
