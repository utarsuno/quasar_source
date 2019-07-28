#!/usr/bin/env bash

RUN_CONSOLE_CMD="php /quasar_source/applications/asset_server/code_manager/bin/console"

console_code_manager () {
    ${RUN_CONSOLE_CMD} code:health_check -vvv
}

console_list () {
    ${RUN_CONSOLE_CMD} list
}

console_db_schema_validate () {
    ${RUN_CONSOLE_CMD} doctrine:schema:validate -vvv
}

console_db_schema_update () {
    ${RUN_CONSOLE_CMD} doctrine:schema:update --force --complete --dump-sql -vvv
}

#${RUN_CONSOLE_CMD} doctrine:database:drop -vvv --force
#${RUN_CONSOLE_CMD} doctrine:schema:update --force --complete --dump-sql -vvv
#${RUN_CONSOLE_CMD} doctrine:schema:update --dump-sql -vvv

#${RUN_CONSOLE_CMD} doctrine:database:drop -vvv --force
#${RUN_CONSOLE_CMD} doctrine:database:create -vvv
#${RUN_CONSOLE_CMD} doctrine:schema:update -vvv --no-interaction --force

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

