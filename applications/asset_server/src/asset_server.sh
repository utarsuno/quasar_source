#!/usr/bin/env bash

CMD_CONSOLE_MINIFY="minify:css"
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
RUN_COMPOSER_CMD="php composer.phar"


#${RUN_DEPLOYER} ${CMD_DEPLOYER_FULL_BUILD}

#${RUN_DEPLOYER} ${CMD_DEPLOYER_RUN_ALL_TESTS}
#${RUN_DEPLOYER} ${CMD_DEPLOYER_DEBUG}

#${RUN_DEPLOYER} ${CMD_DEPLOYER_BUILD_NEXUS_COURIER}

cd /quasar_source/applications/asset_server/code_manager;
php -S "0.0.0.0:80"

#${RUN_COMPOSER_CMD} install -o;

#${RUN_CONSOLE_CMD} code:health_check -vvv

#curl -s https://getcomposer.org/installer
#chmod +x ./composer.phar
#${RUN_COMPOSER_CMD} self-update;
#${RUN_CONSOLE} cache:clear

#${RUN_COMPOSER_CMD} update -o;

#${RUN_CONSOLE_CMD} list

#${RUN_CONSOLE_CMD} doctrine:cache:delete

#${RUN_CONSOLE_CMD} doctrine:database:drop -vvv --force
#${RUN_CONSOLE_CMD} doctrine:database:create -vvv
#${RUN_CONSOLE_CMD} doctrine:database:drop -vvv --force --no-interaction

#${RUN_CONSOLE_CMD} doctrine:mapping:info

#${RUN_CONSOLE_CMD} doctrine:schema:update -vvv --no-interaction --force
#${RUN_CONSOLE_CMD} doctrine:schema:create -vvv --no-interaction

#${RUN_CONSOLE_CMD} doctrine:migrations:migrate -vvv --no-interaction
#${RUN_CONSOLE_CMD} doctrine:migrations:status
#${RUN_CONSOLE_CMD} doctrine:migrations:execute --down 20190421062410 -vvv --no-interaction
#${RUN_CONSOLE_CMD} doctrine:migrations:execute --up 20190421062410 -vvv --no-interaction
#${RUN_CONSOLE_CMD} doctrine:migrations:dump-schema
