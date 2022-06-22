FROM node:latest

WORKDIR /home/node/app
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

ENTRYPOINT [ "serve", "-s", "build", "-p", "3000" ]