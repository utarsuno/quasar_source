FROM jenkins/jenkins:lts

# TODO: Distributed builds plugin
# RUN /usr/local/bin/install-plugins.sh ssh-slaves

# maybe TODO: install Notifications and Publishing plugins
# RUN /usr/local/bin/install-plugins.sh email-ext
# RUN /usr/local/bin/install-plugins.sh mailer
# RUN /usr/local/bin/install-plugins.sh slack

# UI
RUN /usr/local/bin/install-plugins.sh greenballs
RUN /usr/local/bin/install-plugins.sh cloudbees-folder
RUN /usr/local/bin/install-plugins.sh dashboard-view
# Eventually TODO:
# RUN /usr/local/bin/install-plugins.sh simple-theme-plugin

# Functionality.
RUN /usr/local/bin/install-plugins.sh workflow-aggregator
RUN /usr/local/bin/install-plugins.sh performance

# TODO: Investigate later.
#RUN /usr/local/bin/install-plugins.sh kubernetes

#COPY executors.groovy /usr/share/jenkins/ref/init.groovy.d/executors.groovy
COPY ./applications/jenkins/executors.groovy /usr/share/jenkins/ref/init.groovy.d/executors.groovy

USER root
# Update then install Maven.
RUN apt-get update \
 && apt-get install -y maven \
# Create directory for logging.
 && mkdir /var/log/jenkins \
 && chown -R jenkins:jenkins /var/log/jenkins
USER jenkins


# Default values.
# TODO: CURRENTLY SET IN DOCKER COMPOSE, THUS REMOVE THESE LINES!!
# 4GB memory.
#ENV JAVA_OPTS="-Xmx4096m"
#ENV JENKINS_OPTS="--logfile=/var/log/jenkins/jenkins.log"



