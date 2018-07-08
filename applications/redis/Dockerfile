# Alpine linux with alpine installed.
FROM redis:alpine

# Update index of available packages, then update the currently installed packages.
RUN apk update && apk upgrade

# Add required tools and libraries.
RUN apk add --no-cache bash-completion

# Clear cache and create needed directories.
RUN rm -rf /var/cache/apk/* \
    && rm -rf /root/.cache/pip/*

# TODO:
#RUN sysctl -w net.core.somaxconn=65535
# TODO:
#https://github.com/antirez/redis/issues/3176
# TODO:
# https://raw.githubusercontent.com/antirez/redis/4.0/redis.conf

# Run redis.
#CMD ["redis-server"]
