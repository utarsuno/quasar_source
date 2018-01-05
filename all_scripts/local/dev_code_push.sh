#!/bin/bash

#  __   ___       ___  __       ___     __                __  ___  ___  __  
# / _` |__  |\ | |__  |__)  /\   |  |  /  \ |\ |    |\ | /  \  |  |__  /__` 
# \__> |___ | \| |___ |  \ /~~\  |  |  \__/ | \|    | \| \__/  |  |___ .__/ 
# ----------------------------------------------------------------------------
# LAST_GENERATED : {1.4.2018}

#  __   ___ ___       __                __              __   __   __  ___  __  
# /__` |__   |  |  | |__)     /\  |\ | |  \    |  |\/| |__) /  \ |__)  |  /__` 
# .__/ |___  |  \__/ |       /~~\ | \| |__/    |  |  | |    \__/ |  \  |  .__/ 
# ----------------------------------------------------------------------------
# Required variables.
CONFIG_READER="/Users/utarsuno/git_repos/quasar_source/all_scripts/universal/config_reader_for_bash.py"
CONFIG_PATH="/Users/utarsuno/git_repos/quasar_source/configuration_files/config.ini"
nexus_ip=$(python3 ${CONFIG_READER} ${CONFIG_PATH} nexus ip)
nexus_port=$(python3 ${CONFIG_READER} ${CONFIG_PATH} nexus port)
nexus_pem_path=$(python3 ${CONFIG_READER} ${CONFIG_PATH} nexus pem_path)
nexus_user=$(python3 ${CONFIG_READER} ${CONFIG_PATH} nexus user)
ESC_SEQ="\x1b["
FG_RED="${ESC_SEQ}31;"
FS_BOLD="1m"
RESET_ALL="${ESC_SEQ}0m"
FS_UL="4m"

# Required functions.
function print_dashed_line_with_text {
    if [ -z "$1" ]; then
       terminate_script "The function 'print_dashed_line_with_text' requires a parameter."
    fi
    length=${#1}
    declare -i max=100
    declare -i first=(max-length)/2
    if [ $((length%2)) -ne 0 ]; then
        printf "${FG_GREEN}${FS_REG}${RESET_ALL}"
    fi
    for i in `seq 2 ${first}`
    do
      printf "${FG_GREEN}${FS_REG}${RESET_ALL}"
    done
    printf "${FG_YELLOW}${FS_BOLD}${1}${RESET_ALL}"
    for i in `seq 2 ${first}`
    do
      printf "${FG_GREEN}${FS_REG}${RESET_ALL}"
    done
    printf "\n"
}

function terminate_script {
    print_red_dotted_line
    if [ -z "$1" ]; then
        printf "${FG_RED}${FS_BOLD}The function 'terminate_script' requires an argument. The program will now terminate.${RESET_ALL}"
        print_red_dotted_line
    else
        printf "${FG_RED}${FS_UL}${1}${RESET_ALL}"
        printf ""
        printf "${FG_RED}${FS_BOLD}Due to warnings or errors that have occurred the program will now terminate.${RESET_ALL}"
        print_red_dotted_line
    fi
    exit
}

#  __        ___  ___ ___         __        ___  __        __  
# /__`  /\  |__  |__   |  \ /    /  ` |__| |__  /  ` |__/ /__` 
# .__/ /~~\ |    |___  |   |     \__, |  | |___ \__, |  \ .__/ 
# ----------------------------------------------------------------------------
terminate_if_sudo
terminate_if_system_is_ubuntu

#  __   __   __   __   __                     __   __             ___      ___  __  
# |__) |__) /  \ / _` |__)  /\  |\/|     /\  |__) / _` |  | |\/| |__  |\ |  |  /__` 
# |    |  \ \__/ \__> |  \ /~~\ |  |    /~~\ |  \ \__> \__/ |  | |___ | \|  |  .__/ 
# ----------------------------------------------------------------------------
if [ "$#" -ne 1 ]; then
	terminate script "The script{dev_code_push.sh} requires exactly{1} arguments. They are ['the commit message']."
fi

#  __   __   __      __  ___          __   __      __  
# /__` /  ` |__) |  |__)  |     |    /  \ / _` |  /  ` 
# .__/ \__, |  \ |  |     |     |___ \__/ \__> |  \__, 
# ----------------------------------------------------------------------------
print_dashed_line_with_text "dev_code_push.sh script start."

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

    ssh -i ${nexus_pem_path} "${nexus_user}@${nexus_ip}" -p ${nexus_port} << HERE
    bash /home/git_repos/quasar_source/all_scripts/server/update_server_code.sh;
HERE

fi

print_dashed_line_with_text "dev_code_push.sh script end."