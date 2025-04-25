import { z } from 'zod';

export const JwtPayloadSchema = z.object({
  id: z.number({ required_error: 'O ID do usuário é obrigatório.' }),
});

export const CreateUserSchema = z.object({
  username: z.string({ required_error: 'O nome de usuário é obrigatório.' }),
  email: z
    .string({ required_error: 'O e-mail é obrigatório.' })
    .email({ message: 'O e-mail deve ser válido.' }),
  password: z.string({ required_error: 'A senha é obrigatória.' }),
});

export const LoginUserSchema = z.object({
  email: z
    .string({ required_error: 'O e-mail é obrigatório.' })
    .email({ message: 'O e-mail deve ser válido.' }),
  password: z.string({ required_error: 'A senha é obrigatória.' }),
});
