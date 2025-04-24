FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN cp .env.dev .env

RUN npm run build

EXPOSE 3333

CMD ["npm", "start"]
