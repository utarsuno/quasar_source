#!/usr/bin/env bash

str_contains () {
    echo $1
    echo $2
    if [[ "$1" == *"$2"* ]]; then
        echo 1
    else
        echo 0
    fi
}

# Source: https://unix.stackexchange.com/questions/422165/escape-double-quotes-in-variable
# Author: Michael Homer
# Date  : 'answered Feb 6 '18 at 2:29'
esc () {
    printf "%s\n" "$1" | sed -e "s/'/'\"'\"'/g" -e "1s/^/'/" -e "\$s/\$/'/"
}
