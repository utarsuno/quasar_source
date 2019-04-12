#!/usr/bin/env bash

# Path location to this script and the project base.
PATH_SELF="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PATH_ROOT=${PATH_SELF}/../../

# Load script libraries needed.
source ${PATH_ROOT}/scripts/_pre_process/utilities_general.sh
source ${PATH_ROOT}/scripts/_pre_process/utilities_docker.sh

# Go to project base directory.
cd_base

# Script Variables ---------------------------------------------------------------------------
SCRIPT_NAME="Run Nexus Local"
IS_RUNNING="$(docker ps | grep quasar_source_front_end)"
# --------------------------------------------------------------------------------------------

echo "${SCRIPT_NAME} Started"

if [ -z "${IS_RUNNING}" ]; then
  echo "Nexus Local is spawning!"
  nohup scripts/local/front_end_only/run.sh &
else
  echo "[${IS_RUNNING}];"
  echo " ^ Nexus Local is already running!"
fi

finish_script_success
