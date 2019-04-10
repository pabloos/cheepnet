FROM node:latest

ARG APP_DIR=/usr/src/cheepnet/

WORKDIR ${APP_DIR}
COPY . .

RUN npm install
CMD node index.js
# CMD [ "npm", "start" ]