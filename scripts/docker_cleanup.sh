#!/usr/bin/env bash

# Path location to this script and the project base.
PATH_SELF="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PATH_ROOT=${PATH_SELF}/../

# Load script libraries needed.
source ${PATH_SELF}/_pre_process/utilities_general.sh
source ${PATH_SELF}/_pre_process/utilities_docker.sh

# Go to project base directory.
cd_base

# Script Variables ---------------------------------------------------------------------------
SCRIPT_NAME="Docker clean up"
# --------------------------------------------------------------------------------------------

echo "${SCRIPT_NAME} Started"

echo "Removing un-used networks."
echo 'y' | docker network prune
echo ''
echo "Un-used networks removed."


echo "Removing un-used volumes."
echo 'y' | docker volume prine
echo ''
echo "Un-used volumes removed."


echo "Removing un-used images."
echo 'y' | docker image prine
echo ''
echo "Un-used images removed."


echo "Removing stopped containers."
docker ps -aq --no-trunc -f status=exited | xargs docker rm
echo "Removed stopped containers."

finish_script_success

