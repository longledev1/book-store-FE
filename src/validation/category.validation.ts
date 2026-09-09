import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Tên danh mục không được để trống"),

  slug: z.string().trim().optional().or(z.literal("")),

  parentId: z.string().nullable().optional().or(z.literal("none")),

  status: z.union([z.literal(0), z.literal(1), z.literal("0"), z.literal("1")]),

  isVerified: z.union([
    z.literal(true),
    z.literal(false),
    z.literal("true"),
    z.literal("false"),
  ]),
});

export type CategoryFormInput = z.infer<typeof categorySchema>;
