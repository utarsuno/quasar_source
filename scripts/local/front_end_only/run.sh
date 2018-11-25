#!/usr/bin/env bash

# Location of this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
# Load utility functions.
source ${DIR}/../../../scripts/utilities/script_utilities.sh
source ${DIR}/../../../scripts/utilities/docker_utilities.sh
# Go to project base directory.
cd ${DIR}/../../..;

# Script Variables ---------------------------------------------------------------------------
SCRIPT_NAME="Front End Only"
DOCKER_COMPOSE_FILE="docker-compose.dev.front_end_only.yml"
# --------------------------------------------------------------------------------------------

start_script

./scripts/local/front_end_only/build.sh;
BUILD_PROCESS_RESULT_CODE=$?

if [ ${BUILD_PROCESS_RESULT_CODE} -eq 199 ]; then
    finish_script_fail "Build process failed so not running service."
elif [ ${BUILD_PROCESS_RESULT_CODE} -eq 0 ]; then
    # TODO: dynamic build
    docker_compose_up
    docker_compose_down
    finish_script_success
else
    finish_script_fail "UNKNOWN STATUS CODE [ ${BUILD_PROCESS_RESULT_CODE} ]"
fi
