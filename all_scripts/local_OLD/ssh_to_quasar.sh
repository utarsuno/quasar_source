#!/bin/bash

#  __   ___       ___  __       ___     __                __  ___  ___  __  
# / _` |__  |\ | |__  |__)  /\   |  |  /  \ |\ |    |\ | /  \  |  |__  /__` 
# \__> |___ | \| |___ |  \ /~~\  |  |  \__/ | \|    | \| \__/  |  |___ .__/ 
# ----------------------------------------------------------------------------
# LAST_GENERATED : {1.5.2018}

#  __   ___ ___       __                __              __   __   __  ___  __  
# /__` |__   |  |  | |__)     /\  |\ | |  \    |  |\/| |__) /  \ |__)  |  /__` 
# .__/ |___  |  \__/ |       /~~\ | \| |__/    |  |  | |    \__/ |  \  |  .__/ 
# ----------------------------------------------------------------------------
# Required variables.
CONFIG_READER="/Users/utarsuno/git_repos/quasar_source/all_scripts/universal/config_reader_for_bash.py"
CONFIG_PATH="/Users/utarsuno/git_repos/quasar_source/configuration_files/config.ini"
quasar_ip=$(python3 ${CONFIG_READER} ${CONFIG_PATH} quasar ip)
quasar_port=$(python3 ${CONFIG_READER} ${CONFIG_PATH} quasar port)
quasar_pem_path=$(python3 ${CONFIG_READER} ${CONFIG_PATH} quasar pem_path)
quasar_user=$(python3 ${CONFIG_READER} ${CONFIG_PATH} quasar user)

#  __   __   __      __  ___          __   __      __  
# /__` /  ` |__) |  |__)  |     |    /  \ / _` |  /  ` 
# .__/ \__, |  \ |  |     |     |___ \__/ \__> |  \__, 
# ----------------------------------------------------------------------------

ssh -t -i ${quasar_pem_path} "${quasar_user}@${quasar_ip}" -p ${quasar_port} "cd /home/git_repos/quasar_source/all_scripts/server/ ; bash"

