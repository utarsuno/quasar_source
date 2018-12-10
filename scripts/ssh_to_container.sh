#!/usr/bin/env bash

# Location of this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
# Load utility functions.
source ${DIR}/../../scripts/_pre_process/utilities_general.sh
# Go to project base directory.
cd ${DIR}/../..;

# Useful link: http://sebthom.de/158-bash-capturing-stderr-variable/
CHOSEN_CONTAINER_ID=$(python3 ./scripts/_pre_process/_operations_docker.py 'c' 3>&1 1>&2 2>&3 | tee /dev/stderr)

if [ -z "$CHOSEN_CONTAINER_ID" ]; then
      # No container was chosen.
      CHOSEN_CONTAINER_ID="NONE"
else
      eval ${CHOSEN_CONTAINER_ID}
fi
