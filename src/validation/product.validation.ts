import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(1, "Tên sản phẩm không được để trống"),

  slug: z.string().trim().optional().or(z.literal("")),

  cost: z.union([z.number(), z.string()]).refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  }, { message: "Giá vốn phải là số dương hoặc bằng 0" }),

  price: z.union([z.number(), z.string()]).refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  }, { message: "Giá niêm yết phải là số dương hoặc bằng 0" }),

  finalPrice: z.union([z.number(), z.string()]).refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  }, { message: "Giá bán thực tế phải là số dương hoặc bằng 0" }),

  status: z.union([z.literal(0), z.literal(1), z.literal("0"), z.literal("1")]),

  isVerified: z.union([
    z.literal(true),
    z.literal(false),
    z.literal("true"),
    z.literal("false"),
  ]),

  describe: z.string().trim().optional().or(z.literal("")),

  shortDescribe: z.string().trim().optional().or(z.literal("")),

  stockQuantity: z.union([z.number(), z.string()]).optional().refine((val) => {
    if (val === undefined || val === "") return true;
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  }, { message: "Số lượng tồn kho phải là số nguyên dương" }),
});

export type ProductFormInput = z.infer<typeof productSchema>;
