# Alpine linux with Python 3.6 installed.
FROM rabbitmq:alpine

RUN apk update && apk upgrade

RUN apk add --no-cache python3 && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --upgrade pip setuptools

RUN pip3 install --no-cache-dir lazyme \
 && pip3 install --no-cache-dir pika


# ------------------------------------Quasar Application Universal Setup Steps--------------------------------------------------
COPY ./scripts/docker/quasar_application_setup_steps.sh /var/cache/quasar_application_setup_steps.sh
RUN ash /var/cache/quasar_application_setup_steps.sh "false" "null"
# ------------------------------------------------------------------------------------------------------------------------------

EXPOSE 5672/tcp 15672/tcp

#CMD ["python3", "/quasar/applications/nexus_server/receive.py"]
CMD ["python3", "/quasar/applications/nexus_server_temp/receive.py"]
