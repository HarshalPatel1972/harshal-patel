"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconCpu, IconGridDots, IconMail, IconArrowUpRight, IconHome, IconMenu2, IconArrowRight, IconPrompt } from "@tabler/icons-react";
import { Work } from "@/components/sections/Work";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";

type ViewState = 'hero' | 'about' | 'work' | 'contact';





export function DesktopDashboard() {
  const [activeView, setActiveView] = useState<ViewState>('hero');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navItems = [
    { id: 'hero', label: 'HOME', icon: IconHome },
    { id: 'work', label: 'WORK', icon: IconGridDots },
    { id: 'about', label: 'ABOUT', icon: IconCpu },
    { id: 'contact', label: 'CONTACT', icon: IconMail },
  ];

  return (
    <div className="h-screen w-full bg-black text-white overflow-hidden flex font-space">
      
      {/* =========================================
          LEFT: MAIN STAGE (Rest of Space)
      ========================================= */}
      <div className="flex-1 relative border-r border-white/5 flex flex-col min-w-0">
          
          {/* 🟢 GLOBAL HEADER (FIXED TOP-LEFT) */}
          <div className="absolute top-0 left-0 p-8 z-50 pointer-events-none mix-blend-difference">
              <h1 className="text-2xl font-black tracking-tighter text-white">
                  HARSHAL PATEL<span className="text-mint-500">.</span>
              </h1>
              <p className="text-[10px] tracking-[0.2em] text-white/60 mt-1">
                  SYSTEM ARCHITECT
              </p>
          </div>

          {/* 🟢 GLOBAL FOOTER (FIXED BOTTOM-LEFT) */}
          <div className="absolute bottom-0 left-0 p-8 z-50 pointer-events-none mix-blend-difference flex gap-4 text-[10px] font-mono text-white/40">
               <span>© 2026</span>
               <span>//</span>
               <span>ALL_SYSTEMS_NOMINAL</span>
          </div>

          {/* 🎭 CONTENT AREA (FULL FILL) */}
          <div className="flex-1 relative overflow-hidden bg-black/50">
             
             {/* BACKGROUND GRID */}
             <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 pointer-events-none opacity-5">
                {[...Array(144)].map((_, i) => (
                    <div key={i} className="border border-white/10" />
                ))}
            </div>

            <AnimatePresence mode="wait">
                
                {/* HERO VIEW - MAXIMIZED */}
                {activeView === 'hero' && (
                    <motion.div 
                        key="hero"
                        className="absolute inset-0 overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                         {/* Using the original Hero component as requested */}
                         <div className="w-full h-full flex items-center justify-center scale-90 md:scale-100 origin-center">
                            <Hero />
                         </div>
                    </motion.div>
                )}

                {/* WORK VIEW */}
                {activeView === 'work' && (
                    <motion.div 
                        key="work"
                        className="absolute inset-0 overflow-y-auto no-scrollbar"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    > 
                       <div className="min-h-full p-8 md:p-16 pt-32">
                           <Work />
                       </div>
                    </motion.div>
                )}

                {/* ABOUT VIEW */}
                {activeView === 'about' && (
                    <motion.div 
                        key="about"
                        className="absolute inset-0 overflow-y-auto no-scrollbar"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    > 
                       <div className="min-h-full p-8 md:p-16 pt-32">
                           <About />
                       </div>
                    </motion.div>
                )}

                {/* CONTACT VIEW */}
                {activeView === 'contact' && (
                    <motion.div 
                        key="contact"
                        className="absolute inset-0 overflow-y-auto no-scrollbar flex items-center justify-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    > 
                       <div className="w-full h-full flex items-center justify-center p-8 pt-32">
                           <Contact />
                       </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
      </div>


      {/* =========================================
          RIGHT: NAVIGATION (CLEAN STACK)
      ========================================= */}
      <div className="w-[100px] md:w-[120px] lg:w-[140px] border-l border-white/5 flex flex-col justify-center bg-black z-20">
          
          {/* JUST NAV SQUARES - Centered Vertically */}
          
          {navItems.map((item) => {
              const isActive = activeView === item.id;
              const isHovered = hoveredLink === item.id;

              return (
                <button
                    key={item.id}
                    onClick={() => setActiveView(item.id as ViewState)}
                    onMouseEnter={() => setHoveredLink(item.id)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={`
                        group aspect-square w-full border-b border-t border-white/5 relative flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                        ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
                        first:border-t-white/5
                    `}
                >
                    {/* Active Indicator Corner */}
                    {isActive && (
                        <motion.div 
                            layoutId="activeCorner"
                            className="absolute top-2 right-2 w-2 h-2 bg-mint-500"
                        />
                    )}

                    <motion.div 
                       animate={{ scale: isHovered || isActive ? 1.1 : 1 }}
                       transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <item.icon 
                            size={28} 
                            stroke={1.5}
                            className={`mb-2 transition-colors ${isActive ? 'text-mint-400' : 'text-white/40 group-hover:text-white'}`} 
                        />
                    </motion.div>
                    
                    <span className={`text-[10px] tracking-widest font-bold transition-colors uppercase ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>
                        {item.label}
                    </span>
                </button>
              );
          })}

      </div>

    </div>
  );
}
