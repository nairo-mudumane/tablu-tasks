import { Application, Router } from 'express';

import { AuthMiddleware } from '../middlewares/auth';
import { login } from '../controllers/auth/login';

const router = Router();
const { Public } = new AuthMiddleware();

router.use(Public as Application);

router.post('/login', login as Application);

export { router as AuthRoutes };
