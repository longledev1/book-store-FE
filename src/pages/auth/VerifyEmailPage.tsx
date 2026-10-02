import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { verifyEmailAPI } from "@/services/auth.service";
import { toast } from "@/stores/useToastStore";
import { useAuthModalStore } from "@/stores/useAuthModalStore";

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const openModal = useAuthModalStore((state) => state.openModal);

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Đang xác thực tài khoản của bạn...");
  const [email, setEmail] = useState<string>("");

  const hasCalledApi = useRef(false);

  const handleGoToLoginModal = () => {
    navigate("/");
    openModal("login");
  };

  useEffect(() => {
    if (hasCalledApi.current) return;
    hasCalledApi.current = true;

    if (!token) {
      setStatus("error");
      setMessage("Mã xác thực không hợp lệ hoặc thiếu thông tin.");
      return;
    }

    const handleVerify = async () => {
      try {
        const res = await verifyEmailAPI(token);
        const data = res?.data || res;
        setStatus("success");
        setMessage(data?.message || "Xác thực email thành công");
        if (data?.email) {
          setEmail(data.email);
        }
        toast.success("Xác thực email thành công! Bạn có thể đăng nhập ngay.");
      } catch (err: any) {
        console.error("Lỗi xác thực email:", err);
        setStatus("error");
        const errMsg =
          err?.response?.data?.message ||
          err?.message ||
          "Mã xác thực không hợp lệ hoặc đã hết hạn.";
        setMessage(typeof errMsg === "string" ? errMsg : "Xác thực tài khoản thất bại.");
      }
    };

    handleVerify();
  }, [token]);

  return (
    <div className="space-y-4 text-left font-sans">
      {/* Loading State */}
      {status === "loading" && (
        <div className="flex items-center gap-4 py-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-primary border border-blue-100">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm font-extrabold text-slate-800">
              Đang xác thực tài khoản...
            </h3>
            <p className="text-xs font-medium text-slate-400">
              Vui lòng chờ trong giây lát, hệ thống đang xử lý mã xác thực.
            </p>
          </div>
        </div>
      )}

      {/* Success State */}
      {status === "success" && (
        <div className="space-y-4 py-1">
          <div className="flex items-start gap-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-800">
                Xác thực thành công!
              </h3>
              <p className="text-xs font-medium text-slate-600">
                {message}
              </p>
              {email && (
                <span className="inline-block mt-1 text-[11px] font-bold text-slate-700 bg-white/80 px-2.5 py-0.5 rounded-lg border border-slate-200/60">
                  {email}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoToLoginModal}
            className="bg-primary hover:bg-blue-650 w-full flex items-center justify-center gap-2 cursor-pointer rounded-2xl py-3 text-xs font-bold text-white uppercase shadow-md transition-all select-none active:scale-[0.98]"
          >
            <span>Đăng nhập ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error State */}
      {status === "error" && (
        <div className="space-y-4 py-1">
          <div className="flex items-start gap-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <XCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-800">
                Xác thực thất bại
              </h3>
              <p className="text-xs font-medium text-rose-600">
                {message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleGoToLoginModal}
              className="bg-primary hover:bg-blue-650 flex-1 flex items-center justify-center gap-1.5 cursor-pointer rounded-2xl py-3 text-xs font-bold text-white uppercase shadow-md transition-all select-none active:scale-[0.98]"
            >
              <span>Đăng nhập</span>
            </button>
            <Link
              to="/"
              className="flex-1 flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all select-none"
            >
              Trang chủ
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
