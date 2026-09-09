import { z } from "zod";

export const authorSchema = z.object({
  name: z
    .string()
    .min(1, "Tên tác giả không được để trống")
    .trim(),
  describe: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});

export type AuthorFormInput = z.infer<typeof authorSchema>;
