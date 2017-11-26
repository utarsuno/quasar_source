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

# Python scripts.
#path_to_quasar_builder="$DIR/../../code_api/quasar/quasar_builder.py"

# Helps see exactly where the script's output starts.
print_dashed_line_with_text "push_to_production.sh start"

#  __        ___  ___ ___         __        ___  __        __      ___    __   __  ___
# /__`  /\  |__  |__   |  \ /    /  ` |__| |__  /  ` |__/ /__`    |__  | |__) /__`  |
# .__/ /~~\ |    |___  |   |     \__, |  | |___ \__, |  \ .__/    |    | |  \ .__/  |

terminate_if_sudo
terminate_if_system_is_ubuntu

# Exactly one argument was not passed.
if [ "$#" -ne 1 ]; then
    terminate_script "Only exactly one argument should be passed in, the commit message."
fi

#  __   __   __     __  ___          __   __     __      __   ___       __
# /__` /  ` |__) | |__)  |     |    /  \ / _` | /  `    |__) |__  |    /  \ |  |
# .__/ \__, |  \ | |     |     |___ \__/ \__> | \__,    |__) |___ |___ \__/ |/\|

if output=$(git status --porcelain) && [ -z "$output" ]; then
    # Working directory clean
    print_script_text "The working directory is clean so no commit will be made."
else
    print_script_text "Running minification on the Javascript files."

    #python3 ${path_to_quasar_builder} "-bp"

    # There are uncommitted changes.
    print_script_text "Pushing the code changes."

    print_dotted_line
    # This will add all files, new files, changes, and removed files.
    git add -A;
    git commit -m "$1";
    git push --force;
    print_dotted_line

    # Make sure the following bash scripts are runnable.
    chmod +x ${path_to_push_local_code}
    chmod +x ${path_to_run_all_unit_tests}
    chmod +x ${path_to_ssh_to_quasar}
    chmod +x ${path_to_ssh_to_nexus}
    chmod +x ${path_to_ssh_to_peon}
    chmod +x ${path_to_setup_ubuntu}
    chmod +x ${path_to_universal_functions}

#    ssh -i ${pem_path} ${ec2_url} << HERE
#    bash /home/git_repos/quasar_source/all_scripts/server/update_server_code.sh;
#HERE

    ssh -i ${nexus_pem_path} "${nexus_user}@${nexus_ip}" -p ${nexus_port} << HERE
    bash /home/git_repos/quasar_source/all_scripts/server/update_server_code.sh;
HERE

#    ssh -i ${peon_pem_path} "${peon_user}@${peon_ip}" -p ${peon_port} << HERE
#    bash /home/git_repos/quasar_source/all_scripts/server/update_server_code.sh;
#HERE

fi

# Helps to see exactly where the script's output ends.
print_dashed_line_with_text "push_to_production.sh end"
