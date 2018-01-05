#!/usr/bin/env bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
CONFIG_PATH="$DIR/../../configuration_files/config.ini"
CONFIG_READER="$DIR/../universal/config_reader_for_bash.py"

peon_ip=$(python3 ${CONFIG_READER} ${CONFIG_PATH} peon ip)
peon_port=$(python3 ${CONFIG_READER} ${CONFIG_PATH} peon port)
peon_pem_path=$(python3 ${CONFIG_READER} ${CONFIG_PATH} peon pem_path)
peon_user=$(python3 ${CONFIG_READER} ${CONFIG_PATH} peon user)

ssh -i ${peon_pem_path} "${peon_user}@${peon_ip}" -p ${peon_port}