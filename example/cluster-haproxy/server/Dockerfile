FROM node:6-alpine

# Set the work directory and add the project files to it
WORKDIR /opt/app
ADD . /opt/app

# Install cURL
RUN apk add --update curl && \
  rm -rf /var/cache/apk/*

# Environment variables

# Set the user as host's current user
RUN chown -Rf node:node /opt/app
USER node

# Install the dependencies
RUN npm install

# Expose the ports
EXPOSE 9999 5858

# Run run run
CMD npm start
