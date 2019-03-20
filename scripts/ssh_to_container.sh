#!/usr/bin/env bash

# Path location to this script and the project base.
PATH_SELF="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PATH_ROOT=${PATH_SELF}/../

# Load script libraries needed.
source ${PATH_SELF}/_pre_process/utilities_general.sh
source ${PATH_SELF}/_pre_process/utilities_docker.sh

cd_base

# Useful link: http://sebthom.de/158-bash-capturing-stderr-variable/
CHOSEN_CONTAINER_ID=$(python3 ./scripts/_pre_process/_operations_docker.py 'c' 3>&1 1>&2 2>&3 | tee /dev/stderr)

if [ -z "$CHOSEN_CONTAINER_ID" ]; then
      # No container was chosen.
      CHOSEN_CONTAINER_ID="NONE"
else
      eval ${CHOSEN_CONTAINER_ID}
fi


