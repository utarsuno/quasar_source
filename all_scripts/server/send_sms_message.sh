#!/bin/bash

cd /home/git_repos/quasar_source/all_scripts/universal_scripts;
source universal_functions.sh;

# Helps see exactly where the script's output starts.
print_dashed_line_with_text "send_sms_message start for : ${HOST_NAME}"

#  __        ___  ___ ___         __        ___  __        __      ___    __   __  ___
# /__`  /\  |__  |__   |  \ /    /  ` |__| |__  /  ` |__/ /__`    |__  | |__) /__`  |
# .__/ /~~\ |    |___  |   |     \__, |  | |___ \__, |  \ .__/    |    | |  \ .__/  |

terminate_if_script_does_not_have_root_privileges

# Parameters that need to be passed in :
# first_parameter - number of seconds to sleep for
# second_parameter - message to send
# third_parameter - sms_address to send to
# pass in the & symbol (TODO : double check if that is needed)

# Exactly four arguments were not passed.
if [ "$#" -ne 4 ]; then
    terminate_script "Exactly five arguments should be passed in, the number of seconds to sleep for, the message to send, the sms_address to send to, and '&'."
fi

#  __   __   __     __  ___          __   __     __      __   ___       __
# /__` /  ` |__) | |__)  |     |    /  \ / _` | /  `    |__) |__  |    /  \ |  |
# .__/ \__, |  \ | |     |     |___ \__/ \__> | \__,    |__) |___ |___ \__/ |/\|

#path_to_script=/home/git_repos/quasar_source/all_scripts/universal_scripts/is_program_running.py
path_to_sms_sender=/home/git_repos/quasar_source/quasar_source_code/universal_code/sms_sender.py

# Sleep for N number of seconds.
sleep $1;

sudo python ${path_to_sms_sender} "$2" "$3"

# Helps to see exactly where the script's output ends.
print_dashed_line_with_text "send_sms_message end for : ${HOST_NAME}"
