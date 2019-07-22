#!/usr/bin/env bash
#-----------------------------------------------------------------------------------------------------------------------
export PATH_DIRECTORY_PROJECT_BASE='/quasar_source/'
export PATH_DIRECTORY_CODE_MANAGER='/quasar_source/applications/asset_server/code_manager/'
export PATH_DIRECTORY_NODE='/quasar_source/applications/asset_server/js/'
export PATH_QA_REPORT=${PATH_DIRECTORY_CODE_MANAGER}'report.xml'
export PATH_PROJECT_CONFIGS='/quasar_source/configs/code_manager.yml'
export PATH_PROJECT_BUNDLES='/quasar_source/applications/asset_server/code_manager/config/bundles.php'
export PATH_NODE_MINIFY_HTML='/quasar_source/libraries/node/minifier_html.js'
export PATH_NODE_MINIFY_CSS='/quasar_source/libraries/node/minifier_css.js'
export PATH_NODE_MINIFY_JS='/quasar_source/libraries/node/minifier_css.js'
export SYMFONY_ENV='dev'
export PATH_RELATIVE_NODE_MINIFY_HTML='applications/asset_server/js/minify_html_file.js'
export PATH_RELATIVE_NODE_MINIFY_CSS='applications/asset_server/js/minify_css_file.js'
export PATH_RELATIVE_NODE_MINIFY_JS='applications/asset_server/js/minify_js_file.js'
# ---- DB -----
#export DATABASE_URL='pgsql://postgres:password@postgres_server:5432/postgres'
export DATABASE_URL='pgsql://postgres:password@172.18.0.2:5432/postgres'
export DB_NAME='postgres'
export DB_MIGRATIONS='/quasar_source/var/db/migrations'
export DB_EXTRA_DATA='/quasar_source/var/db/extra_data'
export DB_DATA_CSV='/quasar_source/var/db/extra_data/data.csv'
# ---- FTP ----
export FTP_HOST='192.168.1.170'
export FTP_USER='l0_c4_m4'
export FTP_PASS='sudoadmin'
export FTP_TIMEOUT='5' # Default{90} (seconds)
export FTP_PORT='21'   # Default{21}
# ---- Session Settings ----
export EXTERNAL_VOLUME='/v/'
export DB_CHECKS='true'
export DB_CHECKS_FORCED='false'
# ---- B U I L D S ----
export BUILD_CSS='/quasar_source/assets/css/'
export BUILD_CSS_OUTPUT='/v/'
export LOG_FILE='/quasar_source/applications/asset_server/code_manager/var/log/dev.log'
#-----------------------------------------------------------------------------------------------------------------------
BASH_LIBS='/quasar_source/libraries/bash/'
source ${BASH_LIBS}common.sh;
source ${BASH_LIBS}utils_composer.sh;
source '/quasar_source/applications/asset_server/src/utils_console.sh'
#-----------------------------------------------------------------------------------------------------------------------
cd ${PATH_DIRECTORY_CODE_MANAGER}
#-----------------------------------------------------------------------------------------------------------------------

#PATH_RELATIVE_PROJECT_CONFIGS='configs/code_manager.yml'

RUN_DEPLOYER="./dep --file=/quasar_source/libraries/php/deploy.php"
CMD_DEPLOYER_RUN_ALL_TESTS="run_all_tests -vvv"
CMD_DEPLOYER_FULL_BUILD="full_build -vvv"
CMD_DEPLOYER_DEBUG="debug -vvv"
CMD_DEPLOYER_BUILD_NEXUS_COURIER="build_nexus_courier -vvv"
FILE_CSS_NEXUS_LOCAL=/quasar_source/assets/css/nexus_local.css
FILE_CSS_NEXUS_LOCAL_OUTPUT=/quasar_source/var/web_assets/nexus_local.min.css
FILE_CSS_NEXUS_LOCAL_OUTPUT_FINAL=/quasar_source/var/web_assets/nexus_local.min.css.gz

#${RUN_DEPLOYER} ${CMD_DEPLOYER_FULL_BUILD}
#${RUN_DEPLOYER} ${CMD_DEPLOYER_RUN_ALL_TESTS}
#${RUN_DEPLOYER} ${CMD_DEPLOYER_DEBUG}
#${RUN_DEPLOYER} ${CMD_DEPLOYER_BUILD_NEXUS_COURIER}

#php -S "0.0.0.0:1337"

#php -v

#console_db_schema_update
#composer_install
#console_list
#composer_health_check
#composer -V
#composer self-update
#composer_optimize
console_code_manager

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

