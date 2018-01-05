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
FG_RED="${ESC_SEQ}31;"
FS_BOLD="1m"
RESET_ALL="${ESC_SEQ}0m"
FS_UL="4m"

# Required functions.
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

#  __   __   __      __  ___          __   __      __  
# /__` /  ` |__) |  |__)  |     |    /  \ / _` |  /  ` 
# .__/ \__, |  \ |  |     |     |___ \__/ \__> |  \__, 
# ----------------------------------------------------------------------------
print_dashed_line_with_text "feature_test.sh script start."


print_dashed_line_with_text "feature_test.sh script end."
