import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { User, ChevronDown, UserPlus, LogIn, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { getProfileAPI } from "@/services/auth.service";
import { resolveMediaUrl } from "@/utils/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";

interface UserDropdownProps {
  onOpenAuthModal: (view: "login" | "register") => void;
}

export default function UserDropdown({ onOpenAuthModal }: UserDropdownProps) {
  const user = useAuthStore((state) => state.user) as any;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const setUser = useAuthStore((state) => state.setUser);
  const [imgError, setImgError] = React.useState(false);

  // Tự động đồng bộ Profile khi đã xác thực (load lại avatar, họ tên từ API mới nhất)
  useEffect(() => {
    if (isAuthenticated) {
      getProfileAPI()
        .then((res: any) => {
          const userData = res?.data || res;
          if (userData && userData.id) {
            setUser(userData);
          }
        })
        .catch((err) => {
          console.error("Không thể đồng bộ thông tin tài khoản ở Header:", err);
        });
    }
  }, [isAuthenticated, setUser]);

  const rawAvatarUrl =
    user?.detail?.avatarUrl ||
    user?.userDetail?.avatarUrl ||
    user?.detail?.avatar?.fileUrl ||
    user?.userDetail?.avatar?.fileUrl ||
    user?.avatarUrl ||
    user?.picture ||
    user?.avatar;

  const avatarSrc = resolveMediaUrl(rawAvatarUrl);

  // Reset imgError khi avatarSrc thay đổi
  useEffect(() => {
    setImgError(false);
  }, [avatarSrc]);

  const displayName =
    user?.detail?.fullName ||
    user?.userDetail?.fullName ||
    user?.fullName ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "Tài khoản";

  if (!isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="hover:text-primary flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-slate-500"
            />
          }
        >
          <User className="h-4 w-4" />
          <span>Tài khoản</span>
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => onOpenAuthModal("register")}
            className="flex cursor-pointer items-center gap-2 p-2"
          >
            <UserPlus className="h-4 w-4 text-slate-400" />
            <span>Đăng ký</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onOpenAuthModal("login")}
            className="flex cursor-pointer items-center gap-2 p-2"
          >
            <LogIn className="h-4 w-4 text-slate-400" />
            <span>Đăng nhập</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="hover:text-primary flex cursor-pointer items-center gap-2 rounded-full px-2.5 py-1.5 text-slate-500 transition-all"
          />
        }
      >
        {avatarSrc && !imgError ? (
          <img
            src={avatarSrc}
            alt={displayName}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={() => setImgError(true)}
            className="h-7 w-7 rounded-full border border-slate-200 object-cover"
          />
        ) : (
          <div className="bg-primary/10 border-primary/20 text-primary flex h-7 w-7 items-center justify-center rounded-full border text-xs font-black uppercase">
            {displayName.charAt(0)}
          </div>
        )}
        <span className="max-w-[100px] truncate text-xs font-bold text-slate-700">
          {displayName}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52 p-1.5">
        {user?.role === "ADMIN" && (
          <DropdownMenuItem
            className="text-primary hover:bg-primary/5 flex cursor-pointer items-center gap-2 rounded-lg p-2 font-bold"
            render={<Link to="/admin" />}
          >
            <ShieldCheck className="text-primary h-4 w-4" />
            <span>Trang Quản Trị</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 rounded-lg p-2"
          render={<Link to="/profile" />}
        >
          <User className="h-4 w-4 text-slate-400" />
          <span>Thông tin tài khoản</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => logout()}
          className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-rose-500 focus:bg-rose-50/50"
        >
          <LogIn className="h-4 w-4 rotate-180" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
