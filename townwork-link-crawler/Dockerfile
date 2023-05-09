# https://hub.docker.com/_/node
FROM node:18-alpine3.15

# Create and change to the app directory.
WORKDIR /app

# Install manually all the missing libraries
RUN apk update
RUN apk add chromium

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN chromium-browser --version    

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy local code to the container image.
COPY . ./

RUN npm run build

CMD ["npm", "start"];