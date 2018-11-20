#!/usr/bin/env bash

# Location of this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
# Load utility functions.
source ${DIR}/../../scripts/utilities/script_utilities.sh
source ${DIR}/../../scripts/utilities/docker_utilities.sh
# Go to project base directory.
cd ${DIR}/../..;

# Script Variables ---------------------------------------------------------------------------
SCRIPT_NAME="Nexus Local"
DOCKER_COMPOSE_FILE="docker-compose.yml"
# --------------------------------------------------------------------------------------------

start_script_with_docker_health_check

# TODO: Add build process???

#TODO: Dynamic build.
docker_compose_build
docker_compose_up
docker_compose_down

finish_script 0
