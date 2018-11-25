#!/usr/bin/env bash

# Location of this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
# Load utility functions.
source ${DIR}/../../scripts/utilities/script_utilities.sh
source ${DIR}/../../scripts/utilities/docker_utilities.sh
# Go to project base directory.
cd ${DIR}/../..;

# Script Variables ---------------------------------------------------------------------------
SCRIPT_NAME="Run Nexus Local"
IS_RUNNING="$(docker ps | grep quasar_source_front_end)"
# --------------------------------------------------------------------------------------------

start_script

if [ -z "$(IS_RUNNING)" ]; then
  echo "Nexus Local is already running!\n"
else
  echo "Nexus Local is spawning!\n"
  nohup scripts/local/front_end_only/run.sh &
fi

finish_script_success
