FROM alpine:3.9

# TODO: Look into using https://github.com/docker-library/php/tree/a9f19e9df5f7a5b74d72a97439ca5b77b87faa35/7.3/alpine3.9/cli

# ----------------------------------------------------------------------------------------------------------------
# Base OS libs.
# ----------------------------------------------------------------------------------------------------------------
RUN apk update && apk upgrade && apk add --update --no-cache \
  bash bash-completion nodejs nodejs-npm curl gzip postgresql-dev alpine-sdk wget coreutils

# ----------------------------------------------------------------------------------------------------------------
#  __        __
# |__) |__| |__)  Not currently needed ever? {php7-apcu}
# |    |  | |     Not currently needed DB drivers/libs: {php7-sqlite3 php7-mysqli php7-pdo_dblib php7-pdo_odbc}
# ----------------------------------------------------------------------------------------------------------------
RUN apk add --no-cache \
 php7 php7-dev php7-fpm php7-json php7-openssl php7-curl php7-zlib php7-xml php7-phar php7-intl php7-dom \
 php7-xmlreader php7-xmlrpc php7-ctype php7-mbstring php7-gd php7-common php7-doc php7-ftp php7-cgi php7-iconv \
 php7-zip php7-session php7-pdo php7-pgsql php7-pdo_pgsql php7-opcache php7-mcrypt php7-soap php7-gmp \
 php7-tokenizer php7-gettext php7-bz2

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer

RUN echo $'[PHP] \n\
zend.multibyte=On \n\
engine=On \n\
short_open_tag=Off \n\
asp_tags=Off \n\
precision=14 \n\
output_buffering=Off \n\
zlib.output_compression=Off \n\
implicit_flush=Off \n\
serialize_precision=-1 \n\
realpath_cache_size=4M \n\
realpath_cache_ttl=600 \n\
zend.enable_gc=On \n\
expose_php=Off \n\
max_execution_time=600 \n\
max_input_time=60 \n\
memory_limit=512M \n\
error_reporting=E_ALL & ~E_DEPRECATED & ~E_STRICT \n\
display_errors=On \n\
display_startup_errors=On \n\
log_errors=On \n\
log_errors_max_len=1024 \n\
ignore_repeated_errors=Off \n\
ignore_repeated_source=Off \n\
report_memleaks=On \n\
html_errors=Off \n\
variables_order="S" \n\
request_order="GP" \n\
register_argc_argv=On \n\
auto_globals_jit=On \n\
enable_post_data_reading=On \n\
post_max_size=64M \n\
include_path = ".:/usr/share/php7" \n\
enable_dl = Off \n\
file_uploads=On \n\
upload_max_filesize=100M \n\
max_file_uploads=20 \n\
allow_url_fopen=On \n\
allow_url_include=Off \n\
default_socket_timeout=60 \n\
[CLI Server] \n\
cli_server.color=On \n\
[Date] \n\
date.timezone=America/Chicago \n\
[ODBC] \n\
odbc.allow_persistent=On \n\
odbc.check_persistent=On \n\
odbc.max_persistent=-1 \n\
odbc.max_links=-1 \n\
odbc.defaultlrl=4096 \n\
odbc.defaultbinmode=1 \n\
[Interbase] \n\
ibase.allow_persistent=-1 \n\
[mysqlnd] \n\
mysqlnd.collect_statistics=Off \n\
mysqlnd.collect_memory_statistics=Off \n\
[PostgreSQL] \n\
pgsql.allow_persistent=On \n\
pgsql.auto_reset_persistent=On \n\
pgsql.max_persistent=-1 \n\
pgsql.max_links=-1 \n\
pgsql.ignore_notice=0 \n\
pgsql.log_notice=1 \n\
[bcmath] \n\
bcmath.scale=0 \n\
[Session] \n\
session.save_handler=files \n\
session.use_strict_mode=0 \n\
session.use_cookies=0 \n\
session.use_only_cookies=0\n\
session.name=PHPSESSID \n\
session.auto_start=-1\n\
session.serialize_handler = php \n\
session.gc_probability=1 \n\
session.gc_divisor=100 \n\
session.gc_maxlifetime=1440 \n\
session.cache_limiter=public \n\
session.cache_expire=180 \n\
session.use_trans_sid=0 \n\
[Assertion] \n\
zend.assertions=1 \n\
[Tidy] \n\
tidy.clean_output=Off \n\
[soap] \n\
soap.wsdl_cache_enabled=1 \n\
soap.wsdl_cache_dir="/tmp" \n\
soap.wsdl_cache_ttl=86400 \n\
soap.wsdl_cache_limit=5 \n\
[ldap] \n\
ldap.max_links=-1 \n\
[opcache] \n\
opcache.enable=1 \n\
opcache.enable_cli=1 \n\
opcache.optimization_level=15 \n\
opcache.opt_debug_level=0x20000 \n\
opcache.max_file_size=0 \n\
opcache.huge_code_pages=1 \n\
opcache.file_cache_consistency_checks=1 \n\
opcache.validate_permission=0 \n\
opcache.file_cache_only=0 \n\
opcache.file_cache=/quasar_source/var/opcache \n\
opcache.validate_timestamps=1 \n\
opcache.enable_file_override=1 \n\
opcache.revalidate_freq=0 \n\
opcache.revalidate_path=1 \n\
opcache.max_accelerated_files=50000 \n\
opcache.memory_consumption=64 \n\
opcache.max_wasted_percentage=15 \n\
opcache.interned_strings_buffer=16 \n\
opcache.fast_shutdown=1 \n\
' > /etc/php7/php.ini

RUN wget https://get.symfony.com/cli/installer -O - | bash
RUN mv /root/.symfony/bin/symfony /usr/local/bin/symfony
ENV PATH="$HOME/.symfony/bin:$PATH"

# ----------------------------------------------------------------------------------------------------------------
#  __
# /  ` __|__ __|__
# \__,   |     |
# ----------------------------------------------------------------------------------------------------------------
#RUN apk add --no-cache libc-dev \
# && apk add --no-cache libressl-dev \
# && apk add --no-cache gcc \
# && apk add --no-cache zlib-dev \
# && apk add --no-cache jpeg-dev \
# && apk add --no-cache boost-dev \
# && apk add --no-cache musl-dev \
# && apk add --no-cache cmake \
# && apk add --no-cache libev-dev \
# && apk add --no-cache linux-headers \
# && apk add --no-cache libtool \
# && apk add --no-cache libsodium-dev \
# && apk add --no-cache utomake

RUN rm /var/cache/apk/*

RUN apk add --no-cache shadow && adduser -S _www -u 1000 && groupadd _www


#https://stackoverflow.com/questions/49955097/how-do-i-add-a-user-when-im-using-alpine-as-a-base-image
#ENV USER=docker
#ENV UID=12345
#ENV GID=23456
#RUN addgroup --gid "$GID" "$USER" \
#    && adduser \
#    --disabled-password \
#    --gecos "" \
#    --home "$(pwd)" \
#    --ingroup "$USER" \
#    --no-create-home \
#    --uid "$UID" \
#    "$USER"


CMD ["bash", "/quasar_source/applications/asset_server/src/asset_server.sh"]
