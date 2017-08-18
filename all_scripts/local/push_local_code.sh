#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
source "$DIR/../universal_scripts/universal_functions.sh"

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

    # TODO : The following comment.
    # Make the following bash_scripts runnable.

fi

# Helps to see exactly where the script's output ends.
print_dashed_line_with_text "push_local_code.sh end"
