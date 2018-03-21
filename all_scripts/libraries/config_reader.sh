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
    DATABOI_IP=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} databoi ip)
}

function set_variables_for_server_side {
	PATH_TO_UPDATE_SERVER_SCRIPT=$(python3 ${PATH_TO_INI_FILE_READER} ${PATH_TO_CONFIG_FILE} server_side path_to_update_server_script)
}