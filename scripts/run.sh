#!/usr/bin/env bash

# Path location to this script and the project base.
PATH_SELF="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PATH_ROOT=${PATH_SELF}/../

# Load script libraries needed.
source ${PATH_SELF}/_pre_process/utilities_general.sh
source ${PATH_SELF}/_pre_process/utilities_docker.sh

# Ensure proper script arguments were provided.
__init__ "$@"

# Script Variables ---------------------------------------------------------------------------
SCRIPT_NAME="Nexus Local"
DOCKER_COMPOSE_FILE="docker-compose.yml"
# --------------------------------------------------------------------------------------------

#start_script_with_docker_health_check
start_script

cd_scripts

bash build.sh -e ${ENVIRONMENT} -l ${IS_LOCAL} -f ${IS_FRONT_END_ONLY} -d ${IS_DB_DEBUG} -b ${IS_BUILD_NEEDED}
BUILD_PROCESS_RESULT_CODE=$?

if [ ${BUILD_PROCESS_RESULT_CODE} -eq 199 ]; then
    echo "BUILD PROCESS 199"
elif [ ${BUILD_PROCESS_RESULT_CODE} -eq 0 ]; then

    if [ "${IS_BUILD_NEEDED}" = "true" ]; then
        docker_compose_build
    elif [ "${IS_BUILD_NEEDED}" = "nginx" ]; then
        #cd_scripts
        #bash nuke_build_cache.sh
        cd_base
        docker-compose -f ${DOCKER_COMPOSE_FILE} build nginx
    elif [ "${IS_BUILD_NEEDED}" = "nexus_courier" ]; then
        cd_base
        docker-compose -f ${DOCKER_COMPOSE_FILE} build nexus_courier
    fi

    docker_compose_up
    docker_compose_down
    #echo "BUILD PROCESS 0"
    finish_script_success
else
    #echo "BUILD PROCESS "
    finish_script_fail "UNKNOWN STATUS CODE [ ${BUILD_PROCESS_RESULT_CODE} ]"
fi

#docker_compose_build
#docker_compose_up
#docker_compose_down

finish_script_success
