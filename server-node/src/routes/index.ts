import { Express } from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerConfig from '../lib/swagger';

import tasksRoutes from './tasks';
import { AuthRoutes } from './auth';

export function InitializeAppRouter(app: Express) {
  app.use(
    '/api',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    swaggerUI.serve,
    swaggerUI.setup(swaggerJSDoc(swaggerConfig)),
  );

  app.use('/api/auth', AuthRoutes);
  app.use('/api/tasks', tasksRoutes);
}
