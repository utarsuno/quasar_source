#!/bin/bash

#            __          __        ___  __
# \  /  /\  |__) |  /\  |__) |    |__  /__`
#  \/  /~~\ |  \ | /~~\ |__) |___ |___ .__/

HOST_SOURCE_CODE_PATH="/Users/utarsuno/git_repos/quasar_source"
HOST_VOLUME_SOURCE_CODE="${HOST_SOURCE_CODE_PATH}:/quasar"
SCRIPT_BUILD_NEXUS_COURIER="/quasar/scripts/docker/build_nexus_courier.sh"
SCRIPT_OPERATIONS_GIT="./scripts/functionalities/_operations_git.py"

#  ___            __  ___    __        __
# |__  |  | |\ | /  `  |  | /  \ |\ | /__`
# |    \__/ | \| \__,  |  | \__/ | \| .__/

function stop_docker_compose {
    docker-compose -f ${DOCKER_COMPOSE_FILE} stop;
}

function docker_compose_build {
    docker-compose -f ${DOCKER_COMPOSE_FILE} build;
}

function docker_compose_up {
    docker-compose -f ${DOCKER_COMPOSE_FILE} up; # --remove-orphans
}

function docker_compose_down {
    docker-compose -f ${DOCKER_COMPOSE_FILE} down;
}

function start_script {
    print_dashed_line_with_text "${SCRIPT_NAME} Started"
}

function docker_health_check {
    # ARG_OPERATION_ENSURE_NETWORK = 'n'
    # ARG_OPERATION_ENSURE_VOLUME  = 'v'
    python3 ./scripts/functionalities/_operations_docker.py 'n' 'v'
}

function start_script_with_docker_health_check {
    start_script
    docker_health_check
}

function finish_script {
    print_dashed_line_with_text "${SCRIPT_NAME} Finished"
    if [ -x "$1" ]; then
        exit
    else
        exit $1
    fi
}

function finish_script_success {
    print_dashed_line_with_text "${SCRIPT_NAME} Finished!"
    exit 0
}

function finish_script_fail {
    if [ -z "$1" ]; then
        print_dashed_line_with_text "${SCRIPT_NAME} Failed!"
    else
        print_red_text "${1}"
        print_dashed_line_with_text "${SCRIPT_NAME} Failed!"
    fi
    exit 199
}
