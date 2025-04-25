FROM node:20.16-alpine3.19 AS builder
FROM builder AS dev

WORKDIR /node

COPY package*.json ./
COPY . .

RUN npm install

WORKDIR /node/app

CMD ["npm", "run", "dev"]

# Production stage
FROM builder AS prod

WORKDIR /build

COPY package*.json ./

RUN npm lint:ts
RUN npm install  && npm cache clean --force

COPY . .

EXPOSE 3333

CMD ["npm", "run", "start"]
