FROM node:23.11.0-alpine

ENV NODE_VERSION=23.11.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN cp .env.dev .env

RUN npm run build

EXPOSE 3333

CMD ["npm", "run", "dev"]
