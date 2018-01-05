#!/bin/bash

#  __   ___       ___  __       ___     __                __  ___  ___  __  
# / _` |__  |\ | |__  |__)  /\   |  |  /  \ |\ |    |\ | /  \  |  |__  /__` 
# \__> |___ | \| |___ |  \ /~~\  |  |  \__/ | \|    | \| \__/  |  |___ .__/ 
# ----------------------------------------------------------------------------
# LAST_GENERATED : {1.5.2018}

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
FG_MAGENTA="${ESC_SEQ}35;"
DOTTED_LINE="................................................................................."

# Required functions.
function print_red_dotted_line {
    printf "${FG_RED}${FS_REG}${DOTTED_LINE}${RESET_ALL}"
    printf "\n"
}
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

function terminate_if_system_is_not_ubuntu {
    if [ "$OSTYPE" != "linux" ] && [ "$OSTYPE" != "linux-gnu" ]; then
        terminate_script "run_in_background.sh should be run on an ubuntu system."
    fi
}

function terminate_if_not_sudo {
    if [ `id -u` != 0 ] ; then
        terminate_script "This script requires root privileges to run."
    fi
}
#  __        ___  ___ ___         __        ___  __        __  
# /__`  /\  |__  |__   |  \ /    /  ` |__| |__  /  ` |__/ /__` 
# .__/ /~~\ |    |___  |   |     \__, |  | |___ \__, |  \ .__/ 
# ----------------------------------------------------------------------------
terminate_if_system_is_not_ubuntu
terminate_if_not_sudo

#  __   __   __      __  ___          __   __      __  
# /__` /  ` |__) |  |__)  |     |    /  \ / _` |  /  ` 
# .__/ \__, |  \ |  |     |     |___ \__/ \__> |  \__, 
# ----------------------------------------------------------------------------
print_dashed_line_with_text "run_in_background.sh script start for : ${HOST_NAME}."

is_django_running=$(python3 /home/git_repos/quasar_source/all_scripts/universal/is_program_running.py 'runserver')
if [ "${is_django_running}" == "true" ]; then
  echo 'Django is already running!'
else
  export PYTHONPATH=/home/git_repos/quasar_source/
  python3 /home/git_repos/quasar_source/quasar_source_code/quasar_site_django/manage.py migrate
  nohup python3 /home/git_repos/quasar_source/quasar_source_code/quasar_site_django/manage.py runserver 0:80 &
fi

print_dashed_line_with_text "run_in_background.sh script end for : ${HOST_NAME}."
