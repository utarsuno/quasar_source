# https://hub.docker.com/_/nginx/
FROM nginx:1.17.2-alpine

RUN apk add --no-cache bash bash-completion \
 && mkdir /etc/nginx/qs \
 && rm /etc/nginx/conf.d/default.conf;

COPY ./applications/nginx/includes /etc/nginx/qs

RUN set -x ; \
  addgroup -g 82 -S www-data ; \
  adduser -u 82 -D -S -G www-data www-data && exit 0 ; exit 1

CMD ["nginx", "-g", "daemon off;"]
