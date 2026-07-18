import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookMarked, 
  ShoppingBag, 
  Users, 
  PenTool, 
  ArrowLeft, 
  BookOpen
} from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const menuItems = [
    { path: "/admin", name: "Tổng quan", icon: LayoutDashboard },
    { path: "/admin/books", name: "Quản lý Sách", icon: BookMarked },
    { path: "/admin/orders", name: "Quản lý Đơn hàng", icon: ShoppingBag },
    { path: "/admin/users", name: "Quản lý Người dùng", icon: Users },
    { path: "/admin/blogs", name: "Quản lý Blog & SEO", icon: PenTool }
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-neutral-dark font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border-light bg-white flex flex-col justify-between shrink-0">
        <div className="p-6 space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <span className="font-bold text-slate-900 text-sm tracking-tight">Admin Portal</span>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-muted-text hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Back to Client Store Link */}
        <div className="p-6 border-t border-border-light">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Cửa hàng</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-grow flex flex-col min-h-screen overflow-y-auto">
        <header className="h-16 border-b border-border-light bg-white flex items-center justify-between px-8 shrink-0">
          <span className="text-sm font-bold text-slate-800">Hệ thống quản trị LuminaBook.ai</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-750 text-xs">
              AD
            </div>
          </div>
        </header>
        <main className="flex-grow p-8 bg-tertiary">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
