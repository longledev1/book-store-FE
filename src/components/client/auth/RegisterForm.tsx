import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Mail, Lock, User, CheckCircle } from "lucide-react";

import { FormInput } from "../../ui/FormFields";
import { registerAPI } from "@/services/auth.service";
import { registerSchema } from "@/validation/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";

interface RegisterFormData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({
  onSwitchToLogin,
}: RegisterFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      phone: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    try {
      const response = await registerAPI({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone,
      });

      console.log("Register thành công:", response);
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Register thất bại:", error);
      const responseData = error?.response?.data;
      const apiMessage = responseData?.message;

      if (Array.isArray(apiMessage)) {
        setApiError(apiMessage.join(". "));
      } else if (typeof apiMessage === "string") {
        setApiError(apiMessage);
      } else {
        setApiError("Đăng ký tài khoản thất bại. Vui lòng thử lại!");
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-5 py-6 font-sans select-none">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm animate-bounce">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-neutral-dark text-xl font-extrabold tracking-tight">
            Đăng ký thành công!
          </h3>
          <p className="text-xs font-medium text-slate-400 max-w-xs leading-relaxed">
            Tài khoản của bạn đã được tạo thành công trên LuminaBook. Hãy đăng nhập để bắt đầu khám phá thế giới tri thức.
          </p>
        </div>
        <button
          onClick={onSwitchToLogin}
          className="bg-primary hover:bg-blue-650 w-full cursor-pointer rounded-2xl py-3.5 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all select-none hover:shadow-lg active:scale-[0.98]"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="space-y-1.5 text-center">
        <h3 className="text-neutral-dark text-xl font-extrabold tracking-tight md:text-2xl">
          Tạo Tài Khoản
        </h3>
        <p className="text-xs font-medium text-slate-400">
          Đồng hành cùng cộng đồng tri thức số LuminaBook.
        </p>
      </div>

      {apiError && (
        <div className="bg-rose-50 text-rose-600 text-xs font-semibold p-3.5 rounded-2xl border border-rose-100/50 animate-pulse text-left">
          {apiError}
        </div>
      )}

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

          <FormInput
            name="phone"
            type="text"
            label="Số điện thoại"
            placeholder="0123456789"
            icon={User}
            required
          />
          {/* Submit Button (Primary Blue) */}
          <button
            type="submit"
            className="bg-primary hover:bg-blue-650 w-full cursor-pointer rounded-2xl py-3.5 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all select-none hover:shadow-lg active:scale-[0.98]"
          >
            Đăng ký tài khoản
          </button>
        </form>
      </FormProvider>

      {/* Switch link */}
      <div className="border-t border-slate-100 pt-2 text-center">
        <p className="text-xs font-medium text-slate-500">
          Nếu đã có tài khoản, vui lòng{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary cursor-pointer font-bold select-none hover:underline"
          >
            Đăng nhập
          </button>
        </p>
      </div>
    </div>
  );
}
