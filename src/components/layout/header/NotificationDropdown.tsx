import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, CheckCheck, Package, Clock, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNotificationStore, translateStatusInMessage } from "@/stores/useNotificationStore";
import { formatDate } from "@/utils/format";

const BADGE_STYLES: Record<string, string> = {
  "Chờ xác nhận": "bg-amber-50 text-amber-700 border-amber-200/80",
  "Đã xác nhận": "bg-blue-50 text-blue-700 border-blue-200/80",
  "Đang giao hàng": "bg-indigo-50 text-indigo-700 border-indigo-200/80",
  "Hoàn thành": "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  "Đã hủy": "bg-rose-50 text-rose-700 border-rose-200/80",
};

function renderFormattedNotificationMessage(msg?: string) {
  if (!msg) return null;
  const translated = translateStatusInMessage(msg);

  const parts = translated.split(/(\[[^\]]+\])/g);

  return parts.map((part, index) => {
    if (part.startsWith("[") && part.endsWith("]")) {
      const statusLabel = part.slice(1, -1);
      const colorClass =
        BADGE_STYLES[statusLabel] || "bg-slate-100 text-slate-700 border-slate-200";

      return (
        <span
          key={index}
          className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-extrabold mx-0.5 shadow-2xs ${colorClass}`}
        >
          {statusLabel}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const prevUnreadRef = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminContext = location.pathname.startsWith("/admin");

  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  const {
    notifications,
    unreadCount,
    connectSocket,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  useEffect(() => {
    if (accessToken && user) {
      connectSocket(accessToken, user.role);
    }
  }, [accessToken, user]);

  // Trigger Bell Ringing & Floating Tooltip on new notification
  useEffect(() => {
    if (unreadCount > prevUnreadRef.current) {
      setIsRinging(true);
      setShowTooltip(true);

      const ringTimer = setTimeout(() => setIsRinging(false), 2000);
      const tooltipTimer = setTimeout(() => setShowTooltip(false), 3000);

      return () => {
        clearTimeout(ringTimer);
        clearTimeout(tooltipTimer);
      };
    }
    prevUnreadRef.current = unreadCount;
  }, [unreadCount]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const handleNotificationClick = (notif: any) => {
    markAsRead(notif.id);
    setIsOpen(false);
    if (isAdminContext || notif.type === "NEW_ORDER") {
      navigate("/admin/orders");
    } else {
      navigate("/profile/orders");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-primary cursor-pointer select-none"
        title="Thông báo"
      >
        <motion.div
          animate={isRinging ? { rotate: [0, 22, -22, 16, -16, 10, -10, 0] } : { rotate: 0 }}
          transition={{ duration: 0.7, repeat: isRinging ? 2 : 0 }}
        >
          <Bell className="h-5 w-5" />
        </motion.div>

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-500 border-2 border-white px-1 text-[10px] font-extrabold text-white shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Temporary Floating Alert Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="absolute top-11 right-0 z-50 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-xs text-white text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap pointer-events-none select-none border border-slate-700/50"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>Có thông báo mới!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[340px] sm:w-[420px] md:w-[460px] rounded-3xl border border-slate-200/80 bg-white shadow-xl py-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 font-sans text-left">
          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-slate-800 text-sm">Thông báo</h4>
              {unreadCount > 0 && (
                <span className="bg-primary/10 text-primary text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  {unreadCount} mới
                </span>
              )}
            </div>

            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Đã đọc tất cả</span>
              </button>
            )}
          </div>

          {/* List Container */}
          <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs font-semibold space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                  <Bell className="w-5 h-5" />
                </div>
                <p>Bạn chưa có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 flex items-start gap-3.5 transition-colors cursor-pointer ${
                    notif.read ? "bg-white hover:bg-slate-50" : "bg-blue-50/40 hover:bg-blue-50/70"
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary shrink-0 flex items-center justify-center mt-0.5 shadow-2xs">
                    {notif.type === "NEW_ORDER" ? (
                      <ShoppingBag className="w-4.5 h-4.5" />
                    ) : (
                      <Package className="w-4.5 h-4.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="font-bold text-slate-800 text-xs leading-tight">
                        {notif.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0 flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-slate-300" />
                        {formatDate(notif.createdAt)}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 leading-relaxed">
                      {renderFormattedNotificationMessage(notif.message)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Link */}
          <div className="pt-2 px-4 border-t border-slate-100 text-center">
            <Link
              to={isAdminContext ? "/admin/orders" : "/profile/orders"}
              onClick={() => setIsOpen(false)}
              className="text-xs font-extrabold text-primary hover:underline block py-1"
            >
              {isAdminContext ? "Xem tất cả đơn hàng Admin \u2192" : "Xem đơn hàng của tôi \u2192"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
