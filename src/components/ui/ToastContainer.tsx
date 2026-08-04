import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useToastStore } from "../../stores/useToastStore";

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  const getToastStyles = (type: "success" | "error" | "info") => {
    switch (type) {
      case "success":
        return {
          border: "border-emerald-100",
          background: "bg-emerald-50/95 backdrop-blur-md",
          iconColor: "text-emerald-500",
          Icon: CheckCircle,
        };
      case "error":
        return {
          border: "border-rose-100",
          background: "bg-rose-50/95 backdrop-blur-md",
          iconColor: "text-rose-500",
          Icon: AlertCircle,
        };
      case "info":
      default:
        return {
          border: "border-blue-100",
          background: "bg-blue-50/95 backdrop-blur-md",
          iconColor: "text-blue-500",
          Icon: Info,
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-[90%] sm:w-80 pointer-events-none select-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const { border, background, iconColor, Icon } = getToastStyles(toast.type);

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.4 }}
              className={`flex items-start gap-3 p-4 rounded-2xl border ${border} ${background} shadow-lg pointer-events-auto relative`}
            >
              {/* Left Status Icon */}
              <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />

              {/* Message text */}
              <p className="flex-grow text-xs font-bold text-slate-750 text-left leading-relaxed">
                {toast.message}
              </p>

              {/* Manual Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-lg hover:bg-slate-100/50 cursor-pointer ml-auto shrink-0 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
