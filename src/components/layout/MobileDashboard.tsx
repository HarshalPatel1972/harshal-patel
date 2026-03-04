"use client";

import React, { useState } from "react";
import { Clock } from "@/components/ui/Clock";
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { usePreloader } from "@/lib/preloader-context";
import { IconBattery4, IconWifi, IconSignal4g, IconHome, IconGridDots, IconCpu, IconMail } from "@tabler/icons-react";
import { isMobile } from "react-device-detect";
import { AnimeIn } from "@/components/ui/AnimeIn";
import { animate as anime } from "animejs";

// ⚡ PERFORMANCE: Lazy load heavy sections to reduce initial bundle size
const Work = dynamic(() => import("@/components/sections/Work").then((mod) => mod.Work));
const About = dynamic(() => import("@/components/sections/About").then((mod) => mod.About));
const Contact = dynamic(() => import("@/components/sections/Contact").then((mod) => mod.Contact));

type ViewState = 'hero' | 'about' | 'work' | 'contact';

export function MobileDashboard() {
  const { isComplete } = usePreloader();
  const [activeView, setActiveView] = useState<ViewState>('hero');

  const navItems = [
    { id: 'hero', label: 'HOME', icon: IconHome },
    { id: 'work', label: 'WORK', icon: IconGridDots },
    { id: 'about', label: 'ABOUT', icon: IconCpu },
    { id: 'contact', label: 'CONTACT', icon: IconMail },
  ];

  return (
    <div className="h-screen w-full bg-[#050507] text-white overflow-hidden flex flex-col font-space relative">
      
      {/* =========================================
          1. STATUS BAR (iOS Style)
      ========================================= */}
      <AnimeIn 
        className="w-full px-6 py-2 flex items-center justify-between z-50 text-[10px] font-mono text-white/50 bg-black/20 backdrop-blur-sm"
        initial={{ translateY: -20, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        duration={10} // Just for show, since we want it after preloader
        delay={6000} // Sync with ripple end
      >
         <div className="flex items-center gap-2">
            <Clock />
         </div>
         <div className="flex items-center gap-2">
            <span className="text-[9px] tracking-widest opacity-50">{isMobile ? "LTE" : "WIFI"}</span>
            <IconSignal4g size={14} />
            <IconWifi size={14} />
            <IconBattery4 size={14} />
         </div>
      </AnimeIn>

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

         {activeView === 'hero' && (
            <AnimeIn 
                key="hero"
                className="absolute inset-0 z-10 overflow-hidden pb-16" 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                duration={300}
            >
                 <Hero />
            </AnimeIn>
         )}

         {activeView === 'work' && (
            <AnimeIn 
                key="work"
                className="absolute inset-0 z-10 overflow-hidden pb-16"
                initial={{ opacity: 0, translateX: 20 }}
                animate={{ opacity: 1, translateX: 0 }}
                duration={300}
            >
                <div className="p-2 pt-4 h-full overflow-y-auto">
                   <Work />
                </div>
            </AnimeIn>
         )}

         {activeView === 'about' && (
            <AnimeIn 
                key="about"
                className="absolute inset-0 z-10 overflow-hidden pb-16"
                initial={{ opacity: 0, translateX: 20 }}
                animate={{ opacity: 1, translateX: 0 }}
                duration={300}
            >
                <div className="p-2 pt-4 h-full overflow-y-auto">
                   <About />
                </div>
            </AnimeIn>
         )}

         {activeView === 'contact' && (
            <AnimeIn 
                key="contact"
                className="absolute inset-0 z-10 overflow-hidden pb-16 flex flex-col items-center justify-center"
                initial={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                duration={300}
            >
                <div className="p-2">
                   <Contact />
                </div>
            </AnimeIn>
         )}
      </div>

      {/* =========================================
          3. BOTTOM DOCK (Glassmorphism)
      ========================================= */}
      {isComplete && (
        <AnimeIn 
          className="absolute bottom-6 left-4 right-4 h-20 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl flex items-center justify-evenly z-50 overflow-hidden"
          initial={{ translateY: 100, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          duration={800}
          delay={500}
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
                              <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />
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
        </AnimeIn>
      )}

    </div>
  );
}
