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

# ------------------------------------Quasar Application Universal Setup Steps--------------------------------------------------
COPY ./scripts/docker/quasar_application_setup_steps.sh /var/cache/quasar_application_setup_steps.sh
RUN ash /var/cache/quasar_application_setup_steps.sh false
# ------------------------------------------------------------------------------------------------------------------------------

CMD ["/quasar/generated_output/websocket_server/websocket_server"]
#CMD ["sleep", "10m"]