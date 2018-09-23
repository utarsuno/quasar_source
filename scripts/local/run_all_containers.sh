#!/usr/bin/env bash

# Location of this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
# Load utility functions.
source ${DIR}/../../scripts/utilities/script_utilities.sh
# Go to project base directory.
cd ${DIR}/../..;


print_dashed_line_with_text "Quasar Run Process Start"

python3 ./scripts/functionalities/_operations_docker.py 'n'

#docker-compose down;

docker-compose build;
#docker-compose up --remove-orphans;
docker-compose up;

docker-compose down;

print_dashed_line_with_text "Quasar Run Process Finished"
