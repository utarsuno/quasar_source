#!/bin/bash

#            __          __        ___  __
# \  /  /\  |__) |  /\  |__) |    |__  /__`
#  \/  /~~\ |  \ | /~~\ |__) |___ |___ .__/

UNDEFINED="UNDEFINED"
ENVIRONMENT="dev"
BUILD_MODE=${UNDEFINED}
IS_LOCAL="true"
IS_DB_DEBUG="false"
PATH_SCRIPTS=${PATH_ROOT}scripts
PATH_SCRIPT_BUILD_NEXUS_LOCAL="/quasar/applications/code_manager/layer_applications/nexus_local_build_process.py"
PATH_DOCKER_BUILD="docker-compose.build.yml"
SCRIPT_BUILD_NEXUS_COURIER="/quasar/scripts/docker/build_nexus_courier.sh"

#if [ ! -f ${SCRIPT_BUILD_NEXUS_COURIER} ]; then
#    SCRIPT_BUILD_NEXUS_COURIER="~/quasar_source/scripts/docker/build_nexus_courier.sh"
#fi

#  ___            __  ___    __        __
# |__  |  | |\ | /  `  |  | /  \ |\ | /__`
# |    \__/ | \| \__,  |  | \__/ | \| .__/

function cd_base {
    cd ${PATH_ROOT}
}

function cd_scripts {
    cd ${PATH_SCRIPTS}
}

function __init__ {
    while getopts 'e:b:l:f:d:' OPTION; do
        case "$OPTION" in
            e)
                ENVIRONMENT="$OPTARG";;
            b)
                IS_BUILD_NEEDED="$OPTARG";;
            l)
                IS_LOCAL="$OPTARG";;
            f)
                IS_FRONT_END_ONLY="$OPTARG";;
            d)
                IS_DB_DEBUG="$OPTARG";;
            ?)
                echo "script usage: $(basename $0) [-e <environment>] [-b <is_build_needed>] [-l <is_local>] [-f <is_front_end_only>]" >&2
                exit 1;;
      esac
    done
    shift "$(($OPTIND -1))"

    case "${ENVIRONMENT}" in
        dev|qa|prod)
            ;;
        *)
            terminate_script "Bad environment passed in: ${ENVIRONMENT}";;
    esac

    case "${IS_BUILD_NEEDED}" in
        true)
            ;;
        false)
            ;;
        *)
            terminate_script "Bad is_build_needed passed in: ${IS_BUILD_NEEDED}";;
    esac

    case "${IS_FRONT_END_ONLY}" in
        true)
            ;;
        false)
            ;;
        *)
            terminate_script "Bad is_front_end_only passed in: ${IS_FRONT_END_ONLY}";;
    esac

    case "${IS_LOCAL}" in
        true)
            HOST_SOURCE_CODE_PATH="/Users/utarsuno/git_repos/quasar_source"
            HOST_VOLUME_SOURCE_CODE="${HOST_SOURCE_CODE_PATH}:/quasar"
            ;;
        false)
            HOST_SOURCE_CODE_PATH="/quasar"
            HOST_VOLUME_SOURCE_CODE="${HOST_SOURCE_CODE_PATH}:/quasar"
            ;;
        *)
            terminate_script "Bad is_local value passed in: ${IS_LOCAL}";;
    esac

    case "${IS_DB_DEBUG}" in
        true)
            ;;
        false)
            ;;
        *)
            terminate_script "Invalid argument value for {-d} --> {${IS_DB_DEBUG}}, should be true or false";;
    esac

    cd_base
}

function run_code_manager_process {
    cd_base

    if [ "${IS_FRONT_END_ONLY}" = "true" ]; then
        docker-compose -f ${PATH_DOCKER_BUILD} run -e CODE_BUILDER_BUILD_TYPE="build_fe" -e CODE_BUILDER_ENVIRONMENT=${ENVIRONMENT} code_manager python3 ${PATH_SCRIPT_BUILD_NEXUS_LOCAL} --exit-code-from code_manager --abort-on-container-exit
    else
        docker-compose -f ${PATH_DOCKER_BUILD} run -e CODE_BUILDER_BUILD_TYPE="build_all" -e CODE_BUILDER_ENVIRONMENT=${ENVIRONMENT} code_manager python3 ${PATH_SCRIPT_BUILD_NEXUS_LOCAL} --exit-code-from code_manager --abort-on-container-exit
    fi

    CODE_MANAGER_BUILD_RESULT=$?

    if [ ${CODE_MANAGER_BUILD_RESULT} -eq 200 ]; then
        echo "BUILD RESULT 200"
        docker-compose run --rm -v ${HOST_VOLUME_SOURCE_CODE} nexus_courier ${SCRIPT_BUILD_NEXUS_COURIER}
        docker_compose_down
        #finish_script_success
    elif [ ${CODE_MANAGER_BUILD_RESULT} -eq 199 ]; then
        #echo "BUILD RESULT 199"
        docker_compose_down
        finish_script_fail "Docker build process failed!"
    else
        #echo "BUILD RESULT NOT 199 NOR 200"
        #echo ${CODE_MANAGER_BUILD_RESULT}
        docker_compose_down
        #finish_script_success
    fi
}

function stop_docker_compose {
    cd_base
    docker-compose -f ${ROOT}${DOCKER_COMPOSE_FILE} stop;
}

function docker_compose_build {
    cd_base
    docker-compose -f ${DOCKER_COMPOSE_FILE} build;
}

function docker_compose_up {
    cd_base
    docker-compose -f ${DOCKER_COMPOSE_FILE} up; # --remove-orphans
    #CODE_BUILDER_BUILD_TYPE=${ENVIRONMENT} docker-compose -f ${DOCKER_COMPOSE_FILE} up; # --remove-orphans
}

function docker_compose_down {
    cd_base
    docker-compose -f ${DOCKER_COMPOSE_FILE} down;
}

function start_script {
    print_dashed_line_with_text "${SCRIPT_NAME} Started"
}

function docker_health_check {
    # ARG_OPERATION_ENSURE_NETWORK = 'n'
    # ARG_OPERATION_ENSURE_VOLUME  = 'v'
    cd_scripts
    python3 ./_pre_process/_operations_docker.py 'n' 'v'

    if [ "${IS_BUILD_NEEDED}" = "true" ]; then
        docker_compose_build
    fi
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
