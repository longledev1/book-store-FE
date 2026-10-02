import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Mail, Lock, Fingerprint } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { startAuthentication } from "@simplewebauthn/browser";

import { FormInput } from "../../ui/FormFields";

import { loginAPI, getProfileAPI } from "@/services/auth.service";
import {
  getWebAuthnLoginChallengeAPI,
  verifyWebAuthnLoginAPI,
} from "@/services/webauthn.service";

import { API_BASE_URL } from "@/config/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "@/stores/useToastStore";
import { loginSchema } from "../../../validation/auth.validation";
import { cn } from "@/lib/utils";

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
  const [isWebAuthnLoading, setIsWebAuthnLoading] = useState(false);
  const [isEmailHighlighted, setIsEmailHighlighted] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const emailValue = methods.watch("email");

  // Tự động điền Email đăng nhập gần đây nhất nếu có
  useEffect(() => {
    const lastEmail = localStorage.getItem("luminabook_last_email");
    if (lastEmail) {
      methods.setValue("email", lastEmail);
    }
  }, [methods]);

  const handleWebAuthnLogin = async () => {
    const email = methods.getValues("email")?.trim();
    if (!email) {
      methods.setFocus("email");
      setIsEmailHighlighted(true);
      setTimeout(() => setIsEmailHighlighted(false), 2500);
      setApiError(null);
      return;
    }

    // Lưu lại email gần nhất
    localStorage.setItem("luminabook_last_email", email);
    setApiError(null);
    setIsWebAuthnLoading(true);
    try {
      toast.info("Đang kiểm tra thông tin Passkey...");
      const options = await getWebAuthnLoginChallengeAPI(email);

      // Kiểm tra xem tài khoản này đã từng đăng ký Passkey nào chưa
      if (!options.allowCredentials || options.allowCredentials.length === 0) {
        setApiError(
          `Tài khoản "${email}" chưa đăng ký Passkey / Vân tay. Vui lòng đăng nhập bằng Mật khẩu và vào Hồ sơ cá nhân để cài đặt.`
        );
        return;
      }

      const authResponse = await startAuthentication(options);
      const res = await verifyWebAuthnLoginAPI(email, authResponse, options.challenge);

      const accessToken = res.accessToken || res.data?.accessToken;
      if (!accessToken) {
        throw new Error("Không nhận được token xác thực");
      }

      login(accessToken);
      const profile = await getProfileAPI();
      setUser(profile.data);
      toast.success("Đăng nhập bằng Passkey / Vân tay thành công!");
      if (onSuccess) {
        onSuccess(res);
      }
    } catch (err: any) {
      console.error("Lỗi đăng nhập Passkey:", err);
      const rawMsg = err?.response?.data?.message || err?.message;
      let msg = typeof rawMsg === "string" ? rawMsg : "Đăng nhập Passkey thất bại";
      if (
        msg.includes("chưa đăng ký") ||
        msg.includes("The operation failed") ||
        msg.includes("No credentials") ||
        msg.includes("not found")
      ) {
        msg = `Tài khoản "${email}" chưa đăng ký Passkey / Vân tay trên thiết bị này. Vui lòng đăng nhập bằng Mật khẩu và vào Hồ sơ để kích hoạt.`;
      }
      setApiError(msg);
    } finally {
      setIsWebAuthnLoading(false);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    try {
      const response = await loginAPI({
        email: data.email,
        password: data.password,
      });

      // Lưu lại email vừa đăng nhập thành công
      localStorage.setItem("luminabook_last_email", data.email.trim());

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
            className={cn(
              isEmailHighlighted &&
                "ring-2 ring-amber-400 border-amber-400 bg-amber-50/30 animate-pulse transition-all"
            )}
            helperText={
              isEmailHighlighted
                ? "Vui lòng nhập Địa chỉ Email tại đây để đăng nhập Vân tay / Passkey"
                : undefined
            }
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

      {/* Divider & Social / WebAuthn Login */}
      <div className="relative my-2 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200/80" />
        </div>
        <span className="relative bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Hoặc
        </span>
      </div>

      <div className="space-y-2.5">
        <button
          type="button"
          onClick={handleWebAuthnLogin}
          disabled={isWebAuthnLoading}
          className={cn(
            "w-full flex items-center justify-center gap-2.5 rounded-2xl border py-3 text-xs font-bold transition-all cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 shadow-2xs",
            emailValue?.trim()
              ? "border-slate-800 bg-slate-900 text-white hover:bg-black shadow-md"
              : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
          )}
        >
          <Fingerprint
            className={cn(
              "w-4 h-4 shrink-0 transition-colors",
              emailValue?.trim() ? "text-emerald-400" : "text-slate-400"
            )}
          />
          <span>
            {isWebAuthnLoading
              ? "Đang quét sinh trắc học..."
              : emailValue?.trim()
              ? "Quét Vân tay / Passkey ngay"
              : "Đăng nhập bằng Passkey (Nhập Email trước)"}
          </span>
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer select-none active:scale-[0.98]"
        >
          <img src="/google-icon-logo.svg" alt="Google" className="w-4 h-4 shrink-0" />
          <span>Đăng nhập bằng Google</span>
        </button>
      </div>

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
