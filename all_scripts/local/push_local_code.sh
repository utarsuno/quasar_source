#!/bin/bash

#source /Users/utarsuno/git_repos/urbtek/urbtek/all_scripts/universal_scripts/universal_functions.sh

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
source "$DIR/../universal_scripts/universal_functions.sh"

# Helps see exactly where the script's output starts.
print_dashed_line_with_text "push_local_code.sh start"

#  __        ___  ___ ___         __        ___  __        __      ___    __   __  ___
# /__`  /\  |__  |__   |  \ /    /  ` |__| |__  /  ` |__/ /__`    |__  | |__) /__`  |
# .__/ /~~\ |    |___  |   |     \__, |  | |___ \__, |  \ .__/    |    | |  \ .__/  |

# TODO : Add safety check to terminate if this script is being ran as sudo
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
    sudo chmod +x push_local_code.sh;
    sudo chmod +x run_generation_compiler.sh;
    sudo chmod +x ./qa/close_locust_after_x_seconds.sh;
    sudo chmod +x ./qa/run_locust.sh;

fi

# Helps to see exactly where the script's output ends.
print_dashed_line_with_text "push_local_code.sh end"
