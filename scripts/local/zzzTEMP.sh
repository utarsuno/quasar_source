#!/usr/bin/env bash

# Location of this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
# Load utility functions.
source ${DIR}/../../scripts/utilities/script_utilities.sh
# Go to project base directory.
cd ${DIR}/../..;

print_dashed_line_with_text "Removing un-used networks."

echo 'y' | docker network prune

echo ''

print_dashed_line_with_text "Un-used networks removed."


