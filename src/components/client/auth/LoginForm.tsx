import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Mail, Lock } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormInput, FormCheckbox } from "../../ui/FormFields";

import { loginAPI, getProfileAPI } from "@/services/auth.service";

import { useAuthStore } from "@/stores/useAuthStore";
import { loginSchema } from "../../../validation/auth.validation";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
  onSuccess?: (data: any) => void;
}

export default function LoginForm({
  onSwitchToRegister,
  onSwitchToForgot,
  onSuccess,
}: LoginFormProps) {
  const login = useAuthStore((state) => state.login);
  const setUser = useAuthStore((state) => state.setUser);
  const [apiError, setApiError] = useState<string | null>(null);

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    try {
      const response = await loginAPI({
        email: data.email,
        password: data.password,
      });

      const accessToken = response.data.accessToken;

      login(accessToken);

      // GET PROFILE TEST
      const profile = await getProfileAPI();

      setUser(profile.data);

      console.log("Login thành công:", response);
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error: any) {
      console.error("Login thất bại:", error);
      const responseData = error?.response?.data;
      const apiMessage = responseData?.message;

      if (Array.isArray(apiMessage)) {
        setApiError(apiMessage.join(". "));
      } else if (typeof apiMessage === "string") {
        setApiError(apiMessage);
      } else {
        setApiError("Tài khoản hoặc mật khẩu không chính xác");
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="space-y-1.5 text-center">
        <h3 className="text-neutral-dark text-xl font-extrabold tracking-tight md:text-2xl">
          Đăng Nhập
        </h3>
        <p className="text-xs font-medium text-slate-400">
          Chào mừng quay trở lại với LuminaBook.
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
                className="text-primary cursor-pointer text-[11px] font-bold select-none hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>
          </div>

          {/* Submit Button (Primary Blue) */}
          <button
            type="submit"
            className="bg-primary hover:bg-blue-650 w-full cursor-pointer rounded-2xl py-3.5 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all select-none hover:shadow-lg active:scale-[0.98]"
          >
            Đăng nhập
          </button>
        </form>
      </FormProvider>

      {/* Switch link */}
      <div className="border-t border-slate-100 pt-2 text-center">
        <p className="text-xs font-medium text-slate-500">
          Chưa có tài khoản?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-primary cursor-pointer font-bold select-none hover:underline"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </div>
  );
}
