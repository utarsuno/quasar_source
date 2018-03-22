#!/bin/bash

PATH_TO_INI_FILE_READER=`echo "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" | cut -f1-5 -d"/"`/libraries/config_reader_for_bash.py
PATH_TO_CONFIG_FILE=`echo "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" | cut -f1-4 -d"/"`/configuration_files/config.ini
PATH_TO_IS_PROGRAM_RUNNING=`echo "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" | cut -f1-5 -d"/"`/libraries/is_program_running.py
PATH_TO_QUASAR_SOURCE=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side path_to_quasar_source)

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
}

function set_variables_for_entity_server {
    PYTHON_ENTITY_SERVER=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side entity_server)
    PYTHON_ENTITY_SCRIPT_TERMINATE=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side entity_server_terminate_script)
    PYTHON_ENTITY_SCRIPT_RUN_IN_BACKGROUND=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side entity_server_run_in_background_script)
}

function set_variables_for_quasar_server {
    PYTHON_QUASAR_SCRIPT_TERMINATE=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side django_server_terminate_script)
    PYTHON_QUASAR_SCRIPT_RUN_IN_BACKGROUND=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side django_server_run_in_background_script)
    PYTHON_QUASAR_MANAGE_PATH=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side django_manage_path)
}

#function set_variables_for_finance_server {
#}
