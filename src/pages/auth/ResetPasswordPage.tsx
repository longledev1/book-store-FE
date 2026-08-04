import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";

import { FormInput } from "../../components/ui/FormFields";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "../../validation/auth.validation";
import { toast } from "../../stores/useToastStore";
import { resetPasswordAPI } from "@/services/auth.service";
export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const methods = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      toast.error("Liên kết đặt lại mật khẩu không hợp lệ.");
      return;
    }

    try {
      const response = await resetPasswordAPI({
        token,
        newPassword: data.password,
      });

      toast.success("Đặt lại mật khẩu thành công!");

      navigate("/");
    } catch (error: any) {
      console.error("Reset password thất bại:", error);

      const message =
        error?.response?.data?.message ||
        "Không thể đặt lại mật khẩu. Vui lòng thử lại.";

      toast.error(Array.isArray(message) ? message.join(". ") : message);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="space-y-1.5 text-center">
        <h3 className="text-neutral-dark text-xl font-extrabold tracking-tight md:text-2xl">
          Đặt lại mật khẩu
        </h3>
        <p className="text-xs font-medium text-slate-400">
          Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="password"
            type="password"
            label="Mật khẩu mới"
            placeholder="••••••••"
            icon={Lock}
            required
          />

          <FormInput
            name="confirmPassword"
            type="password"
            label="Xác nhận mật khẩu mới"
            placeholder="••••••••"
            icon={Lock}
            required
          />

          {/* Submit Button (Primary Blue) */}
          <button
            type="submit"
            className="bg-primary hover:bg-blue-650 w-full cursor-pointer rounded-2xl py-3.5 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all select-none hover:shadow-lg active:scale-[0.98]"
          >
            Đặt lại mật khẩu
          </button>
        </form>
      </FormProvider>

      {/* Back to Home Link */}
      <div className="border-t border-slate-100 pt-4 text-center">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="hover:text-slate-650 cursor-pointer text-xs font-bold text-slate-400 transition-colors select-none"
        >
          Quay lại Trang chủ
        </button>
      </div>
    </div>
  );
}
