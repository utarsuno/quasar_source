#!/usr/bin/env bash

# Path location to this script and the project base.
PATH_SELF="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
PATH_ROOT=${PATH_SELF}/../

# Load script libraries needed.
source ${PATH_SELF}/_pre_process/utilities_general.sh
source ${PATH_SELF}/_pre_process/utilities_docker.sh

cd_base

# Script Variables ---------------------------------------------------------------------------
SCRIPT_NAME="Push latest code changes"
PATH_SCRIPT_OPERATIONS_GIT="./scripts/_pre_process/_operations_git.py"
HOST_SOURCE_CODE_PATH="/Users/utarsuno/git_repos/quasar_source"
# --------------------------------------------------------------------------------------------

# c - clean_git
# n - no_changes_to_push
# p - push_changes

start_script

python3 ${PATH_SCRIPT_OPERATIONS_GIT} 'c';

WORKTREE=${HOST_SOURCE_CODE_PATH}
CHANGED=$(git --work-tree=${WORKTREE} status --porcelain)

if [ -n "${CHANGED}" ]; then
  python3 ${PATH_SCRIPT_OPERATIONS_GIT} 'p';
else
  python3 ${PATH_SCRIPT_OPERATIONS_GIT} 'n';
fi

finish_script_success
