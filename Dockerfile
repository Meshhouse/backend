FROM node:lts-alpine
WORKDIR /usr/src/app

ENV NPM_CONFIG_LOGLEVEL verbose
CMD ["sh", "-c", "npm install && npm rebuild sharp && npm rebuild sqlite3 && npm rebuild phc-argon2 && node ace serve --watch"]
