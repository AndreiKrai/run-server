import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
  name: z.string().optional()
});

export type RegisterInput = z.infer<typeof registerSchema>;

export interface RegisterResponse {
  user: {
    id: number;
    email: string;
    name: string | null;
  };
}

export type UserCreateInput = z.infer<typeof registerSchema>;