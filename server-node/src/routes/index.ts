import { Express } from 'express';

import tasksRoutes from './tasks';
import { AuthRoutes } from './auth';

export function InitializeAppRouter(app: Express) {
  app.use('/api/auth', AuthRoutes);
  app.use('/api/tasks', tasksRoutes);
}
