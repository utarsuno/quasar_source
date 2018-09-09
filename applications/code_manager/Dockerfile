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
 && apk add openssl-dev

# Update pip3.
RUN pip3 install --upgrade pip
 # Libraries for universal code.
RUN pip3 install --no-cache-dir lazyme \
 # Libraries for code_api.
 && pip3 install --no-cache-dir csscompressor \
 && pip3 install --no-cache-dir jsmin \
 && pip3 install --no-cache-dir pillow \
 && pip3 install --no-cache-dir htmlmin \
 && pip3 install --no-cache-dir requests \
 # For JS minification.
 && apk add --update --no-cache nodejs \
 && apk add --update --no-cache nodejs-npm

RUN apk add --no-cache git \
 && apk add --no-cache bash \
 && apk add --no-cache bash-completion

# Build websockets C++ files.
#COPY ./scripts/docker/build_process_steps/build_amqp.sh /var/cache/build_amqp.sh
#RUN bash /var/cache/build_amqp.sh

# Build babel-minify.
COPY ./scripts/docker/build_process_steps/build_babel_minify.sh /var/cache/build_babel_minify.sh
RUN bash /var/cache/build_babel_minify.sh

# ------------------------------------Quasar Application Universal Setup Steps--------------------------------------------------
#COPY ./scripts/docker/quasar_application_setup_steps.sh /var/cache/quasar_application_setup_steps.sh
#RUN ash /var/cache/quasar_application_setup_steps.sh "false" minify
# ------------------------------------------------------------------------------------------------------------------------------

RUN rm -rf /var/cache/apk/* \
 && rm -rf /root/.cache/pip/* \
 && rm /var/cache/build_babel_minify.sh

#&& rm /var/cache/build_amqp.sh \

CMD ["python3", "/quasar/applications/code_manager/layer_applications/nexus_local_builder.py"]
