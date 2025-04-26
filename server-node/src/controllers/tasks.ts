import { Request, Response } from 'express';
import { z, ZodError } from 'zod';

import { publishTaskEvent } from '../queues/task.queue';
import { CreateTaskSchema, UpdateTaskSchema } from '../schemas/tasks';
import { EnumTaskStatus } from '../generated/prisma';
import * as service from '../services/task.service';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { user, body } = req;
    const data = CreateTaskSchema.parse(body);
    const task = await service.createTask({
      ...data,
      user_id: Number(user.id),
    });

    await publishTaskEvent('TASK_CREATED', JSON.stringify(task));
    res.status(201).json(task);
  } catch (error) {
    if (error instanceof ZodError)
      return res
        .status(400)
        .json({ message: error.issues.map((i) => i.message).toString() });
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  const { user } = req;
  const taskQuerySchema = z.object({
    status: z.nativeEnum(EnumTaskStatus).optional(),
    sortBy: z.enum(['created_at', 'due_date']).optional(),
  });

  try {
    const { sortBy, status } = taskQuerySchema.parse(req.query);
    const tasks = await service.getTasks(user.id, { sortBy, status });

    res.status(200).json(tasks);
  } catch (error) {
    if (error instanceof ZodError)
      return res
        .status(400)
        .json({ message: error.issues.map((i) => i.message).toString() });
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { user, params } = req;
    const task = await service.getTaskById(user.id, Number(params.taskId));
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json(task);
  } catch (error) {
    if (error instanceof ZodError)
      return res
        .status(400)
        .json({ message: error.issues.map((i) => i.message).toString() });
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { user, params } = req;
    const { status, ...payload } = UpdateTaskSchema.parse(req.body);

    const task = await service.getTaskById(user.id, Number(params.taskId));
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const updated = await service.updateTask(task.id, {
      ...payload,
      user_id: user.id,
      status,
    });

    if (status) await publishTaskEvent('TASK_UPDATED', JSON.stringify(updated));
    res.status(200).json(updated);
  } catch (error) {
    if (error instanceof ZodError)
      return res
        .status(400)
        .json({ message: error.issues.map((i) => i.message).toString() });
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { user, params } = req;
    const task = await service.getTaskById(user.id, Number(params.taskId));
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await service.deleteTask(task.id);

    await publishTaskEvent(
      'TASK_DELETED',
      JSON.stringify({ id: Number(req.params.id) }),
    );
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
