import { z } from "zod";

export const getSignupSchema = () => {
  return z.object({
    name: z
      .string()
      .min(1, { message: "Name is required." }),

    email: z
      .string()
      .email({ message: "Please enter a valid email address." })
      .min(1, { message: "Email is required." }),

    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits." }),


    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      }),

    terms: z
      .boolean()
      .refine((val) => val === true, {
        message: "You must agree to the terms and conditions.",
      }),
  });
};
