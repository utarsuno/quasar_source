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
#    && pip3 install --no-cache-dir Django==2.0.3 \
#    && pip3 install --no-cache-dir django-channels==0.7.0 \
#    && pip3 install --no-cache-dir django-websocket-redis==0.5.1 \
    #&& pip3 install --no-cache-dir django-channels \
    #&& pip3 install --no-cache-dir django-websocket-redis \
    #&& pip3 install --no-cache-dir django-redis \
    #&& pip3 install --no-cache-dir channels_redis \

    && pip3 install --no-cache-dir Django \
    && pip3 install --no-cache-dir channels \
    && pip3 install --no-cache-dir -U Twisted[http2]



# Clear cache and create needed directories.
RUN rm -rf /var/cache/apk/* \
    && rm -rf /root/.cache/pip/* \

# Run Nexus Local.
#CMD ["/quasar/source/scripts/nexus/run_local_nexus_on_docker.sh"]

