import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  Search,
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
  ChevronUp,
  UserPlus,
  LogIn,
  Package,
  BookMarked,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "@base-ui/react/button";
import AISearchModal from "../client/AISearchModal";
import AuthModal from "../client/auth/AuthModal";
import { AnimatePresence } from "framer-motion";
import { useUIStore } from "../../store/useUIStore";

import { parentCategories, subcategoriesData } from "../../constants/categoriesData";

export default function Header() {
  const location = useLocation();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("science_tech");
  const { isAISearchOpen, setIsAISearchOpen } = useUIStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "register">("login");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 150);
  };

  // Separate subcategories into grid groups and highlight tags
  const activeCatData = subcategoriesData[activeCategory] || {
    title: parentCategories.find((c) => c.id === activeCategory)?.name || "",
    groups: [],
  };

  const gridGroups = activeCatData.groups.filter((g) => !g.isHighlighted);
  const highlightGroups = activeCatData.groups.filter((g) => g.isHighlighted);

  return (
    <>
      {/* 1. Top Announcement Bar */}
      <div className="bg-neutral-dark relative z-50 w-full px-4 py-2.5 text-center text-xs font-normal tracking-wide text-white">
        <span>Mới: Hỗ trợ đăng nhập bằng Passkeys. </span>
        <Link
          to="/auth/login"
          className="ml-1 font-medium underline transition-colors hover:text-blue-300"
        >
          Thử ngay
        </Link>
      </div>
      {/* 2. Main Header Navigation */}
      <header className="border-border-light sticky top-0 z-50 h-16 w-full border-b bg-white shadow-sm">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-4 px-4 md:px-8">
          {/* Column 1: Left Group (Logo & Nav Links) */}
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

            {/* Nav Links */}
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
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${megaMenuOpen ? "text-primary rotate-180" : "text-slate-450"}`}
                  />
                </button>
                {/* Active Indicator Underline */}
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

          {/* Column 2: Middle (Rounded Search Bar & AI Search Button) */}
          <div className="mx-6 hidden max-w-xl flex-grow items-center justify-center gap-3 md:flex">
            <div className="relative w-full max-w-xs lg:max-w-sm">
              <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sách..."
                className="focus:border-primary/50 focus:ring-primary/10 text-neutral-dark w-full rounded-full border border-slate-200/60 bg-slate-50 py-1.5 pr-4 pl-10 text-xs font-medium placeholder-slate-400 transition-all hover:bg-slate-100/50 focus:bg-white focus:ring-4 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setIsAISearchOpen(true)}
              className="from-primary shadow-primary/20 hover:shadow-primary/30 flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-gradient-to-r to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]"
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-white" />
              <span>Tìm sách với AI</span>
            </button>
          </div>

          {/* Column 3: Right Side (Actions & Dropdown) */}
          <div className="flex h-full shrink-0 items-center gap-2 md:gap-3">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-rose-500"
              title="Danh sách yêu thích"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="hover:text-primary rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-50"
              title="Giỏ hàng"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>
            {/* Vertical Divider */}
            <div className="mx-1 hidden h-5 w-px bg-slate-200 sm:block" />
            {/* User Account / Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hover:text-primary flex items-center gap-1.5 rounded-full px-3 py-1.5 text-slate-500"
                >
                  <User className="h-4 w-4" />
                  <span className="">Tài khoản</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => {
                    setAuthModalView("register");
                    setIsAuthModalOpen(true);
                  }}
                  className="flex items-center gap-2 p-2 cursor-pointer"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Đăng ký</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    setAuthModalView("login");
                    setIsAuthModalOpen(true);
                  }}
                  className="flex items-center gap-2 p-2 cursor-pointer"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Đăng nhập</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 3. Mega Menu (Toggled on Hovering over "Danh mục") */}
        {megaMenuOpen && (
          <div
            className="animate-in fade-in slide-in-from-top-1 absolute top-16 right-0 left-0 z-45 flex h-[340px] w-full border-b border-slate-200 bg-white shadow-2xl duration-150"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="mx-auto flex h-full w-full max-w-[1440px] px-4 md:px-8">
              {/* Left Panel: Category list */}
              <div className="flex h-full w-80 shrink-0 flex-col overflow-y-auto border-r border-slate-100 bg-slate-50/60 p-5 text-left">
                <h4 className="px-3 pb-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase select-none">
                  Danh mục sản phẩm
                </h4>
                <div className="flex flex-col gap-1.5">
                  {parentCategories.map((cat) => {
                    const isCurrent = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onMouseEnter={() => setActiveCategory(cat.id)}
                        className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                          isCurrent
                            ? "text-primary border-slate-150 border bg-white shadow-sm"
                            : "text-slate-650 border border-transparent hover:bg-slate-100/50 hover:text-slate-900"
                        }`}
                      >
                        <span>{cat.name}</span>
                        {isCurrent && (
                          <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Panel: Subcategories Detail */}
              <div className="flex h-full flex-grow flex-col overflow-y-auto p-8 text-left">
                {/* Header title */}
                <div className="mb-6 flex shrink-0 items-center gap-2.5 border-b border-slate-100 pb-4">
                  <div className="text-primary border-primary/5 flex h-7 w-7 items-center justify-center rounded-lg border bg-blue-50">
                    <BookMarked className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold tracking-tight text-slate-800">
                    {activeCatData.title}
                  </h3>
                </div>

                {gridGroups.length > 0 ? (
                  <div className="flex-grow">
                    {/* Grid Columns */}
                    <div className="grid grid-cols-1 gap-x-16 gap-y-6 md:grid-cols-2">
                      {gridGroups.map((group) => (
                        <div key={group.title} className="space-y-3">
                          <h5 className="border-b border-slate-100 pb-1.5 text-xs font-bold tracking-wider text-slate-800 uppercase">
                            {group.title}
                          </h5>
                          <ul className="space-y-2.5">
                            {group.items.map((item) => (
                              <li key={item}>
                                <Link
                                  to={`/books?category=${encodeURIComponent(item)}`}
                                  className="hover:text-primary text-sm font-medium text-slate-500 transition-colors hover:underline"
                                  onClick={() => setMegaMenuOpen(false)}
                                >
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <Link
                            to="/books"
                            className="text-primary inline-block pt-1 text-xs font-bold transition-colors hover:text-blue-700 hover:underline"
                            onClick={() => setMegaMenuOpen(false)}
                          >
                            Xem tất cả
                          </Link>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Red highlighted tags */}
                    {highlightGroups.length > 0 && (
                      <div className="mt-8 flex shrink-0 flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 pt-4">
                        {highlightGroups.map((group) => (
                          <Link
                            key={group.title}
                            to="/books"
                            className="hover:text-primary flex items-center gap-1 text-xs font-bold text-slate-800 transition-colors"
                            onClick={() => setMegaMenuOpen(false)}
                          >
                            <span>{group.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Placeholder when no subcategories are defined */
                  <div className="flex flex-grow flex-col items-center justify-center gap-2.5 py-12 text-slate-400">
                    <Package className="h-10 w-10 stroke-[1.5] opacity-30" />
                    <span className="text-xs font-medium">
                      Danh mục đang được cập nhật sản phẩm...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
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
        onClose={() => setIsAuthModalOpen(false)}
        initialView={authModalView}
      />
    </>
  );
}
