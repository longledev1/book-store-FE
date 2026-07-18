import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Mail, Lock } from "lucide-react";

import { FormInput, FormCheckbox } from "../../ui/FormFields";

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
  onSuccess?: (data: any) => void;
}

export default function LoginForm({ onSwitchToRegister, onSwitchToForgot, onSuccess }: LoginFormProps) {
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  const onSubmit = (data: any) => {
    console.log("Login submit data:", data);
    if (onSuccess) onSuccess(data);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <h3 className="text-xl md:text-2xl font-extrabold text-neutral-dark tracking-tight">
          Đăng Nhập
        </h3>
        <p className="text-xs text-slate-400 font-medium">
          Chào mừng quay trở lại với LuminaBook.
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="email"
            type="email"
            label="Địa chỉ Email"
            placeholder="name@example.com"
            icon={Mail}
            required
          />

          <div className="space-y-2">
            <FormInput
              name="password"
              type="password"
              label="Mật khẩu"
              placeholder="••••••••"
              icon={Lock}
              required
            />
            
            {/* Forgot password button trigger */}
            <div className="text-right">
              <button
                type="button"
                onClick={onSwitchToForgot}
                className="text-[11px] font-bold text-primary hover:underline cursor-pointer select-none"
              >
                Quên mật khẩu?
              </button>
            </div>
          </div>

          <FormCheckbox
            name="rememberMe"
            label="Ghi nhớ đăng nhập trên thiết bị này"
          />

          {/* Submit Button (Primary Blue) */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-primary hover:bg-blue-650 text-white font-bold text-xs transition-all shadow-md cursor-pointer hover:shadow-lg active:scale-[0.98] select-none uppercase tracking-wider"
          >
            Đăng nhập
          </button>
        </form>
      </FormProvider>

      {/* Switch link */}
      <div className="pt-2 text-center border-t border-slate-100">
        <p className="text-xs text-slate-500 font-medium">
          Chưa có tài khoản?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-bold text-primary hover:underline cursor-pointer select-none"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </div>
  );
}
