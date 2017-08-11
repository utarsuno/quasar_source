#!/usr/bin/env bash

docker build -t python_tests:test_tag /Users/utarsuno/git_repos/quasar_source/python_source_code
docker run python_tests:test_tag