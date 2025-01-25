# Use the official Node.js image for the build stage
FROM node:16 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000


CMD [ "npm", "run" , "start" ]
