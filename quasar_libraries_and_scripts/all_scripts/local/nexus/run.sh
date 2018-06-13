#!/usr/bin/env bash

docker run -p 127.0.0.1:1337:1337 -v /Users/utarsuno/git_repos/quasar_source:/quasar/source_code -t quasarsource_nexus_local
