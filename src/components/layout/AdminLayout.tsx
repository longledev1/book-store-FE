import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronDown } from "lucide-react";

import { adminMenuConfig } from "../../config/adminNavigation";

export default function AdminLayout() {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  // Scroll to top on pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Auto-expand the dropdown menu if one of its sub-items is currently active
  useEffect(() => {
    adminMenuConfig.forEach(item => {
      if (item.subItems) {
        const hasActiveSub = item.subItems.some(sub => location.pathname === sub.path);
        if (hasActiveSub) {
          setExpandedMenus(prev => ({ ...prev, [item.name]: true }));
        }
      }
    });
  }, [location.pathname]);

  const toggleMenu = (name: string) => {
    setExpandedMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-neutral-dark font-sans">
      
      {/* Sidebar navigation */}
      <aside className="w-64 border-r border-border-light bg-white flex flex-col justify-between shrink-0 select-none">
        <div className="p-6 space-y-7">
          
          {/* Logo brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <span className="font-bold text-slate-900 text-sm tracking-tight">Admin Portal</span>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            {adminMenuConfig.map((item) => {
              const Icon = item.icon;
              
              // Case 1: Simple link (no sub-items)
              if (!item.subItems) {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path || "/admin"}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                      isActive
                        ? "bg-primary text-white shadow-sm shadow-blue-500/10"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              }

              // Case 2: Dropdown link group (has sub-items)
              const isExpanded = !!expandedMenus[item.name];
              const hasActiveSub = item.subItems.some(sub => location.pathname === sub.path);

              return (
                <div key={item.name} className="flex flex-col">
                  {/* Dropdown parent trigger */}
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      hasActiveSub 
                        ? "text-primary bg-blue-50/20" 
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4.5 h-4.5 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                        isExpanded ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown child items list */}
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isExpanded 
                        ? "max-h-40 opacity-100 mt-1 pl-2" 
                        : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="flex flex-col gap-1 border-l border-slate-100 ml-5 pl-2.5 pt-0.5">
                      {item.subItems.map((sub) => {
                        const isSubActive = location.pathname === sub.path;
                        return (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className={`flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                              isSubActive
                                ? "text-primary bg-blue-50/50"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                            }`}
                          >
                            {/* Dot bullet indicator */}
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              isSubActive ? "bg-primary scale-110" : "bg-slate-300"
                            }`} />
                            <span>{sub.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                </div>
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
