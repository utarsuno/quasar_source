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
    && pip3 install --no-cache-dir Django \
    && pip3 install --no-cache-dir channels \
    && pip3 install --no-cache-dir -U Twisted[http2] \
    && pip3 install --no-cache-dir channels_redis \
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
    && mkdir ./assets \
    && mkdir ./assets/third_party

# Run the launch script.
CMD ["/quasar/scripts/nexus/run_local_nexus_on_docker.sh"]
