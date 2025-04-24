import "dotenv/config";

import express from "express";
import cors from "cors";

import { ENV } from "./lib/dotenv";

const app = express();
const PORT = ENV.PORT;
const allowedOrigins =
  ENV.NODE_ENV === "prod" ? ENV.ALLOWED_ORIGINS.split(",") : ["*"];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.all("/ping", (_req, res) => res.status(200).json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} - ${process.env.NODE_ENV}`);
});
