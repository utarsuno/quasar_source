#!/usr/bin/env bash

# Location of this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
# Load utility functions.
source ${DIR}/../../scripts/utilities/script_utilities.sh
# Go to project base directory.
cd ${DIR}/../..;

# c - clean_git
# n - no_changes_to_push
# p - push_changes

python3 ./scripts/functionalities/_push_latest_code.py 'c';

WORKTREE=/Users/utarsuno/git_repos/quasar_source
CHANGED=$(git --work-tree=${WORKTREE} status --porcelain)

if [ -n "${CHANGED}" ]; then
  python3 ./scripts/functionalities/_push_latest_code.py 'p';
else
  python3 ./scripts/functionalities/_push_latest_code.py 'n';
fi
