#!/bin/bash

PATH_TO_INI_FILE_READER=`echo "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" | cut -f1-6 -d"/"`/libraries/config_reader_for_bash.py
PATH_TO_CONFIG_FILE=`echo "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" | cut -f1-5 -d"/"`/configuration_files/config.ini
PATH_TO_LOCAL_PYTHON3=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar_maintenance path_to_local_python3)


function set_variables_for_databoi {
    DATABOI_USER=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} databoi user)
    DATABOI_PORT=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} databoi port)
    DATABOI_IP=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} databoi ip)
    DATABOI_PEM_PATH=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} databoi pem_path)
}

function set_variables_for_server_side {
	PATH_TO_UPDATE_SERVER_CODE_SCRIPT=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side path_to_update_server_code_script)
	PATH_TO_FORCE_UPDATE_SERVER_CODE_SCRIPT=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side path_to_force_update_server_code_script)
	PATH_TO_SCRIPTS_SERVER=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side path_to_scripts_server)
	PATH_TO_SCRIPTS_FINANCE=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side path_to_scripts_finance)
    PATH_TO_QUASAR_SOURCE=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side path_to_quasar_source)


    PATH_TO_ENTITY_SERVER_STATUS=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side path_to_entity_server_status)
    PATH_TO_ENTITY_SERVER_RESTART=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side path_to_entity_server_restart)
    PATH_TO_QUASAR_SERVER_STATUS=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side path_to_quasar_server_status)
    PATH_TO_QUASAR_SERVER_RESTART=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side path_to_quasar_server_restart)
}

function set_variables_for_client_side {
    PATH_TO_LOCAL_CONFIG_FILE_FOR_SERVERS=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} client_side path_to_local_config_file_for_servers)
    PATH_TO_CONFIG_FILE_FOR_SERVERS=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} client_side path_to_config_file_for_servers)
    PATH_TO_CONFIG_DIRECTORY_FOR_SERVERS=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} client_side path_to_config_directory_for_servers)
}

function set_variables_for_quasar_maintenance {
    PATH_TO_QUASAR_MAINTENANCE=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar_maintenance path_to_quasar_maintenance_script)
    QUASAR_MAINTENANCE_FLAG_CREATE_PRODUCTION=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar_maintenance flag_create_production)
    PATH_TO_RESTART_QUASAR_SERVER=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar_maintenance path_to_restart_quasar_server)
}


function set_variables_for_quasar_script_locations {
    PATH_QUASAR_SERVER_LIVE_RUN=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side_quasar path_entity_server_live_run)
    PATH_QUASAR_SERVER_RESTART=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side_quasar path_entity_server_restart)
    PATH_QUASAR_SERVER_RUN_IN_BACKGROUND=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side_quasar path_entity_server_run_in_background)
    PATH_QUASAR_SERVER_STATUS=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side_quasar path_entity_server_status)
    PATH_QUASAR_SERVER_TERMINATE=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side_quasar path_entity_server_terminate)
}


# ORGANIZE THE ABOVE SCRIPTS!!!
# ORGANIZE THE ABOVE SCRIPTS!!!
# ORGANIZE THE ABOVE SCRIPTS!!!
# ORGANIZE THE ABOVE SCRIPTS!!!
# ORGANIZE THE ABOVE SCRIPTS!!!
function set_variables_for_quasar_connection {
    QUASAR_IP=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar_connection ip)
    QUASAR_PORT=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar_connection port)
    QUASAR_PEM_PATH=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar_connection pem_path)
    QUASAR_USER=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar_connection user)
}

function set_variables_for_quasar_project_setup {
    QUASAR_PROJECT_BASE_DIRECTORY=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar project_base_directory)

    SERVER_LOGS=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar server_logs)

    SERVER_SIDE_IS_PROGRAM_RUNNING=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_server_is_program_running)

    CLIENT_SIDE_SERVER_HEALTH_CHECK=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar client_side_server_health_check)

    HEALTH_CHECK_SERVER=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_server_health_check)
    HEALTH_CHECK_LOCAL=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_health_check)

    UPDATE_SERVER_CODE_LOCAL=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_update_code_for_server)
    UPDATE_SERVER_CODE_SERVER=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_server_update_code_for_server)

    ENTITY_LIVE_RUN_LOCAL=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_entity_live_run)
    ENTITY_LIVE_RUN_SERVER=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_server_entity_live_run)
    QUASAR_LIVE_RUN_LOCAL=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_quasar_live_run)
    QUASAR_LIVE_RUN_SERVER=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_server_quasar_live_run)
    
    ENTITY_RESTART_LOCAL=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_entity_restart)
    ENTITY_RESTART_SERVER=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_server_entity_restart)
    QUASAR_RESTART_LOCAL=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_quasar_restart)
    QUASAR_RESTART_SERVER=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_server_quasar_restart)
    
    ENTITY_RUN_IN_BACKGROUND_LOCAL=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_entity_run_in_background)
    ENTITY_RUN_IN_BACKGROUND_SERVER=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_server_entity_run_in_background)
    QUASAR_RUN_IN_BACKGROUND_LOCAL=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_quasar_run_in_background)
    QUASAR_RUN_IN_BACKGROUND_SERVER=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_server_quasar_run_in_background)
    
    ENTITY_TERMINATE_LOCAL=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_entity_terminate)
    ENTITY_TERMINATE_SERVER=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_server_entity_terminate)
    QUASAR_TERMINATE_LOCAL=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_quasar_terminate)
    QUASAR_TERMINATE_SERVER=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar path_server_quasar_terminate)
}
