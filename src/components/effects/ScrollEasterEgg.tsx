"use client";

import React, { useEffect, useState, useRef } from "react";
import { throttle } from "@/lib/utils";
import { animate as anime } from "animejs";

export function ScrollEasterEgg() {
  const [showToast, setShowToast] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const lastTriggerRef = useRef(0);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScrollAttempt = throttle((e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.overflow-y-auto')) return;

      const now = Date.now();
      if (now - lastTriggerRef.current < 4000) return; // Cooldown 4s

      setShouldRender(true);
      setShowToast(true);
      lastTriggerRef.current = now;

      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(200);
      }
      
      // Auto-hide start
      setTimeout(() => setShowToast(false), 3000);
    }, 100);

    window.addEventListener("wheel", handleScrollAttempt, { passive: true });
    window.addEventListener("touchmove", handleScrollAttempt, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleScrollAttempt);
      window.removeEventListener("touchmove", handleScrollAttempt);
    };
  }, []);

  useEffect(() => {
    if (showToast && toastRef.current) {
        anime(toastRef.current, {
            translateY: [50, 0],
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 600,
            easing: 'easeOutQuart'
        });
    } else if (!showToast && toastRef.current) {
        anime(toastRef.current, {
            translateY: 20,
            scale: 0.8,
            opacity: 0,
            duration: 400,
            easing: 'easeInQuart',
            onComplete: () => setShouldRender(false)
        });
    }
  }, [showToast]);

  if (!shouldRender) return null;

  return (
    <div
        ref={toastRef}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-full bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl pointer-events-none"
    >
        <span className="text-2xl">🙅🏾‍♂️</span>
        <span className="text-white font-medium tracking-wide">
            We don&apos;t do that here.
        </span>
    </div>
  );
}
