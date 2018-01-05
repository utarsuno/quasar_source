#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
source "$DIR/../universal/universal_functions.sh"

print_dashed_line_with_text "feature_test.sh start"

#  __        ___  ___ ___         __        ___  __        __      ___    __   __  ___
# /__`  /\  |__  |__   |  \ /    /  ` |__| |__  /  ` |__/ /__`    |__  | |__) /__`  |
# .__/ /~~\ |    |___  |   |     \__, |  | |___ \__, |  \ .__/    |    | |  \ .__/  |

terminate_if_sudo
terminate_if_system_is_ubuntu

# Exactly one argument was not passed.
if [ "$#" -ne 1 ]; then
    terminate_script "Only exactly one argument should be passed in, the flag."
fi

# Helps to see exactly where the script's output ends.
print_dashed_line_with_text "feature_test.sh end"
