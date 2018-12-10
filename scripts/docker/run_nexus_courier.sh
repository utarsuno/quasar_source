#!/usr/bin/env bash

#echo "RUNNING RABBITMQ SERVER";
#rabbitmq-server -detached;
#echo "SERVER IS RUNNING";

#python3 /quasar_source/applications/nexus_server/receive.py;




python3 /quasar_source/scripts/docker/wait_for_rabbit_host.py;


/quasar_source/generated_output/nexus_courier/nexus_courier;



