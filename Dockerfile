FROM node:lts-alpine
RUN apk add git
WORKDIR /home/meshhouse/backend

ENV NPM_CONFIG_LOGLEVEL verbose
CMD ["sh", "-c", "npm install && npm rebuild sharp && npm rebuild sqlite3 && npm rebuild phc-argon2 && node ace serve --watch"]
