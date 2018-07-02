#!/usr/bin/env bash

sudo docker run -p 127.0.0.1:1337:1337 -v /Users/utarsuno/git_repos/quasar_source:/quasar/source -i -t --rm quasarsource_nexus_local
