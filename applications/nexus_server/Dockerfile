# Alpine linux with Python 3.6 installed.
FROM rabbitmq:alpine

RUN apk update && apk upgrade

RUN apk add --no-cache python3 && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --upgrade pip setuptools

RUN pip3 install --no-cache-dir lazyme \
 && pip3 install --no-cache-dir pika \
 && pip3 install --no-cache-dir requests



# ------------------------------------Quasar Application Universal Setup Steps--------------------------------------------------
COPY ./scripts/docker/quasar_application_setup_steps.sh /var/cache/quasar_application_setup_steps.sh
RUN ash /var/cache/quasar_application_setup_steps.sh "false" "null"
# ------------------------------------------------------------------------------------------------------------------------------

#CMD ["python3", "/quasar/applications/code_manager/layer_applications/nexus_local_builder.py"]
#CMD ["echo", "HELLO_WORLD!"]

EXPOSE 5672/tcp 15672/tcp

CMD ["python3", "/quasar/applications/nexus_server/receive.py"]
#CMD ["bash", "/quasar/scripts/docker/run_websocket_server.sh"]
