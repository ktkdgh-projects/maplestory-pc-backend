FROM arm64v8/mongo:6.0.23-jammy

ENV DOCKERIZE_VERSION v0.9.3

RUN apt-get update \
    && apt-get install -y wget \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/${DOCKERIZE_VERSION}/dockerize-linux-arm64-${DOCKERIZE_VERSION}.tar.gz | tar xzf - -C /usr/local/bin \
    && apt-get autoremove -yqq --purge wget \
    && rm -rf /var/lib/apt/lists/*

COPY ./replica.sh /replica.sh
CMD ["bash", "/replica.sh"]
