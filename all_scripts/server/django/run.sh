#!/bin/bash

cd /home/git_repos/quasar_source/all_scripts/universal_scripts;
source universal_functions.sh;

# Helps see exactly where the script's output starts.
print_dashed_line_with_text "start_django start for ${HOST_NAME}"

#  __        ___  ___ ___         __        ___  __        __      ___    __   __  ___
# /__`  /\  |__  |__   |  \ /    /  ` |__| |__  /  ` |__/ /__`    |__  | |__) /__`  |
# .__/ /~~\ |    |___  |   |     \__, |  | |___ \__, |  \ .__/    |    | |  \ .__/  |

terminate_if_not_sudo
terminate_if_system_is_not_ubuntu

#  __   __   __     __  ___          __   __     __      __   ___       __
# /__` /  ` |__) | |__)  |     |    /  \ / _` | /  `    |__) |__  |    /  \ |  |
# .__/ \__, |  \ | |     |     |___ \__/ \__> | \__,    |__) |___ |___ \__/ |/\|

sudo nohup python3 /home/git_repos/quasar_source/quasar_source_code/quasar_site/manage.py runserver 0:80 > /dev/null 2>&1&
disown

# Helps to see exactly where the script's output ends.
print_dashed_line_with_text "end_django end for ${HOST_NAME}"
