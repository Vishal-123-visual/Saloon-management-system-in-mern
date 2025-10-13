import { z } from "zod";

export const addCustomerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone must be at most 15 digits")
    .regex(/^\d+$/, "Phone must contain only numbers"),
  email: z.string().optional(),
  city: z.string().optional(),
  street: z.string().optional(),
  postCode: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});


