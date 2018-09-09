#!/usr/bin/env bash

cd ../../;
source ./scripts/utilities/script_utilities.sh

print_dashed_line_with_text "Quasar Build Process Start"

docker-compose -f docker-compose.build.yml stop;
#docker-compose -f docker-compose.build.yml build;
#docker-compose -f docker-compose.build.yml up --remove-orphans;

docker-compose -f docker-compose.build.yml up;

ret=$(docker wait quasar_source_code_manager_1)

if [ ${ret} -eq 200 ]; then
    cd /Users/utarsuno/git_repos/quasar_source;
    docker-compose run --rm -v /Users/utarsuno/git_repos/quasar_source:/quasar websocket /quasar/scripts/docker/build_websocket_server.sh
fi

print_dashed_line_with_text "Quasar Build Process Finished"
