#!/bin/bash

#  __   ___ ___       __                __              __   __   __  ___  __  
# /__` |__   |  |  | |__)     /\  |\ | |  \    |  |\/| |__) /  \ |__)  |  /__` 
# .__/ |___  |  \__/ |       /~~\ | \| |__/    |  |  | |    \__/ |  \  |  .__/ 
# ----------------------------------------------------------------------------
# Required variables.
CONFIG_READER="/Users/utarsuno/git_repos/quasar_source/all_scripts/universal/config_reader_for_bash.py"
CONFIG_PATH="/Users/utarsuno/git_repos/quasar_source/configuration_files/config.ini"
databoi_ip=$(python3 ${CONFIG_READER} ${CONFIG_PATH} databoi ip)
databoi_user=$(python3 ${CONFIG_READER} ${CONFIG_PATH} databoi user)

#  __   __   __      __  ___          __   __      __  
# /__` /  ` |__) |  |__)  |     |    /  \ / _` |  /  ` 
# .__/ \__, |  \ |  |     |     |___ \__/ \__> |  \__, 
# ----------------------------------------------------------------------------

ssh -t "${databoi_user}@${databoi_ip}" "cd /home/git_repos/quasar_source/finance/ ; bash"

