import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "register" | "forgot";
}

export default function AuthModal({ isOpen, onClose, initialView = "login" }: AuthModalProps) {
  const [view, setView] = useState<"login" | "register" | "forgot">(initialView);

  // Sync state with prop when modal is opened
  useEffect(() => {
    if (isOpen) {
      setView(initialView);
    }
  }, [isOpen, initialView]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans">
          
          {/* Backdrop Shadow overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Content Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
            className="relative w-full max-w-md bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl flex flex-col space-y-6 mx-4 z-10"
          >
            
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-50 cursor-pointer select-none flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Render forms based on active view state */}
            {view === "login" && (
              <LoginForm 
                onSwitchToRegister={() => setView("register")}
                onSwitchToForgot={() => setView("forgot")}
                onSuccess={() => onClose()}
              />
            )}

            {view === "register" && (
              <RegisterForm 
                onSwitchToLogin={() => setView("login")}
              />
            )}

            {view === "forgot" && (
              <ForgotPasswordForm 
                onSwitchToLogin={() => setView("login")}
                onSuccess={() => onClose()}
              />
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
