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

is_django_running=$(python3 /home/git_repos/quasar_source/all_scripts/universal/is_program_running.py 'runserver')
if [ "${is_django_running}" == "true" ]; then
  echo 'Django is already running!'
else
  export PYTHONPATH=/home/git_repos/quasar_source/
  python3 /home/git_repos/quasar_source/quasar_source_code/quasar_site_django/manage.py migrate
  python3 /home/git_repos/quasar_source/quasar_source_code/quasar_site_django/manage.py runserver 0:80
fi

