#!/bin/bash

# ----------------------------------------------------------------------------
#  __   ___       ___  __       ___     __                __  ___  ___  __  
# / _` |__  |\ | |__  |__)  /\   |  |  /  \ |\ |    |\ | /  \  |  |__  /__` 
# \__> |___ | \| |___ |  \ /~~\  |  |  \__/ | \|    | \| \__/  |  |___ .__/ 
# ----------------------------------------------------------------------------
# LAST_GENERATED : {3.26.2018}

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
print_dashed_line_with_text "script{generate_server_scripts.sh} start on {${CURRENT_USER}-${HOST_NAME}}."

# ----------------------------------------------------------------------------
#  __        ___  ___ ___         __        ___  __        __  
# /__`  /\  |__  |__   |  \ /    /  ` |__| |__  /  ` |__/ /__` 
# .__/ /~~\ |    |___  |   |     \__, |  | |___ \__, |  \ .__/ 
# ----------------------------------------------------------------------------
terminate_if_ubuntu

# ----------------------------------------------------------------------------
#            __           __        ___  __      __   ___ ___ ___          __  
# \  /  /\  |__) |   /\  |__) |    |__  /__`    /__` |__   |   |  |  |\ | / _` 
#  \/  /~~\ |  \ |  /~~\ |__) |___ |___ .__/    .__/ |___  |   |  |  | \| \__> 
# ----------------------------------------------------------------------------
set_variables_for_quasar_connection

set_variables_for_quasar_project_setup

# ----------------------------------------------------------------------------
#                       __   __   __   ___ 
# |\/|  /\  |  |\ |    /  ` /  \ |  \ |__  
# |  | /~~\ |  | \|    \__, \__/ |__/ |___ 
# ----------------------------------------------------------------------------

ssh -i ${QUASAR_PEM_PATH} ${QUASAR_USER}@${QUASAR_IP} -p ${QUASAR_PORT} << HERE
mkdir -p ${QUASAR_PROJECT_BASE_DIRECTORY};
cd ${QUASAR_PROJECT_BASE_DIRECTORY};
mkdir -p ./all_scripts;
mkdir -p ./configurations;
cd ./all_scripts;
mkdir -p ./quasar_server;
mkdir -p ./entity_server;
HERE

scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${QUASAR_LIVE_RUN_LOCAL} ${QUASAR_USER}@${QUASAR_IP}:${QUASAR_LIVE_RUN_SERVER}
scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${QUASAR_RESTART_LOCAL} ${QUASAR_USER}@${QUASAR_IP}:${QUASAR_RESTART_SERVER}
scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${QUASAR_RUN_IN_BACKGROUND_LOCAL} ${QUASAR_USER}@${QUASAR_IP}:${QUASAR_RUN_IN_BACKGROUND_SERVER}
scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${QUASAR_TERMINATE_LOCAL} ${QUASAR_USER}@${QUASAR_IP}:${QUASAR_TERMINATE_SERVER}

scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${ENTITY_LIVE_RUN_LOCAL} ${QUASAR_USER}@${QUASAR_IP}:${ENTITY_LIVE_RUN_SERVER}
scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${ENTITY_RESTART_LOCAL} ${QUASAR_USER}@${QUASAR_IP}:${ENTITY_RESTART_SERVER}
scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${ENTITY_RUN_IN_BACKGROUND_LOCAL} ${QUASAR_USER}@${QUASAR_IP}:${ENTITY_RUN_IN_BACKGROUND_SERVER}
scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${ENTITY_TERMINATE_LOCAL} ${QUASAR_USER}@${QUASAR_IP}:${ENTITY_TERMINATE_SERVER}

scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${UPDATE_SERVER_CODE_LOCAL} ${QUASAR_USER}@${QUASAR_IP}:${UPDATE_SERVER_CODE_SERVER}
scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${HEALTH_CHECK_LOCAL} ${QUASAR_USER}@${QUASAR_IP}:${HEALTH_CHECK_SERVER}

ssh -i ${QUASAR_PEM_PATH} ${QUASAR_USER}@${QUASAR_IP} -p ${QUASAR_PORT} << HERE
cd ${QUASAR_PROJECT_BASE_DIRECTORY};
cd ./all_scripts;
sudo chmod +x ./update_code.sh;
sudo chmod +x ./health_check.sh;
cd ./entity_server;
sudo chmod +x ./live_run.sh;
sudo chmod +x ./restart.sh;
sudo chmod +x ./run_in_background.sh;
sudo chmod +x ./terminate.sh;
cd ..;
cd ./quasar_server;
sudo chmod +x ./live_run.sh;
sudo chmod +x ./restart.sh;
sudo chmod +x ./run_in_background.sh;
sudo chmod +x ./terminate.sh;
HERE


# ----------------------------------------------------------------------------
#  __   __   __      __  ___     ___       __  
# /__` /  ` |__) |  |__)  |     |__  |\ | |  \ 
# .__/ \__, |  \ |  |     |     |___ | \| |__/ 
# ----------------------------------------------------------------------------
print_dashed_line_with_text "script{generate_server_scripts.sh} end on {${CURRENT_USER}-${HOST_NAME}}."

