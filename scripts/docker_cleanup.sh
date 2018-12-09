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

start_script

print_dashed_line_with_text "Removing un-used networks."
echo 'y' | docker network prune
echo ''
print_dashed_line_with_text "Un-used networks removed."


print_dashed_line_with_text "Removing un-used volumes."
echo 'y' | docker volume prine
echo ''
print_dashed_line_with_text "Un-used volumes removed."


print_dashed_line_with_text "Removing un-used images."
echo 'y' | docker image prine
echo ''
print_dashed_line_with_text "Un-used images removed."


print_dashed_line_with_text "Removing stopped containers."
docker ps -aq --no-trunc -f status=exited | xargs docker rm
print_dashed_line_with_text "Removed stopped containers."

finish_script_success

