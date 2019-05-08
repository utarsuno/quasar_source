# Alpine linux with Python 3.6 installed.
FROM rabbitmq:alpine

RUN apk update \
  && apk upgrade \
  && apk add --no-cache python3 \
  && python3 -m ensurepip \
  && rm -r /usr/lib/python*/ensurepip \
  && pip3 install --upgrade pip setuptools \
  && pip3 install --no-cache-dir lazyme \
  && pip3 install --no-cache-dir pika \
  && pip3 install --no-cache-dir requests \
  && pip3 install --no-cache-dir mysql-connector-python \
  && apk add --no-cache bash \
  && apk add --no-cache bash-completion \
  && rm -rf /var/cache/apk/*

EXPOSE 5672/tcp 15672/tcp

CMD ["python3", "/quasar_source/applications/nexus_db/nexus_db.py"]
#CMD ["sleep", "90m"]
