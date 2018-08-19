FROM alpine

RUN apk update && apk upgrade

RUN apk add --no-cache libc6-compat \
 && apk add --no-cache build-base \
 && apk add --no-cache libressl-dev \
 && apk add --no-cache zlib-dev

# ------------------------------------Quasar Application Universal Setup Steps--------------------------------------------------
COPY ./scripts/docker/quasar_application_setup_steps.sh /var/cache/quasar_application_setup_steps.sh
RUN ash /var/cache/quasar_application_setup_steps.sh false
# ------------------------------------------------------------------------------------------------------------------------------

CMD ["/quasar/generated_output/websocket_server/websocket_server"]
