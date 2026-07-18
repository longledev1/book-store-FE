import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";

interface IntroScreenProps {
  onFinished: () => void;
}

export default function IntroScreen({ onFinished }: IntroScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Prevent scrolling while intro is loading
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setVisible(false);
    }, 1800); // Show intro for 1.8 seconds

    return () => {
      clearTimeout(timer);
      // Restore scrolling and force scroll to top when unmounted
      document.body.style.overflow = originalOverflow || "unset";
      window.scrollTo(0, 0);
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onFinished}>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: -100,
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center font-sans select-none pointer-events-none"
        >
          {/* Logo & Text Container */}
          <div className="flex flex-col items-center space-y-4">
            
            {/* Book Icon (Pop & Spring Rotation) */}
            <motion.div
              initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
              animate={{ 
                scale: [0.5, 1.15, 1], 
                rotate: [-15, 8, 0], 
                opacity: 1 
              }}
              transition={{ 
                duration: 0.9, 
                ease: [0.34, 1.56, 0.64, 1] 
              }}
              className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20"
            >
              <BookOpen className="w-7 h-7" />
            </motion.div>

            {/* Brand Title (Fade & Slide-Up) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
              className="flex items-center"
            >
              <span className="font-bold text-2xl tracking-tight text-neutral-dark">
                Lumina<span className="text-primary">Book.ai</span>
              </span>
            </motion.div>

            {/* Minimal Progress Indicator */}
            <div className="w-28 h-[2.5px] bg-slate-100 rounded-full relative overflow-hidden mt-6">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ 
                  duration: 1.4, 
                  ease: "easeInOut"
                }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
              />
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
