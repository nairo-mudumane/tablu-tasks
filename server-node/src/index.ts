import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import { ENV } from './lib/dotenv';
// import { prisma } from "./lib/prisma";

const app = express();
const PORT = ENV.PORT;
const allowedOrigins =
  ENV.NODE_ENV === 'prod' ? ENV.ALLOWED_ORIGINS.split(',') : ['*'];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// prisma.$connect().then(() => console.log("connected to prisma database"));

// prisma.user.findMany().then((users) => console.log({ users }));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server running on ${ENV.PORT}`);
});
