#!/usr/bin/env bash

# Path location to this script and the project base.
PATH_SELF="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PATH_ROOT=${PATH_SELF}/../

# Load script libraries needed.
source ${PATH_SELF}/_pre_process/utilities_general.sh
source ${PATH_SELF}/_pre_process/utilities_docker.sh

cd_base

SCRIPT_NAME="Front End Only"

echo "${SCRIPT_NAME} Started"

sudo rm ./generated_output/local/code_manager/db.sqlite

finish_script_success
