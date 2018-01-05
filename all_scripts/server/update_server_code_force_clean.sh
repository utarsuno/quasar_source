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
ESC_SEQ="\x1b["
FG_YELLOW="${ESC_SEQ}33;"
FG_GREEN="${ESC_SEQ}32;"
FS_REG="21;24m"
RESET_ALL="${ESC_SEQ}0m"
FS_BOLD="1m"
FG_RED="${ESC_SEQ}31;"
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
        printf "${FG_GREEN}${FS_REG}-${RESET_ALL}"
    fi
    for i in `seq 2 ${first}`
    do
      printf "${FG_GREEN}${FS_REG}-${RESET_ALL}"
    done
    printf "${FG_YELLOW}${FS_BOLD}${1}${RESET_ALL}"
    for i in `seq 2 ${first}`
    do
      printf "${FG_GREEN}${FS_REG}-${RESET_ALL}"
    done
    printf "\n"
}

function terminate_if_system_is_not_ubuntu {
    if [ "$OSTYPE" != "linux" ] && [ "$OSTYPE" != "linux-gnu" ]; then
        terminate_script "This script should be run on an ubuntu system."
    fi
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
system_is_not_ubuntu

#  __   __   __      __  ___          __   __      __  
# /__` /  ` |__) |  |__)  |     |    /  \ / _` |  /  ` 
# .__/ \__, |  \ |  |     |     |___ \__/ \__> |  \__, 
# ----------------------------------------------------------------------------
print_dashed_line_with_text "update_server_code_force_clean.sh script start for : ${HOST_NAME}."

# Go to the projects base directory.
cd /home/git_repos/quasar_source;
git fetch --all;
reslog=$(git log HEAD..origin/master --oneline)
if [[ "${reslog}" != "" ]] ; then
    print_script_text "Updating the code base."
    # This resets to master.
    git reset --hard origin/master;
    # Remove files that are not tracked. The -d flag is needed for removing directories as well.
    git clean -fd;
else
    # We do not have to update the code.
    print_script_text "The code base is already up to date so a pull will not be performed."
fi

print_dashed_line_with_text "update_server_code_force_clean.sh script end for : ${HOST_NAME}."
