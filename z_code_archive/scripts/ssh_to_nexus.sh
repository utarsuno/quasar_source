#!/usr/bin/env bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
CONFIG_PATH="$DIR/../../configuration_files/config.ini"
CONFIG_READER="$DIR/../universal_scripts/config_reader_for_bash.py"

nexus_ip=$(python3 ${CONFIG_READER} ${CONFIG_PATH} nexus ip)
nexus_port=$(python3 ${CONFIG_READER} ${CONFIG_PATH} nexus port)
nexus_pem_path=$(python3 ${CONFIG_READER} ${CONFIG_PATH} nexus pem_path)
nexus_user=$(python3 ${CONFIG_READER} ${CONFIG_PATH} nexus user)

ssh -t -i ${nexus_pem_path} "${nexus_user}@${nexus_ip}" -p ${nexus_port} "cd /home/git_repos/quasar_source/all_scripts/server/django/ ; bash"

