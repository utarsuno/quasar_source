#!/bin/bash

# ----------------------------------------------------------------------------
#  __   ___       ___  __       ___     __                __  ___  ___  __  
# / _` |__  |\ | |__  |__)  /\   |  |  /  \ |\ |    |\ | /  \  |  |__  /__` 
# \__> |___ | \| |___ |  \ /~~\  |  |  \__/ | \|    | \| \__/  |  |___ .__/ 
# ----------------------------------------------------------------------------
# LAST_GENERATED : {3.22.2018}

# ----------------------------------------------------------------------------
#          __   __        __                  __   __   __  ___  __  
# |    |  |__) |__)  /\  |__) \ /    |  |\/| |__) /  \ |__)  |  /__` 
# |___ |  |__) |  \ /~~\ |  \  |     |  |  | |    \__/ |  \  |  .__/ 
# ----------------------------------------------------------------------------
PATH_TO_LIBRARY_SCRIPT_UTILITIES=`echo "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" | cut -f1-6 -d"/"`/libraries/script_utilities.sh
source ${PATH_TO_LIBRARY_SCRIPT_UTILITIES}
PATH_TO_LIBRARY_CONFIG_READER_LOCAL=`echo "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" | cut -f1-6 -d"/"`/libraries/config_reader_local.sh
source ${PATH_TO_LIBRARY_CONFIG_READER_LOCAL}

# ----------------------------------------------------------------------------
#  __   __   __      __  ___     __  ___       __  ___ 
# /__` /  ` |__) |  |__)  |     /__`  |   /\  |__)  |  
# .__/ \__, |  \ |  |     |     .__/  |  /~~\ |  \  |  
# ----------------------------------------------------------------------------
print_dashed_line_with_text "script{transfer_ini_file_to_servers.sh} start on {${CURRENT_USER}-${HOST_NAME}}."

# ----------------------------------------------------------------------------
#  __        ___  ___ ___         __        ___  __        __  
# /__`  /\  |__  |__   |  \ /    /  ` |__| |__  /  ` |__/ /__` 
# .__/ /~~\ |    |___  |   |     \__, |  | |___ \__, |  \ .__/ 
# ----------------------------------------------------------------------------
terminate_if_ubuntu
terminate_if_sudo

# ----------------------------------------------------------------------------
#            __           __        ___  __      __   ___ ___ ___          __  
# \  /  /\  |__) |   /\  |__) |    |__  /__`    /__` |__   |   |  |  |\ | / _` 
#  \/  /~~\ |  \ |  /~~\ |__) |___ |___ .__/    .__/ |___  |   |  |  | \| \__> 
# ----------------------------------------------------------------------------
set_variables_for_quasar
set_variables_for_databoi
set_variables_for_client_side

# ----------------------------------------------------------------------------
#                       __   __   __   ___ 
# |\/|  /\  |  |\ |    /  ` /  \ |  \ |__  
# |  | /~~\ |  | \|    \__, \__/ |__/ |___ 
# ----------------------------------------------------------------------------

# Create the config file directory if it does not exist.
ssh -i ${QUASAR_PEM_PATH} ${QUASAR_USER}@${QUASAR_IP} -p ${QUASAR_PORT} "mkdir -p ${PATH_TO_CONFIG_DIRECTORY_FOR_SERVERS}"

# Create the config file directory if it does not exist.
ssh -i ${DATABOI_PEM_PATH} ${DATABOI_USER}@${DATABOI_IP} -p ${DATABOI_PORT} "mkdir -p ${PATH_TO_CONFIG_DIRECTORY_FOR_SERVERS}"

scp -P ${DATABOI_PORT} -i ${DATABOI_PEM_PATH} ${PATH_TO_LOCAL_CONFIG_FILE_FOR_SERVERS} ${DATABOI_USER}@${DATABOI_IP}:${PATH_TO_CONFIG_FILE_FOR_SERVERS}
scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${PATH_TO_LOCAL_CONFIG_FILE_FOR_SERVERS} ${QUASAR_USER}@${QUASAR_IP}:${PATH_TO_CONFIG_FILE_FOR_SERVERS}


# ----------------------------------------------------------------------------
#  __   __   __      __  ___     ___       __  
# /__` /  ` |__) |  |__)  |     |__  |\ | |  \ 
# .__/ \__, |  \ |  |     |     |___ | \| |__/ 
# ----------------------------------------------------------------------------
print_dashed_line_with_text "script{transfer_ini_file_to_servers.sh} end on {${CURRENT_USER}-${HOST_NAME}}."

