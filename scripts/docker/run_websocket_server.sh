#!/usr/bin/env bash

echo "RUNNING RABBITMQ SERVER";
#rabbitmq-server -detached;
echo "SERVER IS RUNNING";

python3 /quasar/applications/nexus_server/receive.py;

