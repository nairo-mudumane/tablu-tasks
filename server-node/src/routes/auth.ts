import { Router } from 'express';

import { AuthMiddleware } from '../middlewares/auth';
import { login } from '../controllers/auth/login';

const router = Router();
const { Public } = new AuthMiddleware();

router.use(Public);

router.post('/login', login);

export { router as AuthRoutes };
