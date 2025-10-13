import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z
    .any()
    .refine((file) => file instanceof File, "Image is required")
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/jpg","image/webp"].includes(file.type),
      "Only jpg, jpeg, webp or png images are allowed"
    ),
});

