"use client";

import React, { useState } from "react";
import { animate as anime } from "animejs";
import { House, Briefcase, Fingerprint, PaperPlaneTilt } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { Spotlight } from "@/components/ui/Spotlight";
import { AnimeIn } from "@/components/ui/AnimeIn";
import { usePreloader } from "@/lib/preloader-context";

// ⚡ PERFORMANCE: Lazy load heavy sections to reduce initial bundle size
const Work = dynamic(() => import("@/components/sections/Work").then((mod) => mod.Work));
const About = dynamic(() => import("@/components/sections/About").then((mod) => mod.About));
const Contact = dynamic(() => import("@/components/sections/Contact").then((mod) => mod.Contact));

type ViewState = 'hero' | 'about' | 'work' | 'contact';

const BackgroundGrid = React.memo(() => (
  <AnimeIn
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.03 }}
    duration={2000}
    className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] grid-rows-[repeat(auto-fill,minmax(100px,1fr))] pointer-events-none opacity-[0.03]"
  >
    {[...Array(200)].map((_, i) => (
        <div key={i} className="border-[0.5px] border-white/20" />
    ))}
  </AnimeIn>
));

// 🎨 HEX COLORS (For calculating opacities)
const HEX_COLORS = [
    '#06b6d4', // Cyan
    '#f43f5e', // Rose
    '#7c3aed', // Violet
    '#f97316', // Orange
    '#facc15', // Yellow
    '#10b981', // Emerald
    '#3b82f6'  // Blue
];

// 1. GLASS GRADIENT (Stronger, 15%) - FIXED DIRECTION
const GLASS_GRADIENT_COLS = HEX_COLORS.map(hex => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},0.15)`;
});
const GLASS_STYLE = `linear-gradient(135deg, ${GLASS_GRADIENT_COLS.join(', ')})`;

// 2. BACKGROUND GRADIENT (Subtle, 3%) - ALTERNATING DIRECTION
const BG_GRADIENT_COLS = HEX_COLORS.map(hex => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},0.03)`;
});
const BG_GRADIENT_COLS_REVERSED = [...BG_GRADIENT_COLS].reverse();

export function DesktopDashboard() {
  const { isComplete } = usePreloader();
  const [activeView, setActiveView] = useState<ViewState>('hero');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navItems = [
    { id: 'hero', label: 'HOME', icon: House },
    { id: 'work', label: 'WORK', icon: Briefcase },
    { id: 'about', label: 'ABOUT', icon: Fingerprint },
    { id: 'contact', label: 'CONTACT', icon: PaperPlaneTilt },
  ];

  return (
    <div className="h-screen w-full bg-transparent text-white overflow-hidden flex font-space relative">
      
      {/* =========================================
          LEFT: MAIN STAGE (Transparent for Void to show through)
      ========================================= */}
      <div className="flex-1 relative flex flex-col min-w-0">
          
          {/* 🟢 GLOBAL FOOTER (Fades in) */}
          <AnimeIn 
             className="absolute bottom-0 left-0 p-8 z-50 pointer-events-none mix-blend-plus-lighter flex gap-4 text-[10px] font-mono text-white/30"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             duration={1000}
             delay={500}
          >
               <span>© 2026 All right and wrongs reserved</span>
          </AnimeIn>

          {/* 🎭 CONTENT AREA (FULL FILL) */}
          <div className="flex-1 relative overflow-hidden">
             
             {/* BACKGROUND GRID (Subtle Map) */}
             <BackgroundGrid />

             {/* HERO VIEW */}
             {activeView === 'hero' && (
                 <AnimeIn 
                     key="hero"
                     className="absolute inset-0 z-10"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     duration={500}
                 >
                     <Hero />
                 </AnimeIn>
             )}

             {/* WORK VIEW */}
             {isComplete && activeView === 'work' && (
                 <AnimeIn 
                     key="work"
                     className="absolute inset-0 overflow-y-auto custom-scrollbar z-10"
                     initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                     animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                     duration={500}
                 > 
                    <div className="min-h-full p-4 md:p-8 pt-8">
                        <Work />
                    </div>
                 </AnimeIn>
             )}

             {/* ABOUT VIEW */}
             {isComplete && activeView === 'about' && (
                 <AnimeIn 
                     key="about"
                     className="absolute inset-0 overflow-y-auto custom-scrollbar z-10"
                     initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                     animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                     duration={500}
                 > 
                    <div className="min-h-full p-4 md:p-8 pt-8">
                        <About />
                    </div>
                 </AnimeIn>
             )}

             {/* CONTACT VIEW */}
             {isComplete && activeView === 'contact' && (
                 <AnimeIn 
                     key="contact"
                     className="absolute inset-0 overflow-hidden flex items-center justify-center z-10"
                     initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                     animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                     duration={500}
                 > 
                    <div className="w-full h-full flex items-center justify-center p-4 pt-8">
                        <Contact />
                    </div>
                 </AnimeIn>
             )}
          </div>
      </div>


      {/* =========================================
          RIGHT: NAVIGATION (SMOKED GLASS + SPOTLIGHT)
      ========================================= */}
      <Spotlight 
        className="absolute top-1/2 -translate-y-1/2 right-6 w-[100px] md:w-[120px] lg:w-[140px] h-fit rounded-[24px] flex flex-col bg-transparent z-20 transition-opacity duration-1000 overflow-hidden"
        fill="rgba(255, 255, 255, 0.15)"
      > 
        <div className="flex flex-col w-full">
          {navItems.map((item, idx) => {
              const isActive = activeView === item.id;
              const isHovered = hoveredLink === item.id;
              
              const activeBgSeries = idx % 2 === 0 ? BG_GRADIENT_COLS : BG_GRADIENT_COLS_REVERSED;
              const buttonStyle = `linear-gradient(135deg, ${activeBgSeries.join(', ')})`;

              return (
                <button
                    key={item.id}
                    onClick={() => setActiveView(item.id as ViewState)}
                    onMouseEnter={(e) => {
                        setHoveredLink(item.id);
                        const icon = e.currentTarget.querySelector('.nav-icon');
                        const text = e.currentTarget.querySelector('.nav-text');
                        if (icon) anime(icon, { translateX: -50, opacity: 0, duration: 400, easing: 'easeOutQuart' });
                        if (text) anime(text, { translateX: 0, opacity: 1, duration: 400, easing: 'easeOutQuart' });
                    }}
                    onMouseLeave={(e) => {
                        setHoveredLink(null);
                        const icon = e.currentTarget.querySelector('.nav-icon');
                        const text = e.currentTarget.querySelector('.nav-text');
                        if (icon) anime(icon, { translateX: 0, opacity: isActive ? 1 : 0.6, duration: 400, easing: 'easeOutQuart' });
                        if (text) anime(text, { translateX: 50, opacity: 0, duration: 400, easing: 'easeOutQuart' });
                    }}
                    className={`
                        group aspect-square w-full border-t border-b border-white/[0.03] relative flex flex-col items-center justify-center cursor-pointer transition-all duration-500
                        hover:bg-white/[0.02]
                        first:border-t-white/[0.03]
                        z-10
                    `}
                    style={{ background: buttonStyle }}
                >
                    {/* 💠 SCI-FI GLASS SHARDS */}
                    {isActive && (
                        <div className={`absolute z-0 flex flex-col rounded-[12px] overflow-visible transition-all duration-300 ${isHovered ? 'inset-x-4 inset-y-[25%]' : 'inset-[25%]'}`}>
                            {[0, 1, 2, 3].map((i) => {
                                const direction = (i === 0 || i === 3) ? -1 : 1;
                                return (
                                    <AnimeIn
                                        key={i}
                                        initial={{ translateX: direction * 40, opacity: 0 }}
                                        animate={{ translateX: 0, opacity: 1 }}
                                        duration={500}
                                        delay={i * 20}
                                        className={`
                                            w-full h-[25%] 
                                            backdrop-blur-[4px] border-l border-r border-white/30
                                            ${i === 0 ? 'rounded-t-[12px] border-t shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]' : ''}
                                            ${i === 3 ? 'rounded-b-[12px] border-b shadow-[0_4px_10px_rgba(0,0,0,0.3)]' : ''}
                                        `}
                                        style={{ background: GLASS_STYLE }}
                                    />
                                );
                            })}
                        </div> 
                    )}

                    <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden text-white group-hover:text-white transition-colors">
                        {/* ICON */}
                        <div 
                           className="nav-icon"
                           style={{ 
                               opacity: isActive ? 1 : 0.6,
                               transform: isActive ? 'scale(1.1)' : 'scale(1)'
                           }}
                        >
                            <item.icon 
                                size={28} 
                                weight="duotone"
                                className={isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]' : 'drop-shadow-sm'}
                            />
                        </div>

                        {/* TEXT */}
                        <div 
                           className="nav-text absolute inset-0 flex items-center justify-center pointer-events-none"
                           style={{ transform: 'translateX(50px)', opacity: 0 }}
                        >
                            <span className="font-mono text-xs tracking-[0.2em] font-bold text-white/90 uppercase mr-[-0.2em]">
                                {item.label}
                            </span>
                        </div>
                    </div>
                </button>
              );
          })}
        </div>
      </Spotlight>

    </div>
  );
}
