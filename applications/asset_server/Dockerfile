FROM alpine

#RUN echo "ipv6" >> /etc/modules

# update
RUN apk update && apk upgrade \
 # bash
 && apk add --no-cache bash && apk add --no-cache bash-completion \
 # npm
 && apk add --no-cache nodejs && apk add --no-cache nodejs-npm \
 # curl
 && apk add --no-cache curl \
 # "metapackage that pulls in the most essential packages used to build new packages"
 && apk add --update alpine-sdk \
 # add GZIP just in case
 && apk add --no-cache gzip \
 # install Postgres for compatibility
 && apk add --no-cache postgresql-dev \
 && apk add --update wget

# ----------------------------------------------------------------------------------------------------------------
#  __        __
# |__) |__| |__)
# |    |  | |
# ----------------------------------------------------------------------------------------------------------------

# trust this project public key to trust the packages.
ADD https://php.codecasts.rocks/php-alpine.rsa.pub /etc/apk/keys/php-alpine.rsa.pub

# https://github.com/codecasts/php-alpine

RUN apk add --update ca-certificates \
 && update-ca-certificates \
 && echo "@php https://php.codecasts.rocks/v3.9/php-7.3" >> /etc/apk/repositories \
 && apk add --update php@php \
 && apk add --update php-common@php \
 && apk add --update php-fpm@php \
 && apk add --update php-cgi@php \
 && apk add --update php-doc@php \
 && apk add --update php-dev@php \
 && apk add --update php-gd@php \
 && apk add --update php-curl@php \
 && apk add --update php-openssl@php \
 && apk add --update php-dom@php --repository http://nl.alpinelinux.org/alpine/edge/testing/ \
 && apk add --update php-fpm@php \
 && apk add --update php-phar@php \
 && apk add --update php-json@php \
 && apk add --update php-iconv@php \
 && apk add --update php-openssl@php \
 && apk add --update php-zlib@php \
 && apk add --update php-iconv@php \
 && apk add --update php-mbstring@php \
 && apk add --update php-xml@php \
 && apk add --update php-zip@php \
 && apk add --update php-ctype@php \
 # Database libraries.
 && apk add --update php-pdo@php \
 && apk add --update php-pgsql@php \
 && apk add --update php-pdo_pgsql@php \
 # Set alias for 'php' --> 'php7'
 && ln -s /usr/bin/php7 /usr/bin/php

#RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer

# Deployer
#RUN curl -L0 https://deployer.org/deployer.phar --output dep && chmod +x ./dep

# ----------------------------------------------------------------------------------------------------------------
#  __
# /  ` __|__ __|__
# \__,   |     |
# ----------------------------------------------------------------------------------------------------------------
RUN apk add --no-cache libc-dev \
 && apk add --no-cache libressl-dev \
 && apk add --no-cache gcc \
 && apk add --no-cache zlib-dev \
 && apk add --no-cache jpeg-dev \
 && apk add --no-cache boost-dev \
 && apk add --no-cache musl-dev \
 && apk add --no-cache cmake \
 && apk add libev-dev \
 && apk add linux-headers \
 && apk add libtool \
 && apk add libsodium-dev \
 && apk add automake


 # && apk add --no-cache build-base \
 #&& apk add openssl-dev

RUN rm /var/cache/apk/*

#COPY ./generated_output/third_party_libraries/AMQP_CPP_3_1_0 /quasar_source/generated_output/third_party_libraries/AMQP_CPP_3_1_0
#RUN cd /quasar_source/generated_output/third_party_libraries/AMQP_CPP_3_1_0 \
# && make \
# && make install

#COPY ./libraries/pre_compiled/libamqpcpp.so.3.1 /usr/lib/libamqpcpp.so.3.1

CMD ["bash", "/quasar_source/applications/asset_server/src/asset_server.sh"]


