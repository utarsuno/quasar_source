#!/usr/bin/env bash

# Location of this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
# Load utility functions (if needed).
source ${DIR}/../../scripts/utilities/script_utilities.sh
source ${DIR}/../../scripts/utilities/docker_utilities.sh
# Go to project base directory.
cd ${DIR}/../..;

# Script Variables ---------------------------------------------------------------------------
SCRIPT_NAME="Nexus Local Build Process"
DOCKER_COMPOSE_FILE="docker-compose.dev.build.yml"
# --------------------------------------------------------------------------------------------

start_script_with_docker_health_check
# TODO: Dynamic build
docker_compose_up
CODE_MANAGER_BUILD_RESULT=$(docker wait quasar_source_code_manager_1)

if [ ${CODE_MANAGER_BUILD_RESULT} -eq 200 ]; then
    # Go to project base directory.
    cd ${DIR}/../..;
    docker-compose run --rm -v ${HOST_VOLUME_SOURCE_CODE} nexus_courier ${SCRIPT_BUILD_NEXUS_COURIER}
    docker_compose_down
    finish_script_success
elif [ ${CODE_MANAGER_BUILD_RESULT} -eq 199 ]; then
    docker_compose_down
    finish_script_fail "Docker build process failed!"
else
    docker_compose_down
    finish_script_success
fi
