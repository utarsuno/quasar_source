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
print_dashed_line_with_text "script{quasar_server_restart.sh} start on {${CURRENT_USER}-${HOST_NAME}}."

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
set_variables_for_quasar_connection

set_variables_for_quasar_maintenance

# ----------------------------------------------------------------------------
#                       __   __   __   ___ 
# |\/|  /\  |  |\ |    /  ` /  \ |  \ |__  
# |  | /~~\ |  | \|    \__, \__/ |__/ |___ 
# ----------------------------------------------------------------------------

ssh -tt -i ${QUASAR_PEM_PATH} ${QUASAR_USER}@${QUASAR_IP} -p ${QUASAR_PORT} "${QUASAR_RESTART_SERVER}"

# ----------------------------------------------------------------------------
#  __   __   __      __  ___     ___       __  
# /__` /  ` |__) |  |__)  |     |__  |\ | |  \ 
# .__/ \__, |  \ |  |     |     |___ | \| |__/ 
# ----------------------------------------------------------------------------
print_dashed_line_with_text "script{quasar_server_restart.sh} end on {${CURRENT_USER}-${HOST_NAME}}."

