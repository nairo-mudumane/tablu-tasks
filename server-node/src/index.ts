import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import { ENV } from './lib/dotenv';
import { connectToDatabase } from './database/connection';
import { InitializeAppRouter } from './routes';
import { checkForSeeds } from './database/seeds';

const app = express();
const PORT = ENV.PORT;
const allowedOrigins =
  ENV.NODE_ENV === 'prod' ? ENV.ALLOWED_ORIGINS.split(',') : ['*'];

connectToDatabase(async () => {
  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json());
  checkForSeeds();
  InitializeAppRouter(app);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server running on ${ENV.PORT}`);
});
