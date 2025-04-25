import { Router } from 'express';
import * as taskController from '../controllers/tasks';
import { AuthMiddleware } from '../middlewares/auth';

const router = Router();
const { Private } = new AuthMiddleware();

router.use(Private);

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
