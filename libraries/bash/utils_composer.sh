#!/usr/bin/env bash

composer_health_check () {
    echo "--- D I A G N O S E ---"
    composer diagnose -vvv

    #echo "--- C H E C K  P L A T O R M  R E Q S ---"
    #composer check-platform-reqs

    #echo "--- C H E C K  O U T D A T E D ---"
    #composer outdated

    #echo "--- V A L I D A T E ---"
    #composer validate --with-dependencies --strict
}

composer_update_full () {
    sudo -H composer self-update
}

composer_update () {
    composer update --no-progress -o
}

composer_install () {
    composer install --no-progress -o --verbose #--enable-opcache --enable-opcache-file
}

composer_optimize () {
    composer dump-autoload --optimize --classmap-authoritative -vvv
}