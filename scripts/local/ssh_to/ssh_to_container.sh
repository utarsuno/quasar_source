#!/usr/bin/env bash

source ../../utilities/script_utilities.sh

python container_ssh.py;
EXIT_CODE=$?;

if [ ${EXIT_CODE} -eq 0 ]; then
    print_green_text "There are no running containers!";
else
    if [ ${EXIT_CODE} -eq 100 ]; then
        print_green_text "Connecting to nexus local!";
        CONTAINER_ID=$(docker ps --no-trunc | grep "quasar_source_nexus_local" | awk '{print $1}');
        sudo docker exec -it ${CONTAINER_ID} /bin/bash
    elif [ ${EXIT_CODE} -eq 101 ]; then
        print_green_text "Connecting to redis local!";
        CONTAINER_ID=$(docker ps --no-trunc | grep "quasar_source_redis" | awk '{print $1}');
        sudo docker exec -it ${CONTAINER_ID} /bin/bash
    elif [ ${EXIT_CODE} -eq 102 ]; then
        print_green_text "Connecting to nginx local!";
        CONTAINER_ID=$(docker ps --no-trunc | grep "quasar_source_nginx" | awk '{print $1}');
        sudo docker exec -it ${CONTAINER_ID} /bin/bash
    elif [ ${EXIT_CODE} -eq 103 ]; then
        print_green_text "Connecting to websocket local!";
        CONTAINER_ID=$(docker ps --no-trunc | grep "quasar_source_websocket" | awk '{print $1}');
        sudo docker exec -it ${CONTAINER_ID} /bin/bash
        elif [ ${EXIT_CODE} -eq 104 ]; then
        print_green_text "Connecting to code_builder local!";
        CONTAINER_ID=$(docker ps --no-trunc | grep "quasar_source_code_builder" | awk '{print $1}');
        sudo docker exec -it ${CONTAINER_ID} /bin/bash
    fi
fi

