#!/usr/bin/env bash

#CMD ["php7", "-S", "0.0.0.0:80"]

#echo 'TEMPORARY_SLEEPING!!'
#sleep 100000

#./dep --file=/quasar_source/libraries/php/deploy.php run_all_tests -vvv

./dep --file=/quasar_source/libraries/php/deploy.php build_nexus_courier -vvv

# php7 /quasar_source/libraries/php/db_test.php

