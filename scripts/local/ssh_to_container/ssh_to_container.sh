#!/usr/bin/env bash

source ../../../quasar_libraries_and_scripts/scripts/script_utilities.sh

python container_ssh.py;
EXIT_CODE=$?;

if [ ${EXIT_CODE} -eq 0 ]; then
    print_green_text "There are no running containers!";
else
    if [ ${EXIT_CODE} -eq 100 ]; then
        print_green_text "Connecting to nexus local!";
        CONTAINER_ID=$(docker ps -a --no-trunc | grep "quasarsource_nexus_local" | awk '{print $1}');
        sudo docker exec -it ${CONTAINER_ID} /bin/bash
    fi
fi

