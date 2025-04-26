import { Application, Router } from 'express';

import { AuthMiddleware } from '../middlewares/auth';
import { login } from '../controllers/auth/login';

const router = Router();
const { Public } = new AuthMiddleware();

router.use(Public as Application);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "default.user@tablu.tech"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: Returns JWT token
 *         content:
 *           application/json:
 *             example: { token: "jwt.token.here" }
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', login as Application);

export { router as AuthRoutes };
