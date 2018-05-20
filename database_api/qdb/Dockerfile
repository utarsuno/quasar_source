FROM anapsix/alpine-java:8_jdk
VOLUME /tmp
ARG JAR_FILE
ADD ${JAR_FILE} app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar", "--logging.config=/var/log/action-handler-sfs/logback.xml"]