import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(1, "Họ và tên không được để trống")
    .trim(),
  phone: z
    .string()
    .min(1, "Số điện thoại không được để trống")
    .regex(/^\d{10}$/, "Số điện thoại phải có đúng 10 chữ số")
    .trim(),
  address: z
    .string()
    .min(1, "Địa chỉ không được để trống")
    .trim(),
  avatarUrl: z
    .string()
    .trim()
    .url("Đường dẫn ảnh đại diện không đúng định dạng URL")
    .or(z.literal("")), // Cho phép để trống hoặc phải là URL hợp lệ
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
