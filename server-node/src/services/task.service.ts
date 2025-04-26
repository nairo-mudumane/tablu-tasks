import { EnumTaskStatus, Task } from '../generated/prisma';
import { prisma } from '../lib/prisma';
import { CreateTaskDto, UpdateTaskDto } from '../@types/create.dto';

export const createTask = async (data: CreateTaskDto): Promise<Task> => {
  return prisma.task.create({
    data: { ...data, user_id: Number(data.user_id) },
  });
};

export const getTasks = async (
  userId: number,
  filters: {
    status?: EnumTaskStatus;
    sortBy?: 'created_at' | 'due_date';
  },
): Promise<Task[]> => {
  return prisma.task.findMany({
    where: {
      user_id: userId,
      ...(filters.status && { status: filters.status }),
    },
    orderBy: filters.sortBy ? { [filters.sortBy]: 'asc' } : undefined,
  });
};

export const getTaskById = async (userId: number, taskId: number) => {
  return prisma.task.findFirst({
    where: { user: { id: userId }, id: taskId },
    include: { user: { select: { id: true, username: true, email: true } } },
  });
};

export const updateTask = async (
  id: number,
  data: UpdateTaskDto,
): Promise<Task> => {
  return prisma.task.update({
    where: { id },
    data: {
      ...data,
      ...(data.status === 'COMPLETED' && { completed_at: new Date() }),
    },
  });
};

export const deleteTask = async (id: number): Promise<void> => {
  await prisma.task.delete({ where: { id } });
};
