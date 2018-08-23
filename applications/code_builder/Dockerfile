# Alpine linux with Python 3.6 installed.
FROM python:3.6-alpine

RUN apk update && apk upgrade

# Add required tools then Python libraries.
RUN apk add --no-cache libc-dev \
 && apk add --no-cache gcc \
 && apk add --no-cache zlib-dev \
 && apk add --no-cache jpeg-dev

# Update pip3.
RUN pip3 install --upgrade pip
 # Libraries for universal code.
RUN pip3 install --no-cache-dir lazyme \
 # Libraries for code_api.
 && pip3 install --no-cache-dir csscompressor \
 && pip3 install --no-cache-dir jsmin \
 && pip3 install --no-cache-dir pillow \
 && pip3 install --no-cache-dir htmlmin

# ------------------------------------Quasar Application Universal Setup Steps--------------------------------------------------
COPY ./scripts/docker/quasar_application_setup_steps.sh /var/cache/quasar_application_setup_steps.sh
RUN ash /var/cache/quasar_application_setup_steps.sh false
# ------------------------------------------------------------------------------------------------------------------------------

CMD ["python3", "/quasar/applications/code_builder/build_nexus_local.py"]
