import React from "react";
import { useAuthModalStore } from "@/stores/useAuthModalStore";

export default function TopBar() {
  const openModal = useAuthModalStore((state) => state.openModal);

  return (
    <div className="bg-neutral-dark relative z-50 w-full px-4 py-2.5 text-center text-xs font-normal tracking-wide text-white select-none">
      <span>Mới: Hỗ trợ đăng nhập bằng Passkeys. </span>
      <button
        type="button"
        onClick={() => openModal("login")}
        className="ml-1 font-medium underline transition-colors hover:text-blue-300 cursor-pointer"
      >
        Thử ngay
      </button>
    </div>
  );
}
