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
export DB_NAME='postgres'
export PATH_RELATIVE_NODE_MINIFY_HTML='applications/asset_server/js/minify_html_file.js'
export PATH_RELATIVE_NODE_MINIFY_CSS='applications/asset_server/js/minify_css_file.js'
export PATH_RELATIVE_NODE_MINIFY_JS='applications/asset_server/js/minify_js_file.js'
# ---- FTP ----
export FTP_HOST='192.168.1.170'
export FTP_USER='l0_c4_m4'
export FTP_PASS='sudoadmin'
export FTP_TIMEOUT='5' # Default{90} (seconds)
export FTP_PORT='21'   # Default{21}
#-----------------------------------------------------------------------------------------------------------------------

#PATH_RELATIVE_PROJECT_CONFIGS='configs/code_manager.yml'

RUN_CONSOLE="php /quasar_source/libraries/php/console.php"
RUN_DEPLOYER="./dep --file=/quasar_source/libraries/php/deploy.php"
CMD_DEPLOYER_RUN_ALL_TESTS="run_all_tests -vvv"
CMD_DEPLOYER_FULL_BUILD="full_build -vvv"
CMD_DEPLOYER_DEBUG="debug -vvv"
CMD_DEPLOYER_BUILD_NEXUS_COURIER="build_nexus_courier -vvv"
FILE_CSS_NEXUS_LOCAL=/quasar_source/assets/css/nexus_local.css
FILE_CSS_NEXUS_LOCAL_OUTPUT=/quasar_source/var/web_assets/nexus_local.min.css
FILE_CSS_NEXUS_LOCAL_OUTPUT_FINAL=/quasar_source/var/web_assets/nexus_local.min.css.gz
RUN_CONSOLE_CMD="php /quasar_source/applications/asset_server/code_manager/bin/console"


#${RUN_DEPLOYER} ${CMD_DEPLOYER_FULL_BUILD}

#${RUN_DEPLOYER} ${CMD_DEPLOYER_RUN_ALL_TESTS}
#${RUN_DEPLOYER} ${CMD_DEPLOYER_DEBUG}

#${RUN_DEPLOYER} ${CMD_DEPLOYER_BUILD_NEXUS_COURIER}

cd ${PATH_DIRECTORY_CODE_MANAGER}
#php -S "0.0.0.0:80"

#composer self-update
#composer validate
#composer update
#composer install -o --verbose
#composer install -o   #--enable-opcache --enable-opcache-file

#${RUN_CONSOLE_CMD} doctrine:database:drop -vvv --force
#${RUN_CONSOLE_CMD} doctrine:database:create -vvv
#${RUN_CONSOLE_CMD} doctrine:schema:update -vvv --no-interaction --force
${RUN_CONSOLE_CMD} code:health_check -vvv

#apk add --update php-opcache@php


#composer require symfony/config

#${RUN_CONSOLE} cache:clear

#${RUN_CONSOLE_CMD} list

#${RUN_CONSOLE_CMD} doctrine:cache:delete

#${RUN_CONSOLE_CMD} doctrine:database:drop -vvv --force --no-interaction

#${RUN_CONSOLE_CMD} doctrine:mapping:info

#${RUN_CONSOLE_CMD} doctrine:schema:update -vvv --no-interaction --force
#${RUN_CONSOLE_CMD} doctrine:schema:create -vvv --no-interaction

#${RUN_CONSOLE_CMD} doctrine:migrations:migrate -vvv --no-interaction
#${RUN_CONSOLE_CMD} doctrine:migrations:status
#${RUN_CONSOLE_CMD} doctrine:migrations:execute --down 20190421062410 -vvv --no-interaction
#${RUN_CONSOLE_CMD} doctrine:migrations:execute --up 20190421062410 -vvv --no-interaction
#${RUN_CONSOLE_CMD} doctrine:migrations:dump-schema
