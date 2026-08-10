import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";
import { userMenuConfig } from "../../../config/userNavigation";

export default function UserSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 border-r border-slate-200/60 bg-white flex flex-col justify-between shrink-0 select-none min-h-screen">
      <div className="p-6 space-y-7">
        
        {/* Brand logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight">LuminaBook</span>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {userMenuConfig.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-sm shadow-blue-500/10"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Back to Client Store Link */}
      <div className="p-6 border-t border-slate-200/60">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Trở về trang chủ</span>
        </Link>
      </div>
    </aside>
  );
}
