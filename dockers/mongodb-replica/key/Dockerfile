FROM alpine

RUN apk add --no-cache openssl

WORKDIR /keys

RUN test -f mongodb-keyfile || openssl rand -base64 756 > mongodb-keyfile \
    && chown 999:999 mongodb-keyfile \
    && chmod 400 mongodb-keyfile
