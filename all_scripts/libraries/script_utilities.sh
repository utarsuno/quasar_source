#!/bin/bash

#            __          __        ___  __
# \  /  /\  |__) |  /\  |__) |    |__  /__`
#  \/  /~~\ |  \ | /~~\ |__) |___ |___ .__/

# Escape sequence and resets
ESC_SEQ="\x1b["
RESET_ALL="${ESC_SEQ}0m"
RESET_BOLD="${ESC_SEQ}21m"
RESET_UL="${ESC_SEQ}24m"

# Foreground colours
FG_BLACK="${ESC_SEQ}30;"
FG_RED="${ESC_SEQ}31;"
FG_GREEN="${ESC_SEQ}32;"
FG_YELLOW="${ESC_SEQ}33;"
FG_BLUE="${ESC_SEQ}34;"
FG_MAGENTA="${ESC_SEQ}35;"
FG_CYAN="${ESC_SEQ}36;"
FG_WHITE="${ESC_SEQ}37;"
FG_BR_BLACK="${ESC_SEQ}90;"
FG_BR_RED="${ESC_SEQ}91;"
FG_BR_GREEN="${ESC_SEQ}92;"
FG_BR_YELLOW="${ESC_SEQ}93;"
FG_BR_BLUE="${ESC_SEQ}94;"
FG_BR_MAGENTA="${ESC_SEQ}95;"
FG_BR_CYAN="${ESC_SEQ}96;"
FG_BR_WHITE="${ESC_SEQ}97;"

# Background colours (optional)
BG_BLACK="40;"
BG_RED="41;"
BG_GREEN="42;"
BG_YELLOW="43;"
BG_BLUE="44;"
BG_MAGENTA="45;"
BG_CYAN="46;"
BG_WHITE="47;"

# Font styles
#FS_REG="0m"
FS_REG="21;24m"
FS_BOLD="1m"
FS_UL="4m"

DOTTED_LINE="................................................................................."
DASHED_LINE="---------------------------------------------------------------------------------"

#  ___            __  ___    __        __
# |__  |  | |\ | /  `  |  | /  \ |\ | /__`
# |    \__/ | \| \__,  |  | \__/ | \| .__/

function print_green_text {
    if [ -z "$1" ]; then
       terminate_script "The function 'print_green_text' requires a parameter."
    fi
    printf "${FG_GREEN}${FS_REG}${1}${RESET_ALL}"
}

function print_dotted_line {
    printf "${FG_MAGENTA}${FS_REG}${DOTTED_LINE}${RESET_ALL}"
}

function print_red_dotted_line {
    printf "${FG_RED}${FS_REG}${DOTTED_LINE}${RESET_ALL}"
}

function print_dash_line {
    printf "${FG_YELLOW}${FS_REG}${DASHED_LINE}${RESET_ALL}"
}

function print_script_text {
    if [ -z "$1" ]; then
       terminate_script "The function 'print_script_text' requires a parameter."
    fi
    printf "${FG_CYAN}${FS_REG}${1}${RESET_ALL}"
}

function terminate_script {
    print_red_dotted_line
    if [ -z "$1" ]; then
        printf "${FG_RED}${FS_BOLD}The function 'terminate_script' requires an argument. The program will now terminate.${RESET_ALL}"
    else
        printf "${FG_RED}${FS_UL}${1}${RESET_ALL}"
        printf ""
        printf "${FG_RED}${FS_BOLD}Due to warnings or errors that have occurred the program will now terminate.${RESET_ALL}"
    fi
    print_red_dotted_line
    exit
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

function print_line_in_between_dashed_lines {
    if [ -z "$1" ]; then
        printf "The function 'print_line_in_between_dashed_lines' has to have an argument passed into it. The program will now terminate as most likely a programmer error has occurred lol."
    fi
    print_dash_line
    printf $1
    print_dash_line
}

#  __        ___  ___ ___         __        ___  __        __
# /__`  /\  |__  |__   |  \ /    /  ` |__| |__  /  ` |__/ /__`    .
# .__/ /~~\ |    |___  |   |     \__, |  | |___ \__, |  \ .__/    .

function terminate_if_sudo {
    if [[ $EUID -eq 0 ]]; then
        terminate_script "This script should not be ran as sudo!"
    fi
}
function terminate_if_not_sudo {
    if [ `id -u` != 0 ] ; then
        terminate_script "This script requires root privileges to run."
    fi
}

function terminate_if_system_is_ubuntu {
    if [ "$OSTYPE" = "linux" ] || [ "$OSTYPE" = "linux-gnu" ]; then
        terminate_script "This script should not be run on an ubuntu system."
    fi
}

function terminate_if_system_is_not_ubuntu {
    if [ "$OSTYPE" != "linux" ] && [ "$OSTYPE" != "linux-gnu" ]; then
        terminate_script "This script should be run on an ubuntu system."
    fi
}

