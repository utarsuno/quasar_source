FROM alpine:3.8

RUN apk update \
 && apk upgrade \
 && apk add --no-cache bash \
 && apk add --no-cache bash-completion

# && apk add --no-cache php7 \
# && apk add --no-cache php7-opcache \
# && apk add --no-cache php7-gd \
# && apk add --no-cache php7-msqli \
# && apk add --no-cache php7-zlib \
# && apk add --no-cache php7-curl




# trust this project public key to trust the packages.
ADD https://php.codecasts.rocks/php-alpine.rsa.pub /etc/apk/keys/php-alpine.rsa.pub

RUN apk --update add ca-certificates \
 && echo "@php https://php.codecasts.rocks/v3.8/php-7.3" >> /etc/apk/repositories \
 && apk add --update php@php \
 && apk add --update php-pdo@php \
 && apk add --update php-pgsql@php \
 && apk add --update php-fpm@php \
 && apk add --update php-phar@php \
 && apk add --update php-json@php \
 && apk add --update php-iconv@php \
 && apk add --update php-openssl@php \
 && apk add --update php-dom@php


CMD ["bash", "/quasar_source/applications/asset_server/src/asset_server.sh"]


