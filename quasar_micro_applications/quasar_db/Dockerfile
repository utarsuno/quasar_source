#FROM java:8-jre-alpine
FROM anapsix/alpine-java:8_jdk

# Update index of available packages, then update the currently installed packages.
RUN apk update && apk upgrade

# Add required tools then Python libraries.
RUN apk add --no-cache bash \
    && apk add --no-cache bash-completion

# Clear cache and create needed directories.
RUN rm -rf /var/cache/apk/* \
    && mkdir ./quasar \
    && mkdir ./quasar/source \
    && mkdir ~/Data \
    && mkdir ~/Data/Log \
    && mkdir ~/Data/Log/qdb

COPY ./qdb-1.0.0-SNAPSHOT.jar ./quasar/source/run.jar
COPY ./tmp ./quasar/source





#VOLUME /tmp
#ARG JAR_FILE
#ADD ${JAR_FILE} app.jar
#ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar", "--logging.config=/var/log/action-handler-sfs/logback.xml"]

