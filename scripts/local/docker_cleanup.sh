#!/usr/bin/env bash

# Location of this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
# Load utility functions.
source ${DIR}/../../scripts/utilities/script_utilities.sh
source ${DIR}/../../scripts/utilities/docker_utilities.sh
# Go to project base directory.
cd ${DIR}/../..;

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

