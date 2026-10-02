import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { getProfileAPI } from "@/services/auth.service";
import { toast } from "@/stores/useToastStore";

export default function AuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const setUser = useAuthStore((state) => state.setUser);

  const hasProcessedRef = React.useRef(false);

  useEffect(() => {
    if (hasProcessedRef.current) return;
    hasProcessedRef.current = true;

    const handleGoogleSuccess = async () => {
      const token = searchParams.get("token");

      if (!token) {
        toast.error("Không tìm thấy mã xác thực đăng nhập Google");
        navigate("/");
        return;
      }

      try {
        login(token);

        const profileRes = await getProfileAPI();
        const userData = profileRes?.data || profileRes;
        setUser(userData);

        navigate("/");
      } catch (err: any) {
        console.error("Lỗi khi tải thông tin tài khoản Google:", err);
        toast.error("Đăng nhập Google thất bại. Vui lòng thử lại!");
        navigate("/");
      }
    };

    handleGoogleSuccess();
  }, [searchParams]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50/40 p-4 font-sans text-center">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white p-8 shadow-md space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-primary border border-blue-100">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-black text-slate-800">Đang xử lý đăng nhập...</h2>
          <p className="text-xs font-medium text-slate-400">
            Vui lòng chờ trong giây lát, hệ thống đang đồng bộ tài khoản Google của bạn.
          </p>
        </div>
      </div>
    </div>
  );
}
