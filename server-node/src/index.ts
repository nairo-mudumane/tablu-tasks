import "dotenv/config";

import express from "express";
import cors from "cors";

import { ENV } from "./lib/dotenv";
import { connectToDatabase } from "./database/connection";
import { RabbitMQClient } from "./lib/rabbitmq";

const app = express();
const PORT = ENV.PORT;
const allowedOrigins =
  ENV.NODE_ENV === "prod" ? ENV.ALLOWED_ORIGINS.split(",") : ["*"];

connectToDatabase(async () => {
  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json());

  const rabbit = new RabbitMQClient();
  rabbit.send("test", JSON.stringify({ ok: true }));

  setTimeout(() => {
    rabbit.consume("test", async (newMsg) => {
      console.log({ newMsg });
    });
  }, 4000);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server running on ${ENV.PORT}`);
});
