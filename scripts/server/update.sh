#!/usr/bin/env bash

# Location of this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
# Load utility functions.
source ${DIR}/../../scripts/utilities/script_utilities.sh
source ${DIR}/../../scripts/utilities/docker_utilities.sh
# Go to project base directory.
cd ${DIR}/../..;

# Script Variables ---------------------------------------------------------------------------
SCRIPT_NAME="Update Server Code"
# --------------------------------------------------------------------------------------------

start_script

git fetch
git pull

if [ -d "${DIR}/../local" ]; then
  # Control will enter here if $DIRECTORY exists.
  printf "Local directory exists!"
  sudo rm -rf ${DIR}/../local
fi

finish_script_success
