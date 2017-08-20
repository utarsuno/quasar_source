#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
source "$DIR/../universal_scripts/universal_functions.sh"

# Variables needed for updating the Quasar server.
CONFIG_PATH="$DIR/../../configuration_files/config.ini"
CONFIG_READER="$DIR/../universal_scripts/config_reader_for_bash.py"

pem_path=$(python3 ${CONFIG_READER} ${CONFIG_PATH} aws pem_path)
ec2_url=$(python3 ${CONFIG_READER} ${CONFIG_PATH} aws ec2_url)

# Scripts to make sure are executable.
path_to_build_three_js="$DIR/../build_three_js/build_three_js.sh"
path_to_push_local_code="$DIR/../local/push_local_code.sh"
path_to_run_all_unit_tests="$DIR/../local/run_all_unit_tests.sh"
path_to_ssh_to_quasar="$DIR/../local/ssh_to_quasar.sh"
path_to_ssh_to_nexus="$DIR/../local/ssh_to_nexus.sh"
path_to_ssh_to_peon="$DIR/../local/ssh_to_peon.sh"
path_to_setup_ubuntu="$DIR/../server/setup_ubuntu.sh"
path_to_universal_functions="$DIR/../universal_scripts/universal_functions.sh"


# Helps see exactly where the script's output starts.
print_dashed_line_with_text "push_local_code.sh start"

#  __        ___  ___ ___         __        ___  __        __      ___    __   __  ___
# /__`  /\  |__  |__   |  \ /    /  ` |__| |__  /  ` |__/ /__`    |__  | |__) /__`  |
# .__/ /~~\ |    |___  |   |     \__, |  | |___ \__, |  \ .__/    |    | |  \ .__/  |

terminate_if_script_is_being_ran_as_root
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
    # There are uncommitted changes.
    print_script_text "Pushing the code changes."

    print_dotted_line
    # This will add all files, new files, changes, and removed files.
    git add -A;
    git commit -m "$1";
    git push --force;
    print_dotted_line

    # Make sure the following bash scripts are runnable.
    chmod +x ${path_to_build_three_js}
    chmod +x ${path_to_push_local_code}
    chmod +x ${path_to_run_all_unit_tests}
    chmod +x ${path_to_ssh_to_quasar}
    chmod +x ${path_to_ssh_to_nexus}
    chmod +x ${path_to_ssh_to_peon}
    chmod +x ${path_to_setup_ubuntu}
    chmod +x ${path_to_universal_functions}


    #ssh -i ${pem_path} -t ${ec2_url} "sh /home/git_repos/quasar_source/all_scripts/server/update_server_code.sh"

fi

# Helps to see exactly where the script's output ends.
print_dashed_line_with_text "push_local_code.sh end"
