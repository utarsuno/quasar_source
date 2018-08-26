#!/usr/bin/env bash

# c - clean_git
# n - no_changes_to_push
# p - push_changes

cd ../../../;
python scripts/local/git_operations/_push_latest_code.py 'c';

WORKTREE=/Users/utarsuno/git_repos/quasar_source
CHANGED=$(git --work-tree=${WORKTREE} status --porcelain)

if [ -n "${CHANGED}" ]; then
  python scripts/local/git_operations/_push_latest_code.py 'p';
else
  python scripts/local/git_operations/_push_latest_code.py 'n';
fi
