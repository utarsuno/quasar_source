#!/usr/bin/env bash

cd ../../;

docker-compose run -v /Users/utarsuno/git_repos/quasar_source:/quasar websocket /quasar/scripts/local/build_process/build_websocket_server.sh


