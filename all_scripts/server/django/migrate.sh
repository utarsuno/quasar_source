#!/bin/bash

cd /home/git_repos/quasar_source/all_scripts/universal_scripts;
source universal_functions.sh;

# Helps see exactly where the script's output starts.
print_dashed_line_with_text "run django script start for : ${HOST_NAME}"

#  __        ___  ___ ___         __        ___  __        __      ___    __   __  ___
# /__`  /\  |__  |__   |  \ /    /  ` |__| |__  /  ` |__/ /__`    |__  | |__) /__`  |
# .__/ /~~\ |    |___  |   |     \__, |  | |___ \__, |  \ .__/    |    | |  \ .__/  |

terminate_if_not_sudo
terminate_if_system_is_not_ubuntu

#  __   __   __     __  ___          __   __     __      __   ___       __
# /__` /  ` |__) | |__)  |     |    /  \ / _` | /  `    |__) |__  |    /  \ |  |
# .__/ \__, |  \ | |     |     |___ \__/ \__> | \__,    |__) |___ |___ \__/ |/\|

path_to_script=/home/git_repos/quasar_source/all_scripts/universal_scripts/is_program_running.py
is_django_running=$(python3 ${path_to_script} 'runserver')

manage_path=/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/manage.py
export PYTHONPATH=/home/git_repos/quasar_source/
sudo python3 ${manage_path} runserver 0:80


# Helps to see exactly where the script's output ends.
print_dashed_line_with_text "run django script end for : ${HOST_NAME}"
