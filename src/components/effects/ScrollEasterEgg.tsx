"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ScrollEasterEgg() {
  const [showToast, setShowToast] = useState(false);
  const [lastTrigger, setLastTrigger] = useState(0);

  useEffect(() => {
    const handleScrollAttempt = (e: Event) => {
      // Allow scrolling if we are in an overlay that explicitly allows it (like the Work/About sections)
      // Check if the target is inside a scrollable container
      const target = e.target as HTMLElement;
      if (target.closest('.overflow-y-auto')) return;

      const now = Date.now();
      if (now - lastTrigger < 2000) return; // Cooldown 2s

      setShowToast(true);
      setLastTrigger(now);

      // Vibrator API for mobile realism
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(200);
      }
      
      // Auto-hide
      setTimeout(() => setShowToast(false), 3000);
    };

    window.addEventListener("wheel", handleScrollAttempt);
    window.addEventListener("touchmove", handleScrollAttempt);

    return () => {
      window.removeEventListener("wheel", handleScrollAttempt);
      window.removeEventListener("touchmove", handleScrollAttempt);
    };
  }, [lastTrigger]);

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-full bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl"
        >
            <span className="text-2xl">🙅🏾‍♂️</span>
            <span className="text-white font-medium tracking-wide">
                We don't do that here.
            </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
