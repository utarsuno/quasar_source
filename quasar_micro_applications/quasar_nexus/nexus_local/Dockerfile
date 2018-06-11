FROM python:3.6-alpine

# Update index of available packages, then update the currently installed packages.
RUN apk update && apk upgrade

# Add required tools.
RUN apk add --no-cache libc-dev \
    && apk add --no-cache gcc \
    && apk add --no-cache bash \
    && apk add --no-cache bash-completion

# Django specific libraries needed.
RUN pip3 install --no-cache-dir Django==2.0.3 \
    && pip3 install --no-cache-dir django-channels==0.7.0 \
    && pip3 install --no-cache-dir django-htmlmin==0.10.0 \
    && pip3 install --no-cache-dir django-websocket-redis==0.5.1

# Clear other cache that got missed.
RUN rm -rf /var/cache/apk/* \
    && rm -rf /root/.cache/pip/*

# Create the Quasar directory.
RUN mkdir ./quasar

# Copy the Nexus local project.
#COPY . /quasar

# Set the directory to the project directory.
WORKDIR ./quasar
