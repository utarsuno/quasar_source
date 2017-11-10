#!/usr/bin/env bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
CONFIG_PATH="$DIR/../../configuration_files/config.ini"
CONFIG_READER="$DIR/../universal_scripts/config_reader_for_bash.py"

pem_path=$(python3 ${CONFIG_READER} ${CONFIG_PATH} aws pem_path)
ec2_url=$(python3 ${CONFIG_READER} ${CONFIG_PATH} aws ec2_url)

#ssh -i ${pem_path} ${ec2_url}



ssh -i ${pem_path} ${ec2_url} << HERE
cd /home/git_repos/quasar_source/all_scripts/server/django/;
HERE