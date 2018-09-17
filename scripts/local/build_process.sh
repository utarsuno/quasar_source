#!/usr/bin/env bash

# Location of this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
# Load utility functions.
source ${DIR}/../../scripts/utilities/script_utilities.sh
# Go to project base directory.
cd ${DIR}/../..;

print_dashed_line_with_text "Quasar Build Process Start"

# ARG_OPERATION_ENSURE_NETWORK = 'n'
# ARG_OPERATION_ENSURE_VOLUME  = 'v'
python3 ./scripts/functionalities/_operations_docker.py 'n' 'v'


#docker-compose -f docker-compose.dev.build.yml stop;
#docker-compose -f docker-compose.dev.build.yml build;
#docker-compose -f docker-compose.dev.build.yml up --remove-orphans;

docker-compose -f docker-compose.dev.build.yml up;

ret=$(docker wait quasar_source_code_manager_1)

# TODO: Instead of using exit codes, the DB should fetch the build process State and proceed from there


if [ ${ret} -eq 200 ]; then
    # Go to project base directory.
    cd ${DIR}/../..;
    docker-compose run --rm -v /Users/utarsuno/git_repos/quasar_source:/quasar nexus_courier /quasar/scripts/docker/build_nexus_courier.sh
fi

docker-compose -f docker-compose.dev.build.yml down;

print_dashed_line_with_text "Quasar Build Process Finished"

