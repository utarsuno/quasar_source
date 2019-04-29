#!/usr/bin/env bash

#CMD ["php7", "-S", "0.0.0.0:80"]

#echo 'TEMPORARY_SLEEPING!!'
#sleep 100000

FILE_CSS_NEXUS_LOCAL=/quasar_source/assets/css/nexus_local.css
FILE_CSS_NEXUS_LOCAL_OUTPUT=/quasar_source/var/web_assets/nexus_local.min.css
FILE_CSS_NEXUS_LOCAL_OUTPUT_FINAL=/quasar_source/var/web_assets/nexus_local.min.css.gz
RUN_CONSOLE_CMD="php bin/console"
RUN_COMPOSER_CMD="php composer.phar"


#/usr/bin/php7

#${RUN_DEPLOYER} ${CMD_DEPLOYER_FULL_BUILD}

#${RUN_CONSOLE} ${CMD_CONSOLE_MINIFY} ${FLAG_INPUT} ${FILE_CSS_NEXUS_LOCAL} ${FLAG_OUTPUT}  ${FILE_CSS_NEXUS_LOCAL_OUTPUT} -vvv
#${RUN_CONSOLE} ${CMD_CONSOLE_GZIP} ${FLAG_INPUT} ${FILE_CSS_NEXUS_LOCAL_OUTPUT} ${FLAG_OUTPUT}  ${FILE_CSS_NEXUS_LOCAL_OUTPUT_FINAL} -vvv

#${RUN_DEPLOYER} ${CMD_DEPLOYER_RUN_ALL_TESTS}
#${RUN_DEPLOYER} ${CMD_DEPLOYER_DEBUG}


#${RUN_DEPLOYER} ${CMD_DEPLOYER_BUILD_NEXUS_COURIER}

# php7 /quasar_source/libraries/php/db_test.php


#php bin/console doctrine:database:create

cd /quasar_source/applications/asset_server/code_manager;
#php composer.phar update;
#php bin/console doctrine:database:create
#php bin/console cache:clear


#chmod +x ./composer.phar

#sleep 10000000

#curl -s https://getcomposer.org/installer

#${RUN_COMPOSER_CMD} self-update;

#${RUN_CONSOLE_CMD} doctrine:cache:delete

#${RUN_COMPOSER_CMD} update;
#${RUN_COMPOSER_CMD} install -o;

#${RUN_CONSOLE_CMD} list
#${RUN_CONSOLE_CMD} file_compression:test

#php bin/phpunit --log-junit report.xml # --log-teamcity
${RUN_CONSOLE_CMD} code:health_check -vvv

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
