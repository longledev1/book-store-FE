import React, { useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import Header from "./Header";

export default function ClientLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-tertiary">
      {/* Sticky Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Spaced & Rich 4-Column Footer */}
      <footer className="bg-[#0B0F19] text-slate-400 pt-16 pb-12 border-t border-slate-900 mt-16 md:mt-24 relative overflow-hidden font-sans">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          
          {/* Main Link Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800/40">
            
            {/* Col 1: Brand & Logo */}
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-2">
                <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-xl text-white shadow-md">
                  <BookOpen className="h-4.5 w-4.5" />
                </div>
                <span className="text-white text-lg font-bold tracking-tight select-none">
                  Lumina<span className="text-primary">Book</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                Hiệu sách thông minh ứng dụng công nghệ tìm kiếm ngữ nghĩa AI tiên phong tại Việt Nam.
              </p>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-3 text-left">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">Khám phá</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/" className="hover:text-primary transition-colors text-slate-400">Trang chủ</Link>
                </li>
                <li>
                  <Link to="/books" className="hover:text-primary transition-colors text-slate-400">Cửa hàng sách</Link>
                </li>
                <li>
                  <Link to="/authors" className="hover:text-primary transition-colors text-slate-400">Tác giả nổi bật</Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Customer Account */}
            <div className="space-y-3 text-left">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">Tài khoản</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/profile" className="hover:text-primary transition-colors text-slate-400">Trang cá nhân</Link>
                </li>
                <li>
                  <Link to="/cart" className="hover:text-primary transition-colors text-slate-400">Giỏ hàng của tôi</Link>
                </li>
                <li>
                  <Link to="/auth/login" className="hover:text-primary transition-colors text-slate-400">Đăng ký & Đăng nhập</Link>
                </li>
              </ul>
            </div>

            {/* Col 4: University Info */}
            <div className="space-y-3 text-left">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">Đơn vị thực hiện</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Đồ án Tốt nghiệp Đại học<br />
                Trường Đại học Công nghệ Thông tin - ĐHQG TP.HCM.
              </p>
            </div>

          </div>

          {/* Copyright Bottom */}
          <div className="pt-8 text-center text-xs text-slate-650">
            <p>© {new Date().getFullYear()} LuminaBook.ai. All rights reserved.</p>
          </div>

        </div>
      </footer>
    </div>
  );
}
