FROM alpine:3.7

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




# Alpine is lightweight and potentially more secure (compared to something like Ubuntu).
#FROM alpine:3.6

# Update the index.
#RUN apk update

# Install Python3.
#RUN apk add --no-cache python3 && \
#    python3 -m ensurepip && \
#    rm -r /usr/lib/python*/ensurepip && \
#    pip3 install --upgrade pip setuptools && \
#    if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi && \
#    rm -r /root/.cache

# Update pip3 to prevent library installation issues.
#RUN pip3 install --upgrade pip

# Install the Python3 librares needed.
#RUN pip3 install -r /quasar_source/docker_related/requirements.txt

#COPY . /quasar_source/python_source_code

# Make sure script files are runnable.
#RUN chmod +x /quasar_source/python_source_code/docker_related/run_all_unit_tests.sh

#CMD ["/quasar_source/python_source_code/docker_related/run_all_unit_tests.sh"]


