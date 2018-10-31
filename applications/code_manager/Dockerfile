# Alpine linux with Python 3.6 installed.
FROM python:3.6-alpine

RUN apk update && apk upgrade

# Add required tools.
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
 && apk add openssl-dev \
 # Update pip3.
 && pip3 install --upgrade pip \
 # Libraries for universal code.
 && pip3 install --no-cache-dir lazyme \
 # Libraries for code_api.
 && pip3 install --no-cache-dir csscompressor \
 && pip3 install --no-cache-dir jsmin \
 && pip3 install --no-cache-dir pillow \
 && pip3 install --no-cache-dir htmlmin \
 && pip3 install --no-cache-dir requests \
 # For JS minification.
 && apk add --update --no-cache nodejs \
 && apk add --update --no-cache nodejs-npm \
 # For convience.
 && apk add --no-cache git \
 && apk add --no-cache bash \
 && apk add --no-cache bash-completion

# Build websockets C++ files.
#COPY ./scripts/docker/build_process_steps/amqp.sh /var/cache/amqp.sh
#RUN bash /var/cache/amqp.sh

# Build babel-minify (for js minification) and build shader builders.
COPY ./scripts/docker/build_process_steps/babel_minify.sh /var/cache/babel_minify.sh
COPY ./scripts/docker/build_process_steps/shaders.sh /var/cache/shaders.sh

RUN bash /var/cache/babel_minify.sh \
 && bash /var/cache/shaders.sh \
 # Cleanup steps.
 && rm -rf /var/cache/apk/* \
 && rm -rf /root/.cache/pip/* \
 && rm /var/cache/babel_minify.sh \
 && rm /var/cache/shaders.sh

CMD ["python3", "/quasar/applications/code_manager/layer_applications/nexus_local_build_process.py"]
