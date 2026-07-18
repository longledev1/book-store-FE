import React from "react";
import { Outlet, Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-tertiary flex flex-col items-center justify-center p-6 font-sans antialiased text-neutral-dark">
      <div className="w-full max-w-[400px] space-y-6">
        {/* Brand/Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link to="/" className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            <BookOpen className="w-6 h-6" />
          </Link>
          <h2 className="font-bold text-xl tracking-tight mt-3">LuminaBook.ai</h2>
          <p className="text-xs text-muted-text">Nền tảng mua sách bảo mật tích hợp AI</p>
        </div>

        {/* Form Container Card */}
        <div className="bg-white border border-border-light rounded-2xl p-8 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
