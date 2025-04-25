import { Application, Router } from 'express';
import * as taskController from '../controllers/tasks';
import { AuthMiddleware } from '../middlewares/auth';

const router = Router();
const { Private } = new AuthMiddleware();

router.use(Private as Application);

router.post('/', taskController.createTask as Application);
router.get('/', taskController.getTasks as Application);
router.put('/:id', taskController.updateTask as Application);
router.delete('/:id', taskController.deleteTask as Application);

export default router;
