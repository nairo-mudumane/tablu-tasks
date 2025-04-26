import { Request, Response } from 'express';
import { z } from 'zod';

import { publishTaskEvent } from '../queues/task.queue';
import { prisma } from '../lib/prisma';
import { CreateTaskSchema, UpdateTaskSchema } from '../schemas/tasks';
import { EnumTaskStatus } from '../generated/prisma';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { user, body } = req;

    const data = CreateTaskSchema.parse(body);

    const task = await prisma.task.create({
      data: { ...data, user_id: Number(user.id) },
    });

    await publishTaskEvent('TASK_CREATED', JSON.stringify(task));
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  const taskQuerySchema = z.object({
    status: z.nativeEnum(EnumTaskStatus).optional(),
    sortBy: z.enum(['created_at', 'due_date']).optional(),
  });

  try {
    const { sortBy, status } = taskQuerySchema.parse(req.query);

    const tasks = await prisma.task.findMany({
      where: status ? { status } : undefined,
      orderBy:
        sortBy === 'created_at' ? { created_at: 'desc' } : { due_date: 'desc' },
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { status, ...payload } = UpdateTaskSchema.parse(req.body);

    const task = await prisma.task.findFirst({
      where: { id: Number(req.params.taskId) },
    });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    const updated = await prisma.task.update({
      data: { ...payload, id: task.id, status },
      where: { id: task.id },
    });

    if (status) await publishTaskEvent('TASK_UPDATED', JSON.stringify(updated));
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    await publishTaskEvent(
      'TASK_DELETED',
      JSON.stringify({ id: Number(req.params.id) }),
    );
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
