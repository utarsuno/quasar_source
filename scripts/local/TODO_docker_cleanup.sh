#!/usr/bin/env bash

cd ../../;

#docker-compose down;
#docker-compose build;
#docker-compose up;

# Useful commands from: https://zaiste.net/removing_docker_containers/


# Remove stopped containers.
echo "TODO: Pretty print this: removing stopped containers"

docker ps -aq --no-trunc -f status=exited | xargs docker rm

# TODO: remove un-used images
# docker image prune <y>

