FROM alpine

RUN apk update && apk upgrade \
 && apk add --no-cache libc-dev \
 && apk add --no-cache build-base \
 && apk add --no-cache libressl-dev \
 && apk add --no-cache zlib-dev \
 && apk add --no-cache boost-dev \
 && apk add --no-cache musl-dev \
 && apk add --no-cache python3 \
 && python3 -m ensurepip \
 && rm -r /usr/lib/python*/ensurepip \
 && pip3 install --upgrade pip setuptools \
 && pip3 install --no-cache-dir lazyme \
 && pip3 install --no-cache-dir pika \
 && pip3 install --no-cache-dir requests \
 && apk add --no-cache libevent-dev \
 # For convience.
 && apk add --no-cache bash \
 && apk add --no-cache bash-completion \
 && rm -rf /var/cache/apk/*

COPY ./generated_output/third_party_libraries/AMQP_CPP_3_1_0 /quasar_source/generated_output/third_party_libraries/AMQP_CPP_3_1_0
RUN cd /quasar_source/generated_output/third_party_libraries/AMQP_CPP_3_1_0 \
    && make \
    && make install

COPY ./libraries/pre_compiled/libamqpcpp.so.3.1 /usr/lib/libamqpcpp.so.3.1


#CMD ["/quasar/generated_output/websocket_server/websocket_server"]
CMD ["bash", "/quasar_source/scripts/docker/run_nexus_courier.sh"]
#CMD ["sleep", "10m"]
