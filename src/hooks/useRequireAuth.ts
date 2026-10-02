import { useAuthStore } from "@/stores/useAuthStore";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { useUnverifiedModalStore } from "@/stores/useUnverifiedModalStore";
import { toast } from "@/stores/useToastStore";

function getIsVerifiedFromToken(token: string | null): boolean | null {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);
    return typeof parsed.isVerified === "boolean" ? parsed.isVerified : null;
  } catch (e) {
    return null;
  }
}

export function useRequireAuth() {
  const { isAuthenticated, user, accessToken } = useAuthStore();
  const openAuthModal = useAuthModalStore((state) => state.openModal);
  const openUnverifiedModal = useUnverifiedModalStore((state) => state.openModal);

  const requireAuth = (onSuccess: () => void) => {
    // 1. Chưa đăng nhập ➔ Mở modal đăng nhập & hiển thị thông báo
    if (!isAuthenticated || !user || !accessToken) {
      openAuthModal("login");
      toast.warning("Vui lòng đăng nhập để thực hiện mua hàng!");
      return false;
    }

    // Lấy trạng thái isVerified từ user object hoặc giải mã trực tiếp từ JWT Access Token
    const isVerifiedFromToken = getIsVerifiedFromToken(accessToken);
    const isVerified = user.isVerified ?? isVerifiedFromToken;

    // 2. Đã đăng nhập nhưng tài khoản chưa xác thực email ➔ Mở modal xác thực
    if (isVerified === false || isVerified === null) {
      openUnverifiedModal();
      toast.error("Tài khoản chưa được xác thực email. Vui lòng xác thực trước khi mua hàng!");
      return false;
    }

    // 3. Đã xác thực đầy đủ ➔ Tiếp tục mua hàng
    onSuccess();
    return true;
  };

  return { requireAuth, isAuthenticated, user };
}
