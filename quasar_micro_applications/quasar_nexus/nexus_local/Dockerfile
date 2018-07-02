# Alpine linux with Python 3.6 installed.
FROM python:3.6-alpine

# Update index of available packages, then update the currently installed packages.
RUN apk update && apk upgrade

# Add required tools then Python libraries.
RUN apk add --no-cache libc-dev \
    && apk add --no-cache gcc \
    && apk add --no-cache bash \
    && apk add --no-cache bash-completion \
    && apk add --no-cache zlib-dev \
    && apk add --no-cache jpeg-dev \
    # Libraries for Django + Django-websockets.
    && pip3 install --no-cache-dir Django==2.0.3 \
    && pip3 install --no-cache-dir django-channels==0.7.0 \
    && pip3 install --no-cache-dir django-websocket-redis==0.5.1 \
    # Libraries for universal code.
    && pip3 install --no-cache-dir lazyme \
    # Libraries for code_api.
    && pip3 install --no-cache-dir csscompressor \
    && pip3 install --no-cache-dir jsmin \
    && pip3 install --no-cache-dir pillow \
    && pip3 install --no-cache-dir htmlmin

# Clear cache and create needed directories.
RUN rm -rf /var/cache/apk/* \
    && rm -rf /root/.cache/pip/* \
    && mkdir ./quasar \
    && mkdir ./assets \
    && mkdir ./assets/js \
    && mkdir ./assets/js/third_party \
    && mkdir ./assets/js/third_party/javascript_cookies \
    && mkdir ./assets/js/third_party/graphics \
    && mkdir ./assets/js/third_party/graphics/shaders \
    && mkdir ./assets/js/third_party/graphics/post_processing \
    && mkdir ./assets/js/nexus/ \
    && mkdir ./assets/js/nexus/nexus \
    && mkdir ./assets/audio \
    && mkdir ./assets/favicon \
    && mkdir ./assets/shaders \
    && mkdir ./assets/shaders/film \
    && mkdir ./assets/shaders/glow \
    && mkdir ./assets/shaders/spritesheet \
    && mkdir ./assets/shaders/transition \
    && mkdir ./assets/texture \
    && mkdir ./assets/texture/spritesheet \
    && mkdir ./assets/texture/third_party \
    && mkdir ./assets/json \
    && mkdir ./assets/json/fonts

# Run Nexus Local.
CMD ["/quasar/source/scripts/nexus/run_local_nexus_on_docker.sh"]


# DEPRECATED CODE (preserved temporarily) :
# && pip3 install --no-cache-dir django-htmlmin==0.10.0 \

