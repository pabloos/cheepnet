FROM node:latest

RUN mkdir -p /usr/src/cheepnet/
WORKDIR /usr/src/cheepnet/
COPY . .

RUN npm install
# CMD [ "npm", "start" ]