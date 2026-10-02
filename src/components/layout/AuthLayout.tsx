import React from "react";
import { Outlet, Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-4 sm:p-6 font-sans antialiased text-neutral-dark">
      <div className="w-full max-w-[440px]">
        {/* Single Card Container combining Horizontal Header & Page Content */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
          {/* Horizontal Brand/Logo Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Link
              to="/"
              className="w-10 h-10 rounded-2xl bg-primary flex shrink-0 items-center justify-center text-white shadow-md shadow-primary/20 hover:scale-105 transition-all"
            >
              <BookOpen className="w-5 h-5" />
            </Link>
            <div className="text-left leading-tight">
              <h2 className="font-extrabold text-base tracking-tight text-slate-800">
                LuminaBook.ai
              </h2>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                Nền tảng mua sách bảo mật tích hợp AI
              </p>
            </div>
          </div>

          {/* Form Content / Outlet */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
