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

${RUN_DEPLOYER} ${CMD_DEPLOYER_RUN_ALL_TESTS}

#${RUN_DEPLOYER} ${CMD_DEPLOYER_BUILD_NEXUS_COURIER}

# php7 /quasar_source/libraries/php/db_test.php

