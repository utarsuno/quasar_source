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
BASE_DIR=${DIR}/../../
# --------------------------------------------------------------------------------------------

start_script

git fetch
git pull

if [ -d "${BASE_DIR}generated_output" ]; then
  mkdir -p ${BASE_DIR}generated_output/local/code_manager
  mkdir -p ${BASE_DIR}generated_output/web_assets
  mkdir -p ${BASE_DIR}generated_output/nexus_courier
  #mkdir -p ${BASE_DIR}generated_output/third_party_libraries/three_js
fi



finish_script_success
