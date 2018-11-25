#!/usr/bin/env bash

# Location of this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
# Load utility functions (if needed).
source ${DIR}/../../../scripts/utilities/script_utilities.sh
source ${DIR}/../../../scripts/utilities/docker_utilities.sh
# Go to project base directory.
cd ${DIR}/../../..;

# Script Variables ---------------------------------------------------------------------------
SCRIPT_NAME="Front End Only Build Process"
DOCKER_COMPOSE_FILE="docker-compose.dev.front_end_only.build.yml"
# --------------------------------------------------------------------------------------------

start_script_with_docker_health_check
# TODO: Dynamic build
#docker_compose_build

docker-compose -f ${DOCKER_COMPOSE_FILE} up --exit-code-from code_manager --abort-on-container-exit
CODE_MANAGER_BUILD_RESULT=$?

if [ ${CODE_MANAGER_BUILD_RESULT} -eq 199 ]; then
    docker_compose_down
    finish_script_fail "Docker build process failed!"
else
    docker_compose_down
    finish_script_success
fi
