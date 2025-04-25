import { Request, Response } from 'express';

import { publishTaskEvent } from '../queues/task.queue';
import { prisma } from '../lib/prisma';
import { CreateTaskSchema } from '../schemas/tasks';
import { EnumTaskStatus } from '../generated/prisma';
import { CreatedAtFilter } from '../@types/create.dto';

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
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as EnumTaskStatus;
    const sortBy = req.query.sortBy as CreatedAtFilter;

    const tasks = await prisma.task.findMany({
      where: { status },
      orderBy:
        sortBy === 'created_at' ? { created_at: 'desc' } : { due_date: 'desc' },
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await prisma.task.findFirst({
      where: { id: Number(req.params.taskId) },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await publishTaskEvent('TASK_UPDATED', JSON.stringify(task));
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
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
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
