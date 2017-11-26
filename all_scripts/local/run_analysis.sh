#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
source "$DIR/../universal_scripts/universal_functions.sh"

# Variables needed for updating the Quasar server.
CONFIG_PATH="$DIR/../../configuration_files/config.ini"
CONFIG_READER="$DIR/../universal_scripts/config_reader_for_bash.py"

pem_path=$(python3 ${CONFIG_READER} ${CONFIG_PATH} aws pem_path)
ec2_url=$(python3 ${CONFIG_READER} ${CONFIG_PATH} aws ec2_url)

peon_ip=$(python3 ${CONFIG_READER} ${CONFIG_PATH} peon ip)
peon_port=$(python3 ${CONFIG_READER} ${CONFIG_PATH} peon port)
peon_pem_path=$(python3 ${CONFIG_READER} ${CONFIG_PATH} peon pem_path)
peon_user=$(python3 ${CONFIG_READER} ${CONFIG_PATH} peon user)

nexus_ip=$(python3 ${CONFIG_READER} ${CONFIG_PATH} nexus ip)
nexus_port=$(python3 ${CONFIG_READER} ${CONFIG_PATH} nexus port)
nexus_pem_path=$(python3 ${CONFIG_READER} ${CONFIG_PATH} nexus pem_path)
nexus_user=$(python3 ${CONFIG_READER} ${CONFIG_PATH} nexus user)

# Scripts to make sure are executable.
path_to_push_local_code="$DIR/../local/push_local_code.sh"
path_to_run_all_unit_tests="$DIR/../local/run_all_unit_tests.sh"
path_to_ssh_to_quasar="$DIR/../local/ssh_to_quasar.sh"
path_to_ssh_to_nexus="$DIR/../local/ssh_to_nexus.sh"
path_to_ssh_to_peon="$DIR/../local/ssh_to_peon.sh"
path_to_setup_ubuntu="$DIR/../server/setup_ubuntu.sh"
path_to_universal_functions="$DIR/../universal_scripts/universal_functions.sh"
path_to_quasar_builder="$DIR/../../code_api/quasar/quasar_code.py"

# Python scripts.
#path_to_quasar_builder="$DIR/../../code_api/quasar/quasar_builder.py"

# Helps see exactly where the script's output starts.
print_dashed_line_with_text "run_analysis.sh.sh start"

export PYTHONPATH=${PYTHONPATH}:/Users/utarsuno/git_repos/quasar_source/

python3 ${path_to_quasar_builder} "-ra"


# Helps to see exactly where the script's output ends.
print_dashed_line_with_text "run_analysis.sh.sh end"
