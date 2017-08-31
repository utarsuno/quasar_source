#!/bin/bash

cd /home/git_repos/quasar_source/all_scripts/universal_scripts;
source universal_functions.sh;

# Helps see exactly where the script's output starts.
print_dashed_line_with_text "update_server_code.sh start"

#  __        ___  ___ ___         __        ___  __        __      ___    __   __  ___
# /__`  /\  |__  |__   |  \ /    /  ` |__| |__  /  ` |__/ /__`    |__  | |__) /__`  |
# .__/ /~~\ |    |___  |   |     \__, |  | |___ \__, |  \ .__/    |    | |  \ .__/  |

terminate_if_system_is_not_ubuntu

#  __   __   __     __  ___          __   __     __      __   ___       __
# /__` /  ` |__) | |__)  |     |    /  \ / _` | /  `    |__) |__  |    /  \ |  |
# .__/ \__, |  \ | |     |     |___ \__/ \__> | \__,    |__) |___ |___ \__/ |/\|

# Go to the projects base directory.
cd /home/git_repos/quasar_source;

git fetch --all;
reslog=$(git log HEAD..origin/master --oneline)
if [[ "${reslog}" != "" ]] ; then
    print_script_text "Updating the code base."

    # This resets to master.
    git reset --hard origin/master;

    # Remove files that are not tracked. The -d flag is needed for removing directories as well.
    git clean -fd;
else
    # We do not have to update the code.
    print_script_text "The code base is already up to date so a pull will not be performed."
fi

# Helps to see exactly where the script's output ends.
print_dashed_line_with_text "update_server_code.sh end for ${HOST_NAME}"
