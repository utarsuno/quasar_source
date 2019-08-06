#!/usr/bin/env bash
#-----------------------------------------------------------------------------------------------------------------------
QS_APPS='/quasar_source/applications/'
QS_VAR='/quasar_source/var/'
QS_ASSETS='/quasar_source/assets/'
QS_LIBS='/quasar_source/libraries/'
QS_LIBS_NODE=${QS_LIBS}'node/'
QS_ASSET_SERVER=${QS_APPS}'asset_server/'

export PATH_DIRECTORY_PROJECT_BASE='/quasar_source/'
export PATH_DIRECTORY_CODE_MANAGER=${QS_APPS}'asset_server/code_manager/'
export PATH_DIRECTORY_NODE=${QS_APPS}'asset_server/js/'
export PATH_DIRECTORY_NODE_JS_LIBS='/quasar_source/libraries/node/'
export PATH_QA_REPORT=${PATH_DIRECTORY_CODE_MANAGER}'report.xml'
export PATH_PROJECT_CONFIGS='/quasar_source/configs/code_manager.yml'
export PATH_PROJECT_BUNDLES=${QS_APPS}'asset_server/code_manager/config/bundles.php'
export PATH_NODE_MINIFY_HTML=${QS_LIBS_NODE}'minifier_html.js'
export PATH_NODE_MINIFY_CSS=${QS_LIBS_NODE}'minifier_css.js'
export PATH_NODE_MINIFY_JS=${QS_LIBS_NODE}'minifier_css.js'
export SYMFONY_ENV='dev'
export PATH_RELATIVE_NODE_MINIFY_HTML='applications/asset_server/js/minify_html_file.js'
export PATH_NODE_MINIFY_CSS=${QS_ASSET_SERVER}'js/minify_css_file.js'
# ---- Node Scripting ----
export PATH_NODE_MINIFY_FILE=${QS_ASSET_SERVER}'js/script_minify_file.js'
# ---- DB -----
export DATABASE_URL='pgsql://postgres:password@postgres_server:5432/postgres'
#export DATABASE_URL='pgsql://postgres:password@172.18.0.2:5432/postgres'
export DB_NAME='postgres'
export DB_MIGRATIONS=${QS_VAR}'db/migrations'
export DB_EXTRA_DATA=${QS_VAR}'db/extra_data'
export DB_DATA_CSV=${QS_VAR}'db/extra_data/data.csv'
# ---- FTP ----
export FTP_HOST='192.168.1.170'
export FTP_USER='l0_c4_m4'
export FTP_PASS='sudoadmin'
export FTP_TIMEOUT='5' # Default{90} (seconds)
export FTP_PORT='21'   # Default{21}
# ---- Session Settings ----
export BUILD_PROJECT='NexusLocal'
export DB_CHECKS='true'
export DB_CHECKS_FORCED='false'
# ---- B U I L D S ----
export LOG_FILE=${QS_ASSET_SERVER}'code_manager/var/log/dev.log'
#-----------------------------------------------------------------------------------------------------------------------
BASH_LIBS='/quasar_source/libraries/bash/'
source ${BASH_LIBS}common.sh;
source ${BASH_LIBS}utils_composer.sh;
source ${QS_ASSET_SERVER}'src/utils_console.sh'
#-----------------------------------------------------------------------------------------------------------------------
cd ${PATH_DIRECTORY_CODE_MANAGER}
#-----------------------------------------------------------------------------------------------------------------------

#PATH_RELATIVE_PROJECT_CONFIGS='configs/code_manager.yml'

RUN_DEPLOYER="./dep --file=/quasar_source/libraries/php/deploy.php"
CMD_DEPLOYER_RUN_ALL_TESTS="run_all_tests -vvv"
CMD_DEPLOYER_FULL_BUILD="full_build -vvv"
CMD_DEPLOYER_DEBUG="debug -vvv"
CMD_DEPLOYER_BUILD_NEXUS_COURIER="build_nexus_courier -vvv"

#${RUN_DEPLOYER} ${CMD_DEPLOYER_FULL_BUILD}
#${RUN_DEPLOYER} ${CMD_DEPLOYER_RUN_ALL_TESTS}
#${RUN_DEPLOYER} ${CMD_DEPLOYER_DEBUG}
#${RUN_DEPLOYER} ${CMD_DEPLOYER_BUILD_NEXUS_COURIER}

#cd /tmp/;
#pwd;
#ls;
#mkdir php-opcache;
#ls;

cd /quasar_source/applications/asset_server/code_manager;
#composer require symfony/web-server-bundle
#symfony serve --no-tls
php bin/console list
#php bin/console server:start *:80;

#php -S "0.0.0.0:80"

#echo 'SLEEPING!'
#sleep 10000000

#console_list
#console_debug

#php -v
#node -v
#npm -v

#composer_optimize
#console_db_schema_update
#console_code_manager

#cd ${QS_ASSET_SERVER}'js/'
#pwd
#npm run-script build

#composer_install
#console_list
#composer_health_check
#composer -V
#composer self-update

#echo 'sleeping...'
#sleep 10000000

#console_db_schema_validate
#composer_test

#stdbuf -oL ${RUN_CONSOLE_CMD} code:health_check -vvv |
#    while IFS= read -r line
#    do
#        CLEAN_LINE="$(esc ${line})"
#        CONTAINED="$(str_contains '"'${CLEAN_LINE}'"' 'PHP Warning:')"
#        #let CONTAINED=str_contains ${CLEAN_LINE} 'PHP Warning:'
#        if [[ ${CONTAINED} -ne 0 ]]; then
#            echo 'ERROR!'
#            echo ${line}
#            echo 'ERROR!'
#            echo 'ERROR!'
#            exit
#        fi
#        #echo "lol at this[$line]"
#    done
#*/

