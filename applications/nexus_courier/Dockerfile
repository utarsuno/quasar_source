FROM alpine

RUN apk update && apk upgrade

RUN apk add --no-cache libc-dev \
 && apk add --no-cache build-base \
 && apk add --no-cache libressl-dev \
 && apk add --no-cache zlib-dev \
 && apk add --no-cache boost-dev \
 && apk add --no-cache musl-dev

# apk add --no-cache libc6-compat \

#RUN apk add -U apk-tools-static busybox-static
#RUN apk.static upgrade —no-self-upgrade -U -a

#RUN apk add --update --no-cache build-base \
# && apk add --update --no-cache git \
# && apk add --update --no-cache unixodbc-dev \
# && apk add --update --no-cache cmake \
# && apk add --update --no-cache linux-headers \
# && apk add --update --no-cache libc6-compat \
# && apk add --update --no-cache build-base \
# && apk add --update --no-cache libressl-dev \
# && apk add --update --no-cache zlib-dev \
# && apk add --update --no-cache boost-dev \
# && apk add --update --no-cache qt-dev \
# && apk add --update --no-cache musl-dev \
# && apk add --update --no-cache musl \
# && apk add --update --no-cache libuv \
# && apk add --update --no-cache libstdc++

#RUN apk --update add --no-cache g++

# Python3.
RUN apk add --no-cache python3 && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --upgrade pip setuptools

RUN pip3 install --no-cache-dir lazyme \
 && pip3 install --no-cache-dir pika \
 && pip3 install --no-cache-dir requests

RUN apk add --no-cache libevent-dev


RUN apk add --no-cache bash \
 && apk add --no-cache bash-completion \
 && rm -rf /var/cache/apk/*


COPY ./libraries/pre_compiled/libamqpcpp.so.3.1 /usr/lib/libamqpcpp.so.3.1

#COPY ./scripts/docker/build_process_steps/amqp.sh /var/cache/amqp.sh
#RUN bash /var/cache/amqp.sh

#RUN rm /var/cache/amqp.sh

#CMD ["/quasar/generated_output/websocket_server/websocket_server"]
CMD ["bash", "/quasar/scripts/docker/run_nexus_courier.sh"]
#CMD ["sleep", "10m"]
