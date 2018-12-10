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
SCRIPT_NAME="Update Server Code"
# --------------------------------------------------------------------------------------------

start_script

git clean -f -d
git fetch
git pull

if [ -d "${PATH_ROOT}generated_output" ]; then
  mkdir -p ${PATH_ROOT}generated_output/local/code_manager
  mkdir -p ${PATH_ROOT}generated_output/web_assets
  mkdir -p ${PATH_ROOT}generated_output/nexus_courier
  #mkdir -p ${BASE_DIR}generated_output/third_party_libraries/three_js
fi



finish_script_success
