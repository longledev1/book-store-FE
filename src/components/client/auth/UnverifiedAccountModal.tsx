import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MailWarning, X, Send, Loader2, CheckCircle2 } from "lucide-react";
import { useUnverifiedModalStore } from "@/stores/useUnverifiedModalStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { resendVerificationAPI } from "@/services/auth.service";

export default function UnverifiedAccountModal() {
  const { isOpen, closeModal } = useUnverifiedModalStore();
  const user = useAuthStore((state) => state.user);
  
  const [loading, setLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleResend = async () => {
    if (!user?.email) return;
    setLoading(true);
    setErrorMsg(null);
    setResendSuccess(false);

    try {
      await resendVerificationAPI(user.email);
      setResendSuccess(true);
    } catch (err: any) {
      console.error("Lỗi gửi lại email xác thực:", err);
      setErrorMsg(err?.response?.data?.message || "Không thể gửi lại email xác thực. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-7 shadow-2xl z-10 font-sans text-left space-y-5"
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Icon & Title */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-500 shrink-0 shadow-sm">
              <MailWarning className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Tài khoản chưa xác thực Email
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Yêu cầu bảo mật trước khi thực hiện mua hàng
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/50 text-xs text-slate-600 leading-relaxed font-medium">
            Tài khoản <span className="font-bold text-slate-900">{user?.email || "của bạn"}</span> chưa được xác thực email. Bạn vui lòng kiểm tra hộp thư (bao gồm cả thư rác / spam) để bấm vào link xác thực trước khi mua sắm.
          </div>

          {/* Alert Error / Success */}
          {resendSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Đã gửi lại email xác thực thành công. Vui lòng kiểm tra hộp thư!</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={closeModal}
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 transition-all cursor-pointer"
            >
              Đóng
            </button>

            <button
              onClick={handleResend}
              disabled={loading || resendSuccess}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-blue-600 disabled:opacity-60 text-white text-xs font-bold shadow-md shadow-primary/20 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi lại email xác thực</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
