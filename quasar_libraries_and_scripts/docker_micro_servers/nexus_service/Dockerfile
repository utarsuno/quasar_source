# Update index of available packages.
RUN apk update
# Update the currently installed packages.
RUN apk upgrade
# Add bash package to the running system.
RUN apk add bash
# Install bash automatic command line completion.
RUN apk add bash-completion

# Install Python3.
RUN apk add --no-cache python3 && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --upgrade pip setuptools && \
    if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi && \
    if [[ ! -e /usr/bin/python ]]; then ln -sf /usr/bin/python3 /usr/bin/python; fi && \
    rm -r /root/.cache



Django==2.0.3
django-channels==0.7.0
django-htmlmin==0.10.0
django-websocket-redis==0.5.1