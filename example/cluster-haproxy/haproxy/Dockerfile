FROM haproxy:1.6-alpine
COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg

# Install cURL
RUN apk add --update curl && \
  rm -rf /var/cache/apk/*
