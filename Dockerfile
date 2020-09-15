FROM node:current-alpine

ARG BUILD_DATE
ARG VCS_REF
ARG VERSION
ARG INTVERSION
LABEL org.label-schema.build-date=$BUILD_DATE \
    org.label-schema.name="jschnabel/heimdall.js" \
    org.label-schema.description="heimdall.js container" \
    org.label-schema.url="https://joshua-schnabel.de" \
    org.label-schema.vcs-ref=$VCS_REF \
    org.label-schema.vcs-url="https://github.com/joshua-schnabel/heimdall.js/" \
    org.label-schema.vendor="Joshua Schnabel" \
    org.label-schema.version=$VERSION \
    org.label-schema.schema-version="1.0" \
    Maintainer="Joshua Schnabel <dev@joshua-schnabel.de>" \
    Description="heimdall.js container"

# Update packages and install packages 
RUN apk update && apk upgrade && \
    apk --no-cache add bash curl && \
    rm -rf /var/cache/apk/*

# Ensure www-data user exists
# 82 is the standard uid/gid for "www-data" in Alpine
RUN set -x ; \
    addgroup -g 82 -S www-data ; \
    adduser -u 82 -D -S -G www-data www-data && exit 0 ; exit 1

RUN mkdir /app && mkdir /app/config && mkdir /app/src && chown -R www-data /app

COPY ./src /app/src/

WORKDIR /app/src/
USER www-data

RUN ls

RUN npm install

ENV CONFIGDIR="/app/config/"

CMD ["npm", "start"]
