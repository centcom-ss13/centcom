FROM node:12

ARG port=80

WORKDIR /usr/src/app

COPY "./package*.json" ./

RUN npm install

COPY . .

RUN npm run build
