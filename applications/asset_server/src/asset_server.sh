#!/usr/bin/env bash


#CMD ["sleep", "10000000"]

#CMD ["php7", "-S", "0.0.0.0:80"]

#CMD ["php7", "/quasar_source/libraries/php/db_test.php"]
#CMD ["php7", "/quasar_source/libraries/php/vendor/bin/simple-phpunit", "-c", "/quasar_source/libraries/php/phpunit.xml"]

#"php7", "/quasar_source/libraries/php/vendor/bin/simple-phpunit", "-c", "/quasar_source/libraries/php/phpunit.xml"

#sleep 100000

php7 /quasar_source/libraries/php/composer.phar install -d /quasar_source/libraries/php
php7 /quasar_source/libraries/php/composer.phar dump-autoload -o -d /quasar_source/libraries/php
#php7 /quasar_source/libraries/php/composer.phar update -d /quasar_source/libraries/php
#php7 /quasar_source/libraries/php/db_test.php

php7 /quasar_source/libraries/php/vendor/bin/simple-phpunit -c /quasar_source/libraries/php/phpunit.xml



