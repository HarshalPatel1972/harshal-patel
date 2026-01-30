"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, animate, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { usePreloader } from "@/lib/preloader-context";
import { APPS } from "@/lib/apps";
import { cn } from "@/lib/utils";

export function Preloader() {
  const { setComplete, isComplete } = usePreloader();
  const [progress, setProgress] = useState(0);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [shake, setShake] = useState(0);

  // Phase 2: The Injection (0.5s - 2.0s)
  useEffect(() => {
    if (isComplete) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < APPS.length) {
          // Trigger shake/recoil
          setShake((s) => s + 1);
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 200); // Rhythmic click-click-click

    return () => clearInterval(interval);
  }, [isComplete]);

  // Phase 3: The Compilation (2.0s - 2.5s)
  useEffect(() => {
    if (progress === APPS.length) {
      const compileTimer = setTimeout(() => {
        setIsCompiling(true);
        setTimeout(() => {
          setIsReady(true);
          // Set complete after a brief ready state
          setTimeout(() => {
            setComplete();
          }, 800);
        }, 1000);
      }, 300);
      return () => clearTimeout(compileTimer);
    }
  }, [progress, setComplete]);

  if (isComplete) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09090b] overflow-hidden">
      <div className="flex flex-col items-center">
        {/* 📦 THE CAPSULE (PILL) */}
        <motion.div
           layout
           layoutId="navbar-pill"
           animate={{
             x: shake % 2 === 0 ? [0, -2, 2, 0] : [0, 2, -2, 0],
             scale: shake > 0 ? [1, 1.02, 1] : 1,
           }}
           transition={{ duration: 0.1 }}
           className={cn(
             "relative flex items-center px-4 py-3 rounded-full border border-white/10 bg-zinc-900/50 backdrop-blur-xl shadow-2xl transition-all duration-300",
             isReady && "shadow-[0_0_50px_rgba(255,255,255,0.1)] border-white/20"
           )}
        >
          {/* Dynamic Progress/App Icons */}
          <div className="flex items-center gap-1.5 min-w-[32px] overflow-hidden">
            {APPS.map((app, i) => (
              <AppModule 
                key={app.name} 
                app={app} 
                isActive={i < progress} 
                isCompiling={isCompiling}
              />
            ))}
            {progress === 0 && <div className="w-8 h-8" />}
          </div>

          {/* Inner Glow Pulse on Injection */}
          {shake > 0 && progress < APPS.length && (
            <motion.div 
               initial={{ opacity: 0.8, scale: 0.8 }}
               animate={{ opacity: 0, scale: 1.5 }}
               className="absolute inset-0 rounded-full pointer-events-none"
               style={{ backgroundColor: APPS[progress - 1].hex + "40" }}
            />
          )}

          {/* Ready State Gradient Wash */}
          {isReady && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: [0, 0.2, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-rose-500/20 pointer-events-none"
            />
          )}
        </motion.div>

        {/* 🏷️ STATUS LABEL */}
        <div className="mt-6 font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">
          <AnimatePresence mode="wait">
            {!isReady ? (
              <motion.div 
                key="resolving"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 animate-pulse" />
                {progress === APPS.length ? "RESOLVED" : "RESOLVING DEPENDENCIES..."}
              </motion.div>
            ) : (
              <motion.div 
                key="ready"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-white flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                SYSTEM_READY
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Background Subtle Gradients */}
      <div className="absolute inset-0 z-[-1] opacity-30">
        <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-indigo-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-zinc-900/20 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}

function AppModule({ app, isActive, isCompiling }: { app: any, isActive: boolean, isCompiling: boolean }) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
           layout
           layoutId={app.name}
           initial={{ x: -20, opacity: 0, scale: 0.5 }}
           animate={{ x: 0, opacity: 1, scale: 1 }}
           className="relative flex items-center justify-center w-8 h-8 rounded-full"
        >
            <app.icon 
              size={18} 
              className={cn(
                "transition-colors duration-500",
                isCompiling ? "text-white" : "text-white/40"
              )} 
              style={{
                color: isCompiling ? app.hex : "white"
              }}
            />
            {/* Success Flash */}
            <motion.div 
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ backgroundColor: app.hex + "40" }}
            />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
