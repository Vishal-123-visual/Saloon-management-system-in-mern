import { z } from "zod";

export const ProductSchema = z.object({
  serviceName: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Please select a category"),
  price: z.string().min(1, "Price is required").transform(val => Number(val)),
  discountPrice: z.string().min(1, "Discount price is required").transform(val => Number(val)),
  duration: z.string().min(1, "Duration is required").transform(val => Number(val)),
  image: z.any().optional(), // File | string
});
