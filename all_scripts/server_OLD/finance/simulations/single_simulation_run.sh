#!/bin/bash

# Required variables.
ESC_SEQ="\x1b["
FG_YELLOW="${ESC_SEQ}33;"
FG_GREEN="${ESC_SEQ}32;"
FS_REG="21;24m"
RESET_ALL="${ESC_SEQ}0m"
FS_BOLD="1m"
FG_MAGENTA="${ESC_SEQ}35;"
DOTTED_LINE="................................................................................."
FG_CYAN="${ESC_SEQ}36;"
FG_RED="${ESC_SEQ}31;"
FS_UL="4m"

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

function print_dotted_line {
    printf "${FG_MAGENTA}${FS_REG}${DOTTED_LINE}${RESET_ALL}"
    printf "\n"
}

function print_script_text {
    if [ -z "$1" ]; then
       terminate_script "The function 'print_script_text' requires a parameter."
    fi
    printf "${FG_CYAN}${FS_REG}${1}${RESET_ALL}"
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




#  __   __   __      __  ___          __   __             ___      ___  __
# /__` /  ` |__) |  |__)  |      /\  |__) / _` |  | |\/| |__  |\ |  |  /__`
# .__/ \__, |  \ |  |     |     /~~\ |  \ \__> \__/ |  | |___ | \|  |  .__/
# ----------------------------------------------------------------------------
if [ "$#" -ne 6 ]; then
	terminate script "The script{dev_code_push.sh} requires exactly{1} arguments. They are ['the commit message']."
fi


/home/databoi/c_code/m0_net_resistance_testing $1 $2 $3 $4 $5 $6