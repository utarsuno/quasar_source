# Alpine is lightweight and potentially more secure (compared to something like Ubuntu).
FROM alpine:3.6

# Update the index.
RUN apk update

# Install Python3.
RUN apk add --no-cache python3 && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --upgrade pip setuptools && \
    if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi && \
    rm -r /root/.cache

# Update pip3 to prevent library installation issues.
RUN pip3 install --upgrade pip

# TODO : the line below
CMD ["ls"]