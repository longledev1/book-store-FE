import React, { useState } from "react";
import { Mail, Send, ArrowLeft, CheckCircle } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormInput } from "../../ui/FormFields";
import { forgotPasswordAPI } from "@/services/auth.service";
import { forgotPasswordSchema } from "@/validation/auth.validation";

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

export default function ForgotPasswordForm({
  onSwitchToLogin,
}: ForgotPasswordFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const methods = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setApiError(null);

    try {
      const response = await forgotPasswordAPI({
        email: data.email,
      });

      console.log("Forgot password thành công:", response);

      // Gửi email thành công → chuyển sang UI thông báo
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Forgot password thất bại:", error);

      const apiMessage = error?.response?.data?.message;

      if (Array.isArray(apiMessage)) {
        setApiError(apiMessage.join(". "));
      } else if (typeof apiMessage === "string") {
        setApiError(apiMessage);
      } else {
        setApiError("Không thể gửi email khôi phục. Vui lòng thử lại!");
      }
    }
  };

  // ==========================================
  // GỬI EMAIL THÀNH CÔNG
  // ==========================================
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-5 py-6 text-center font-sans select-none">
        {/* Success Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-500 shadow-sm">
          <CheckCircle className="h-8 w-8" />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h3 className="text-neutral-dark text-xl font-extrabold tracking-tight">
            Kiểm tra email của bạn
          </h3>

          <p className="max-w-xs text-xs leading-relaxed font-medium text-slate-400">
            Chúng tôi đã gửi liên kết khôi phục mật khẩu đến email của bạn. Vui
            lòng kiểm tra hộp thư và làm theo hướng dẫn để đặt lại mật khẩu.
          </p>
        </div>

        {/* Back to Login */}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="bg-primary hover:bg-blue-650 w-full cursor-pointer rounded-2xl py-3.5 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
        >
          Quay lại đăng nhập
        </button>
      </div>
    );
  }

  // ==========================================
  // FORM FORGOT PASSWORD
  // ==========================================
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="space-y-1.5 text-center">
        <h3 className="text-neutral-dark text-xl font-extrabold tracking-tight md:text-2xl">
          Quên Mật Khẩu?
        </h3>

        <p className="text-xs leading-relaxed font-medium text-slate-400">
          Nhập email liên kết với tài khoản của bạn, chúng tôi sẽ gửi hướng dẫn
          khôi phục mật khẩu.
        </p>
      </div>

      {/* API Error */}
      {apiError && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-3.5 text-left text-xs font-semibold text-rose-600">
          {apiError}
        </div>
      )}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="email"
            type="email"
            label="Email khôi phục"
            placeholder="name@example.com"
            icon={Mail}
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-2xl bg-[#0F172A] py-3.5 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all select-none hover:bg-slate-800 hover:shadow-lg active:scale-[0.98]"
          >
            <span>Gửi liên kết khôi phục</span>

            <Send className="h-3.5 w-3.5 text-white" />
          </button>
        </form>
      </FormProvider>

      {/* Back to Login */}
      <div className="border-t border-slate-100 pt-2 text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="hover:text-primary inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-slate-500 transition-colors select-none"
        >
          <ArrowLeft className="h-3.5 w-3.5" />

          <span>Quay lại Đăng nhập</span>
        </button>
      </div>
    </div>
  );
}
