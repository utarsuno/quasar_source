#!/usr/bin/env bash

# TEMPORARY. GENERATE THIS SCRIPT LATER!
# TEMPORARY. GENERATE THIS SCRIPT LATER!
# TEMPORARY. GENERATE THIS SCRIPT LATER!

cd /Users/utarsuno/git_repos/quasar_source;
#docker run -p 127.0.0.1:1337:1337 -v /Users/utarsuno/git_repos/quasar_source:/quasar/new_temporary -i -t quasarsource_nexus_local
#pwd;
#docker run -p 127.0.0.1:1337:1337 -v /Users/utarsuno/git_repos/quasar_source:/quasar/new_temporary -i -t quasarsource_nexus_local /quasar/


#docker exec 7e6bf90d44e8 /quasar/source_code/quasar_micro_applications/quasar_nexus/nexus_local/run.sh

NEXUS_LOCAL_CONTAINER_ID="$(docker ps | grep "quasarsource_nexus_local" | awk '{ print $1 }')"


if [ -z "$NEXUS_LOCAL_CONTAINER_ID" ] ; then
      echo "NEXUS LOCAL IS NOT RUNNING"
else
      echo "NEXUS LOCAL IS RUNNING"
      #echo "\$var is NOT empty"
fi


echo "DONE"
exit;


if [ ! "$(docker ps -q -f name=quasarsource_nexus_local)" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=quasarsource_nexus_local)" ]; then
        # cleanup
        echo "CLEANING UP"
        docker rm quasarsource_nexus_local
    fi
    # run your container
    echo "RUNNING CONTAINER"

    #CONTAINER_ID="$(docker run -p 127.0.0.1:1337:1337 -v /Users/utarsuno/git_repos/quasar_source:/quasar/source_code -d -t quasarsource_nexus_local)"



    #docker run -d --name <name> my-docker-image
fi
