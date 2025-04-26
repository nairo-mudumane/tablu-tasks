import { Application, Router } from 'express';
import * as taskController from '../controllers/tasks';
import { AuthMiddleware } from '../middlewares/auth';

const router = Router();
const { Private } = new AuthMiddleware();

router.use(Private as Application);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create task
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, example: "Buy groceries" }
 *               description: { type: string, example: "Milk, eggs, bread" }
 *               due_date: { type: string, example: "2023-12-31" }
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', taskController.createTask as Application);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get tasks
 *     parameters:
 *       - name: status
 *         in: query
 *         schema: { type: string, enum: [pending, in_progress, completed] }
 *       - name: sortBy
 *         in: query
 *         schema: { type: string, enum: [created_at, due_date] }
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', taskController.getTasks as Application);

router.get('/:taskId', taskController.getTasks as Application);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update task
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               status: { type: string, enum: [pending, in_progress, completed] }
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/:taskId', taskController.updateTask as Application);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete task
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       204:
 *         description: Deleted
 */
router.delete('/:taskId', taskController.deleteTask as Application);

export default router;
