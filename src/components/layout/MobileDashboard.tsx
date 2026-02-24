"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { usePreloader } from "@/lib/preloader-context";
import { IconBattery4, IconWifi, IconSignal4g, IconHome, IconGridDots, IconCpu, IconMail } from "@tabler/icons-react";
import { isMobile } from "react-device-detect";

// ⚡ PERFORMANCE: Lazy load heavy sections to reduce initial bundle size
const Work = dynamic(() => import("@/components/sections/Work").then((mod) => mod.Work));
const About = dynamic(() => import("@/components/sections/About").then((mod) => mod.About));
const Contact = dynamic(() => import("@/components/sections/Contact").then((mod) => mod.Contact));

type ViewState = 'hero' | 'about' | 'work' | 'contact';

export function MobileDashboard() {
  const { isComplete } = usePreloader();
  const [activeView, setActiveView] = useState<ViewState>('hero');
  const [time, setTime] = useState("");

  const navItems = [
    { id: 'hero', label: 'HOME', icon: IconHome },
    { id: 'work', label: 'WORK', icon: IconGridDots },
    { id: 'about', label: 'ABOUT', icon: IconCpu },
    { id: 'contact', label: 'CONTACT', icon: IconMail },
  ];

  // 🕒 Real-time Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full bg-[#050507] text-white overflow-hidden flex flex-col font-space relative">
      
      {/* =========================================
          1. STATUS BAR (iOS Style)
      ========================================= */}
      <motion.div 
        className="w-full px-6 py-2 flex items-center justify-between z-50 text-[10px] font-mono text-white/50 bg-black/20 backdrop-blur-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 6.0 }} // Sync with ripple end
      >
         <div className="flex items-center gap-2">
            <span>{time}</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-[9px] tracking-widest opacity-50">{isMobile ? "LTE" : "WIFI"}</span>
            <IconSignal4g size={14} />
            <IconWifi size={14} />
            <IconBattery4 size={14} />
         </div>
      </motion.div>

      {/* =========================================
          2. MAIN CONTENT AREA
      ========================================= */}
      <div className="flex-1 relative overflow-hidden">
         {/* BACKGROUND GRID */}
         <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] grid-rows-[repeat(auto-fill,minmax(40px,1fr))] pointer-events-none opacity-[0.03]">
            {[...Array(100)].map((_, i) => (
                <div key={i} className="border-[0.5px] border-white/20" />
            ))}
         </div>

         <AnimatePresence mode="wait">
            
            {/* HERO */}
            {activeView === 'hero' && (
                <motion.div 
                    key="hero"
                    className="absolute inset-0 z-10 overflow-y-auto no-scrollbar pb-32" // Padding for Dock
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                     <Hero />
                </motion.div>
            )}

            {/* WORK */}
            {activeView === 'work' && (
                <motion.div 
                    key="work"
                    className="absolute inset-0 z-10 overflow-y-auto no-scrollbar pb-32"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="p-4 pt-12">
                       <Work />
                    </div>
                </motion.div>
            )}

            {/* ABOUT */}
            {activeView === 'about' && (
                <motion.div 
                    key="about"
                    className="absolute inset-0 z-10 overflow-y-auto no-scrollbar pb-32"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="p-4 pt-12">
                       <About />
                    </div>
                </motion.div>
            )}

            {/* CONTACT */}
            {activeView === 'contact' && (
                <motion.div 
                    key="contact"
                    className="absolute inset-0 z-10 overflow-y-auto no-scrollbar pb-32 flex flex-col items-center justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="p-4">
                       <Contact />
                    </div>
                </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* =========================================
          3. BOTTOM DOCK (Glassmorphism)
      ========================================= */}
      <motion.div 
        className="absolute bottom-6 left-4 right-4 h-20 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl flex items-center justify-evenly z-50 overflow-hidden"
        initial={{ y: 100, opacity: 0 }}
        animate={isComplete ? { y: 0, opacity: 1 } : {}}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
      >
          {navItems.map((item) => {
              const isActive = activeView === item.id;

              return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id as ViewState)}
                    className="relative group flex flex-col items-center justify-center w-14 h-14"
                  >
                        {/* Active Indicator (Dot) */}
                        {isActive && (
                            <motion.div 
                                layoutId="mobileActiveDot"
                                className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"
                            />
                        )}

                        <div className={`
                            p-3 rounded-2xl transition-all duration-300
                            ${isActive ? 'bg-white/10 scale-110 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-transparent active:scale-95'}
                        `}>
                            <item.icon 
                                size={24} 
                                color={isActive ? "white" : "#9ca3af"} // zinc-400 inactive
                                style={{
                                    filter: isActive ? "drop-shadow(0 0 5px white)" : "none"
                                }}
                            />
                        </div>
                  </button>
              );
          })}
      </motion.div>

    </div>
  );
}
