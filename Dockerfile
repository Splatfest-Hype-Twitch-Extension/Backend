FROM node:slim

USER node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 80
CMD [ "npm", "run", "dev" ]