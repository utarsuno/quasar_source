#!/usr/bin/env bash

#CMD ["php7", "-S", "0.0.0.0:80"]

#echo 'TEMPORARY_SLEEPING!!'
#sleep 100000

FILE_CSS_NEXUS_LOCAL=/quasar_source/assets/css/nexus_local.css
FILE_CSS_NEXUS_LOCAL_OUTPUT=/quasar_source/var/web_assets/nexus_local.min.css
FILE_CSS_NEXUS_LOCAL_OUTPUT_FINAL=/quasar_source/var/web_assets/nexus_local.min.css.gz

#apk search php7 #| grep -i gd

#/usr/bin/php7

#php --version

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

#php bin/console doctrine:cache:delete

#php composer.phar install -o;
#php bin/console doctrine:migrations:diff -vvv --no-interaction
#php bin/console doctrine:migrations:execute --up 20190421084242 -vvv --no-interaction

#php composer.phar update;

#php bin/console list

#php bin/phpunit
#php bin/console file_compression:test
php bin/console code:health_check


#php bin/console doctrine:database:drop -vvv --force
#php bin/console doctrine:database:create -vvv


#php bin/console doctrine:mapping:info
#php bin/console doctrine:schema:update -vvv --no-interaction --force

#php bin/console doctrine:migrations:execute --up 20190421065423 -vvv --no-interaction

#php bin/console doctrine:database:drop -vvv --force --no-interaction
#php bin/console doctrine:schema:create -vvv --no-interaction

#php bin/console doctrine:migrations:migrate -vvv --no-interaction

#php bin/console doctrine:migrations:status

#php bin/console doctrine:migrations:execute --down 20190421062410 -vvv --no-interaction
#php bin/console doctrine:migrations:execute --up 20190421062410 -vvv --no-interaction

#php bin/console doctrine:schema:update --force -vvv

#php bin/console doctrine:migrations:dump-schema
