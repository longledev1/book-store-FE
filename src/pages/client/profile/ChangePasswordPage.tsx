import React, { useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "@/stores/useToastStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { forgotPasswordAPI } from "@/services/auth.service";

export default function ChangePasswordPage() {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);

  const handleSendResetEmail = async () => {
    if (!user?.email) {
      toast.error("Không tìm thấy thông tin email người dùng");
      return;
    }

    setLoading(true);
    try {
      await forgotPasswordAPI({ email: user.email });
      toast.success(`Đã gửi liên kết đổi mật khẩu tới email ${user.email}`);
    } catch (err: any) {
      console.error("Lỗi gửi email đổi mật khẩu:", err);
      toast.error(
        err?.response?.data?.message || "Không thể gửi email đổi mật khẩu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm sm:p-8 text-left font-sans">
      {/* Title */}
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-black tracking-tight text-slate-800 uppercase sm:text-lg flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-primary" />
          <span>Đổi mật khẩu</span>
        </h3>
        <p className="mt-1 text-xs font-semibold text-slate-400">
          Bảo mật tài khoản của bạn bằng cách cập nhật mật khẩu định kỳ.
        </p>
      </div>

      <div className="max-w-xl space-y-6 py-4">
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-xs font-medium text-blue-800 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-blue-900">Quy trình đổi mật khẩu an toàn</h4>
            <p className="text-blue-700 leading-relaxed">
              Để bảo vệ tài khoản, hệ thống sẽ gửi một liên kết xác thực đặt lại mật khẩu an toàn đến email đăng ký: <strong className="font-bold text-slate-900">{user?.email}</strong>.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleSendResetEmail}
            disabled={loading}
            className="flex items-center gap-2 bg-primary hover:bg-blue-650 text-white px-6 py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4" />
            <span>{loading ? "Đang gửi liên kết..." : "Gửi email đặt lại mật khẩu"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
