#!/bin/bash

PATH_TO_INI_FILE_READER=`echo "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" | cut -f1-6 -d"/"`/libraries/config_reader_for_bash.py
PATH_TO_CONFIG_FILE=`echo "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" | cut -f1-5 -d"/"`/configuration_files/config.ini

function set_variables_for_quasar {
    QUASAR_IP=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar ip)
    QUASAR_PORT=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar port)
    QUASAR_PEM_PATH=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar pem_path)
    QUASAR_USER=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar user)
}

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
}

function set_variables_for_client_side {
    PATH_TO_LOCAL_CONFIG_FILE_FOR_SERVERS=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} client_side path_to_local_config_file_for_servers)
    PATH_TO_CONFIG_FILE_FOR_SERVERS=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} client_side path_to_config_file_for_servers)
    PATH_TO_CONFIG_DIRECTORY_FOR_SERVERS=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} client_side path_to_config_directory_for_servers)
}

function set_variables_for_quasar_maintenance {
    PATH_TO_QUASAR_MAINTENANCE=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar_maintenance path_to_quasar_maintenance_script)
    QUASAR_MAINTENANCE_FLAG_CREATE_PRODUCTION=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar_maintenance flag_create_production)
    PATH_TO_LOCAL_PYTHON3=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} quasar_maintenance path_to_local_python3)
}