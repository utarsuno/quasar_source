#!/usr/bin/env bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
source "$DIR/../universal_scripts/universal_functions.sh"

#  __        ___  ___ ___         __        ___  __        __      ___    __   __  ___
# /__`  /\  |__  |__   |  \ /    /  ` |__| |__  /  ` |__/ /__`    |__  | |__) /__`  |
# .__/ /~~\ |    |___  |   |     \__, |  | |___ \__, |  \ .__/    |    | |  \ .__/  |

terminate_if_system_is_not_ubuntu

#  __   __   __     __  ___          __   __     __      __   ___       __
# /__` /  ` |__) | |__)  |     |    /  \ / _` | /  `    |__) |__  |    /  \ |  |
# .__/ \__, |  \ | |     |     |___ \__/ \__> | \__,    |__) |___ |___ \__/ |/\|

# Go to the projects base directory.
cd "$DIR/../../";
pwd;
print_script_text 'just_wanted_to_run_a_test'


git fetch origin;
reslog=$(git log HEAD..origin/dev --oneline)
if [[ "${reslog}" != "" ]] ; then
    print_script_text "Updating the code base."

    # This first gets all the changes.
    git fetch --all;

    # This resets to dev.
    git reset --hard origin/dev;

    # Grab the latest code.
    git pull;

    # Make the following bash_scripts runnable.
    sudo chmod +x /home/dev_usr/urbtek/all_scripts/server_system/update_server_code.sh;
    sudo chmod +x /home/dev_usr/urbtek/all_scripts/server_system/django/clear_django_database.sh;
    sudo chmod +x /home/dev_usr/urbtek/all_scripts/server_system/django/restart_django.sh;
    sudo chmod +x /home/dev_usr/urbtek/all_scripts/server_system/django/run_django.sh;
    sudo chmod +x /home/dev_usr/urbtek/all_scripts/server_system/django/terminate_django.sh;
    sudo chmod +x /home/dev_usr/urbtek/all_scripts/server_system/qa/close_locust_after_x_seconds.sh;
    sudo chmod +x /home/dev_usr/urbtek/all_scripts/server_system/qa/run_locust.sh;

    # Remove parts of the code base that a server system shouldn't use.
    sudo rm -rf /home/dev_usr/urbtek/all_scripts/local_system;
    sudo rm -rf /home/dev_usr/compression_algorithm;
    sudo rm -rf /home/dev_usr/project_euler_problems;

    # The P E O N and N E X U S should not have each others stuff (so they can't accidentally run it).
    if [ "$HOSTNAME" = "nexus-quality-assurance-helper" ]; then
        sudo rm -rf /home/dev_usr/urbtek/nexus_django;
    elif [ "$HOSTNAME" = "nexus-quality-assurance" ]; then
        sudo rm -rf /home/dev_usr/urbtek/peon;
    else
        print_script_text "W H A T M A C H I N E I S T H I S ?"
    fi

else
    # We do not have to update the code.
    print_script_text "The code base is already up to date so a pull will not be performed."
fi

# Helps to see exactly where the script's output ends.
print_dashed_line_with_text "update_server_code.sh end"