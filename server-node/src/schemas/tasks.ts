import { z } from 'zod';

import { EnumPriority, EnumTaskStatus } from '../generated/prisma';

export const CreateTaskSchema = z.object({
  title: z.string({ required_error: 'O título é obrigatório.' }),
  description: z.string().optional(),
  due_date: z
    .date({
      invalid_type_error: 'A data de vencimento deve ser uma data válida.',
    })
    .optional(),
  priority: z
    .nativeEnum(EnumPriority, {
      invalid_type_error: 'A prioridade deve ser um valor válido.',
    })
    .optional(),
  status: z
    .nativeEnum(EnumTaskStatus, {
      invalid_type_error: 'O status deve ser um valor válido.',
    })
    .optional(),
});

export const UpdateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  due_date: z
    .union([
      z.date({
        invalid_type_error: 'A data de vencimento deve ser uma data válida.',
      }),
      z.null(),
    ])
    .optional(),
  priority: z
    .nativeEnum(EnumPriority, {
      invalid_type_error: 'A prioridade deve ser um valor válido.',
    })
    .optional(),
  status: z
    .nativeEnum(EnumTaskStatus, {
      invalid_type_error: 'O status deve ser um valor válido.',
    })
    .optional(),
});

export const TaskFilterOptionsSchema = z.object({
  status: z
    .nativeEnum(EnumTaskStatus, {
      invalid_type_error: 'O status deve ser um valor válido.',
    })
    .optional(),
  sortBy: z
    .enum(['created_at', 'due_date'], {
      invalid_type_error:
        'O campo de ordenação deve ser \'created_at\' ou \'due_date\'.',
    })
    .optional(),
  page: z
    .number({ invalid_type_error: 'A página deve ser um número.' })
    .optional(),
  limit: z
    .number({ invalid_type_error: 'O limite deve ser um número.' })
    .optional(),
});
