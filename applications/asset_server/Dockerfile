FROM alpine:3.8

RUN apk update \
 && apk upgrade \
 && apk add --no-cache bash \
 && apk add --no-cache bash-completion

# && apk add --no-cache php7 \
# && apk add --no-cache php7-fpm \
# && apk add --no-cache php7-opcache \
# && apk add --no-cache php7-gd \
# && apk add --no-cache php7-msqli \
# && apk add --no-cache php7-zlib \
# && apk add --no-cache php7-curl

# trust this project public key to trust the packages.
ADD https://php.codecasts.rocks/php-alpine.rsa.pub /etc/apk/keys/php-alpine.rsa.pub

RUN apk --update add ca-certificates \
 && echo "@php https://php.codecasts.rocks/v3.8/php-7.3" >> /etc/apk/repositories \
 && apk add --update php@php

# && apk add --update php-mbstring@php \
# && apk add --update php-you-extension-name-here@php




#CMD ["python3", "/quasar_source/applications/code_manager/layer_applications/nexus_local_build_process.py"]
#CMD ["sleep", "10000000"]
CMD ["php7", "-S", "127.0.0.1:7999"]
