#!/usr/bin/env bash

docker network create -d bridge --subnet 192.168.0.0/24 --gateway 192.168.0.1 nexus_network
