#!/usr/bin/env bash

# Path location to this script and the project base.
PATH_SELF="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PATH_ROOT=${PATH_SELF}/../

# Load script libraries needed.
source ${PATH_SELF}/_pre_process/utilities_general.sh
source ${PATH_SELF}/_pre_process/utilities_docker.sh

# Ensure proper script arguments were provided.
__init__ "$@"

SCRIPT_NAME="Build"
DOCKER_COMPOSE_FILE="docker-compose.build.yml"

#echo ${ENVIRONMENT}
#echo ${BUILD_MODE}
#echo ${IS_LOCAL}

start_script_with_docker_health_check

run_code_manager_process
#CODE_MANAGER_BUILD_RESULT=$?





