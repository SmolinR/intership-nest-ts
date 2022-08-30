FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

EXPOSE 3000 

COPY . .

RUN npx nest build

CMD [ "npm", "run", "start:prod" ]
