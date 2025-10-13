import { z } from 'zod';

export const getSigninSchema = () => {
  return z.object({
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits." }),
    password: z.string().min(8, { message: 'Password is required.' }),
    rememberMe: z.boolean().optional(),
  });
};
