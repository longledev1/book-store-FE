import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Mail, Lock, User } from "lucide-react";

import { FormInput } from "../../ui/FormFields";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onSuccess?: (data: any) => void;
}

export default function RegisterForm({ onSwitchToLogin, onSuccess }: RegisterFormProps) {
  const methods = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = (data: any) => {
    console.log("Register submit data:", data);
    if (onSuccess) onSuccess(data);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <h3 className="text-xl md:text-2xl font-extrabold text-neutral-dark tracking-tight">
          Tạo Tài Khoản
        </h3>
        <p className="text-xs text-slate-400 font-medium">
          Đồng hành cùng cộng đồng tri thức số LuminaBook.
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="fullName"
            type="text"
            label="Họ và Tên"
            placeholder="Nguyễn Văn A"
            icon={User}
            required
          />

          <FormInput
            name="email"
            type="email"
            label="Địa chỉ Email"
            placeholder="name@example.com"
            icon={Mail}
            required
          />

          <FormInput
            name="password"
            type="password"
            label="Mật khẩu"
            placeholder="••••••••"
            icon={Lock}
            required
          />

          {/* Submit Button (Primary Blue) */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-primary hover:bg-blue-650 text-white font-bold text-xs transition-all shadow-md cursor-pointer hover:shadow-lg active:scale-[0.98] select-none uppercase tracking-wider"
          >
            Đăng ký tài khoản
          </button>
        </form>
      </FormProvider>

      {/* Switch link */}
      <div className="pt-2 text-center border-t border-slate-100">
        <p className="text-xs text-slate-500 font-medium">
          Nếu đã có tài khoản, vui lòng{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-bold text-primary hover:underline cursor-pointer select-none"
          >
            Đăng nhập
          </button>
        </p>
      </div>
    </div>
  );
}
