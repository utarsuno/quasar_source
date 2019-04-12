FROM alpine:3.8

#RUN echo "ipv6" >> /etc/modules

# update
RUN apk update && apk upgrade \
 # bash
 && apk add --no-cache bash && apk add --no-cache bash-completion \
 # npm
 && apk add --no-cache nodejs && apk add --no-cache nodejs-npm \
 # curl
 && apk add --no-cache curl

# ----------------------------------------------------------------------------------------------------------------
#  __        __
# |__) |__| |__)
# |    |  | |
# ----------------------------------------------------------------------------------------------------------------

# trust this project public key to trust the packages.
ADD https://php.codecasts.rocks/php-alpine.rsa.pub /etc/apk/keys/php-alpine.rsa.pub

RUN apk --update add ca-certificates \
 && echo "@php https://php.codecasts.rocks/v3.8/php-7.3" >> /etc/apk/repositories \
 && apk add --update php@php \
 && apk add --update php-opcache@php \
 && apk add --update php-gd@php \
 && apk add --update php-curl@php \
 && apk add --update php-fpm@php \
 && apk add --update php-phar@php \
 && apk add --update php-json@php \
 && apk add --update php-iconv@php \
 && apk add --update php-openssl@php \
 && apk add --update php-dom@php \
 && apk add --update php-zlib@php \
 && apk add --update php-iconv@php \
 && apk add --update php-mbstring@php \
 && apk add --update php-xml@php \
 # Database libraries.
 && apk add --update php-pdo@php \
 && apk add --update php-pgsql@php

# Deployer
RUN curl -L0 https://deployer.org/deployer.phar --output dep
RUN chmod +x ./dep

# ----------------------------------------------------------------------------------------------------------------
#  __
# /  ` __|__ __|__
# \__,   |     |
# ----------------------------------------------------------------------------------------------------------------
RUN apk add --no-cache libc-dev \
 && apk add --no-cache gcc \
 && apk add --no-cache zlib-dev \
 && apk add --no-cache jpeg-dev \
 && apk add --no-cache build-base \
 && apk add --no-cache boost-dev \
 && apk add --no-cache musl-dev \
 && apk add --no-cache cmake \
 && apk add libev-dev \
 && apk add linux-headers \
 && apk add libtool \
 && apk add libsodium-dev \
 && apk add automake \
 && apk add openssl-dev


RUN ln -s /usr/bin/php7 /usr/bin/php


COPY ./generated_output/third_party_libraries/AMQP_CPP_3_1_0 /quasar_source/generated_output/third_party_libraries/AMQP_CPP_3_1_0
#RUN cd /quasar_source/generated_output/third_party_libraries/AMQP_CPP_3_1_0 \
# && make \
# && make install

COPY ./libraries/pre_compiled/libamqpcpp.so.3.1 /usr/lib/libamqpcpp.so.3.1

CMD ["bash", "/quasar_source/applications/asset_server/src/asset_server.sh"]


