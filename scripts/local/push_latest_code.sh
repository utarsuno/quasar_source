#!/usr/bin/env bash

# Location of this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
# Load utility functions.
source ${DIR}/../../scripts/utilities/script_utilities.sh
source ${DIR}/../../scripts/utilities/docker_utilities.sh
# Go to project base directory.
cd ${DIR}/../..;

# Script Variables ---------------------------------------------------------------------------
SCRIPT_NAME="Push latest code changes"
# --------------------------------------------------------------------------------------------

# c - clean_git
# n - no_changes_to_push
# p - push_changes

start_script

python3 ${SCRIPT_OPERATIONS_GIT} 'c';

WORKTREE=${HOST_SOURCE_CODE_PATH}
CHANGED=$(git --work-tree=${WORKTREE} status --porcelain)

if [ -n "${CHANGED}" ]; then
  python3 ${SCRIPT_OPERATIONS_GIT} 'p';
else
  python3 ${SCRIPT_OPERATIONS_GIT} 'n';
fi

finish_script 0
