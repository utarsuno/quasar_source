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
 && pip3 install --no-cache-dir pillow \
 && pip3 install --no-cache-dir requests \
 # For convience.
 && apk add --no-cache git \
 && apk add --no-cache bash \
 && apk add --no-cache bash-completion


# Babel minify.
RUN cd /usr/lib \
  && npm install babel-minify --save-dev \
  # Shaders.
#  && cd /usr/lib \
  && npm install glslify \
  && npm install glsl-film-grain \
  && npm install glsl-blend-soft-light \
  # Cleanup steps.
  && rm -rf /var/cache/apk/* \
  && rm -rf /root/.cache/pip/*


CMD ["python3", "/quasar_source/applications/code_manager/layer_applications/nexus_local_build_process.py"]
