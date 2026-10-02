import { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  ShoppingCart,
  ChevronDown,
} from "lucide-react";
import AISearchModal from "../client/ai/AISearchModal";
import AuthModal from "../client/auth/AuthModal";
import { AnimatePresence } from "framer-motion";
import { useUIStore } from "../../store/useUIStore";

import TopBar from "./header/TopBar";
import HeaderSearch from "./header/HeaderSearch";
import UserDropdown from "./header/UserDropdown";
import MegaMenu from "./header/MegaMenu";
import NotificationDropdown from "./header/NotificationDropdown";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "@/stores/useToastStore";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const { isAISearchOpen, setIsAISearchOpen } = useUIStore();
  const { isOpen: isAuthModalOpen, view: authModalView, closeModal: closeAuthModal, openModal: openAuthModal } = useAuthModalStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const cartTotalCount = useCartStore((state) => state.getTotalCount());

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 150);
  };

  const handleOpenAuthModal = (view: "login" | "register") => {
    openAuthModal(view);
  };

  return (
    <>
      {/* 1. Top Announcement Bar */}
      <TopBar />

      {/* 2. Main Header Navigation */}
      <header className="border-border-light sticky top-0 z-50 h-16 w-full border-b bg-white shadow-sm">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-4 px-4 md:px-8">
          
          {/* Column 1: Left Group (Logo & Navigation Links) */}
          <div className="flex h-full shrink-0 items-center gap-8">
            {/* Logo */}
            <Link to="/" className="group flex shrink-0 items-center gap-2.5">
              <div className="bg-primary shadow-primary/20 flex h-8 w-8 items-center justify-center rounded-xl text-white shadow-md transition-all group-hover:scale-105">
                <BookOpen className="h-4.5 w-4.5" />
              </div>
              <span className="text-neutral-dark text-base font-bold tracking-tight select-none">
                Lumina<span className="text-primary">Book</span>
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden items-center gap-6 md:flex">
              {/* Trang chủ */}
              <Link
                to="/"
                className={`relative py-1.5 text-sm font-medium transition-colors ${
                  location.pathname === "/"
                    ? "text-primary"
                    : "hover:text-neutral-dark text-slate-500"
                }`}
              >
                <span>Trang chủ</span>
                {location.pathname === "/" && (
                  <div className="bg-primary absolute right-0 -bottom-1 left-0 h-[2px] rounded-full" />
                )}
              </Link>

              {/* Danh mục (Mega Menu Trigger) */}
              <div
                className="relative py-1.5"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors select-none ${
                    megaMenuOpen || location.pathname.startsWith("/books")
                      ? "text-primary font-semibold"
                      : "hover:text-neutral-dark text-slate-500"
                  }`}
                >
                  <span>Danh mục</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      megaMenuOpen ? "text-primary rotate-180" : "text-slate-450"
                    }`}
                  />
                </button>
                {(megaMenuOpen || location.pathname.startsWith("/books")) && (
                  <div className="bg-primary absolute right-0 -bottom-1 left-0 h-[2px] rounded-full" />
                )}
              </div>

              {/* Liên hệ */}
              <Link
                to="/contact"
                className={`relative py-1.5 text-sm font-medium transition-colors ${
                  location.pathname === "/contact"
                    ? "text-primary"
                    : "hover:text-neutral-dark text-slate-500"
                }`}
              >
                <span>Liên hệ</span>
                {location.pathname === "/contact" && (
                  <div className="bg-primary absolute right-0 -bottom-1 left-0 h-[2px] rounded-full" />
                )}
              </Link>
            </nav>
          </div>

          {/* Column 2: Middle (Search Bar & AI Search Button) */}
          <HeaderSearch />

          {/* Column 3: Right Side (Notifications, Wishlist, Cart, Account Dropdown) */}
          <div className="flex h-full shrink-0 items-center gap-2 md:gap-3">
            {/* Realtime Notification Bell */}
            <NotificationDropdown />

            {/* Shopping Cart */}
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  openAuthModal("login");
                  toast.warning("Vui lòng đăng nhập để xem giỏ hàng!");
                  return;
                }
                navigate("/cart");
              }}
              className="hover:text-primary relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-50 cursor-pointer"
              title="Giỏ hàng"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartTotalCount > 0 && (
                <span className="bg-primary absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full border-2 border-white px-1 text-[10px] font-extrabold text-white shadow-sm">
                  {cartTotalCount > 99 ? "99+" : cartTotalCount}
                </span>
              )}
            </button>

            {/* Vertical Divider */}
            <div className="mx-1 hidden h-5 w-px bg-slate-200 sm:block" />

            {/* User Account / Profile Dropdown */}
            <UserDropdown onOpenAuthModal={handleOpenAuthModal} />
          </div>
        </div>

        {/* 3. Mega Menu Dropdown */}
        {megaMenuOpen && (
          <MegaMenu
            onClose={() => setMegaMenuOpen(false)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        )}
      </header>

      {/* AI Semantic Search Modal */}
      <AnimatePresence>
        {isAISearchOpen && (
          <AISearchModal onClose={() => setIsAISearchOpen(false)} />
        )}
      </AnimatePresence>

      {/* Account Auth Modal (Login / Register / Forgot Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialView={authModalView}
      />
    </>
  );
}
