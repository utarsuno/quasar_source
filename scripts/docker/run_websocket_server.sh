#!/usr/bin/env bash

#echo "RUNNING RABBITMQ SERVER";
#rabbitmq-server -detached;
#echo "SERVER IS RUNNING";

#python3 /quasar/applications/nexus_server/receive.py;




python3 /quasar/scripts/docker/wait_for_rabbit_host.py;


/quasar/generated_output/websocket_server/websocket_server;

