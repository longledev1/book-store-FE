import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Mail, Send, ArrowLeft } from "lucide-react";

import { FormInput } from "../../ui/FormFields";

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
  onSuccess?: (data: any) => void;
}

export default function ForgotPasswordForm({ onSwitchToLogin, onSuccess }: ForgotPasswordFormProps) {
  const methods = useForm({
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = (data: any) => {
    console.log("Forgot password data:", data);
    if (onSuccess) onSuccess(data);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <h3 className="text-xl md:text-2xl font-extrabold text-neutral-dark tracking-tight">
          Quên Mật Khẩu?
        </h3>
        <p className="text-xs text-slate-400 font-medium leading-relaxed">
          Nhập email liên kết của bạn, chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu.
        </p>
      </div>

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
            className="w-full py-3.5 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md cursor-pointer hover:shadow-lg active:scale-[0.98] select-none uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <span>Gửi mã khôi phục</span>
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </form>
      </FormProvider>

      {/* Back to login option */}
      <div className="pt-2 text-center border-t border-slate-100">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer select-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Đăng nhập</span>
        </button>
      </div>
    </div>
  );
}
