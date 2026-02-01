"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { House, Briefcase, Fingerprint, PaperPlaneTilt } from "@phosphor-icons/react";
import { Work } from "@/components/sections/Work";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Spotlight } from "@/components/ui/Spotlight";

type ViewState = 'hero' | 'about' | 'work' | 'contact';




import { usePreloader } from "@/lib/preloader-context";

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
      <div className="flex-1 relative flex flex-col min-w-0 mr-[100px] md:mr-[120px] lg:mr-[140px]">
          
          {/* 🟢 GLOBAL HEADER (DISABLED) */}
          {/* <motion.div 
             className="absolute top-0 left-0 p-8 z-50 pointer-events-none mix-blend-plus-lighter"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 0.5 }}
          >
              <h1 className="text-2xl font-black tracking-tighter text-white/90">
                  HARSHAL PATEL<span className="text-emerald-500/80">.</span>
              </h1>
              <p className="text-[10px] tracking-[0.2em] text-white/40 mt-1 font-mono">
                  SOFTWARE ENGINEER
              </p>
          </motion.div> */}

          {/* 🟢 GLOBAL FOOTER (Fades in) */}
          <motion.div 
             className="absolute bottom-0 left-0 p-8 z-50 pointer-events-none mix-blend-plus-lighter flex gap-4 text-[10px] font-mono text-white/30"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 0.5 }}
          >
               <span>© 2026</span>
               <span>//</span>
               <span>ALL_SYSTEMS_NOMINAL</span>
          </motion.div>

          {/* 🎭 CONTENT AREA (FULL FILL) */}
          <div className="flex-1 relative overflow-hidden">
             
             {/* BACKGROUND GRID (Subtle Map) */}
             <motion.div 
                className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] grid-rows-[repeat(auto-fill,minmax(100px,1fr))] pointer-events-none opacity-[0.03]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.03 }}
                transition={{ duration: 2 }}
             >
                {[...Array(200)].map((_, i) => (
                    <div key={i} className="border-[0.5px] border-white/20" />
                ))}
            </motion.div>

            <AnimatePresence mode="wait">
                
                {/* HERO VIEW - MAXIMIZED CONTENT */}
                {activeView === 'hero' && (
                    <motion.div 
                        key="hero"
                        className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-16 z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                         <div className="flex flex-col items-start max-w-4xl w-full">
                             
                             {/* 1. Main Title with Animations */}
                             <h1 className="font-space font-bold text-5xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tighter text-white mb-8 opacity-90">
                                <div className="inline-block">
                                  SYSTEM
                                </div>
                                <div className="inline-block text-white/80">
                                  ARCHITECT
                                </div>
                             </h1>

                             {/* 2. Description */}
                             <motion.div 
                                className="max-w-2xl border-l border-white/10 pl-6 space-y-4 mb-12"
                             >
                                <p className="font-mono text-sm md:text-lg text-white/50 leading-relaxed max-w-md">
                                  <span className="text-emerald-500/50 font-bold">{`>`}</span> Executing logical design patterns to solve complex user problems.
                                </p>
                             </motion.div>

                             {/* 3. Action Buttons (Glassy) */}
                             <motion.div 
                                className="flex flex-col sm:flex-row gap-6"
                             >
                                 <button 
                                   onClick={() => setActiveView('work')}
                                   className="group relative px-8 py-4 bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-500 overflow-hidden text-left backdrop-blur-sm"
                                 >
                                    <span className="font-mono text-xs font-bold text-white/70 tracking-[0.2em] group-hover:text-white transition-colors relative z-10">
                                      [ ACCESS_WORK ]
                                    </span>
                                 </button>
                                 <button 
                                   onClick={() => setActiveView('contact')}
                                   className="px-8 py-4 border border-transparent hover:border-white/5 text-left text-white/30 hover:text-white/60 transition-colors"
                                 >
                                    <span className="font-mono text-xs tracking-[0.2em]">
                                      // INITIATE_CONTACT
                                    </span>
                                 </button>
                             </motion.div>
                         </div>

                         {/* 4. Status Indicator */}
                         <motion.div 
                            className="absolute bottom-12 right-12 text-right hidden md:block opacity-40 mix-blend-plus-lighter"
                         >
                            <span className="block font-mono text-[9px] text-white/50 tracking-widest mb-1">STATUS</span>
                            <span className="text-emerald-500 font-mono text-xs tracking-wider flex items-center gap-2 justify-end">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              ONLINE
                            </span>
                         </motion.div>
                    </motion.div>
                )}

                {/* WORK VIEW */}
                {isComplete && activeView === 'work' && (
                    <motion.div 
                        key="work"
                        className="absolute inset-0 overflow-y-auto no-scrollbar z-10"
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 0.5 }}
                    > 
                       <div className="min-h-full p-8 md:p-16 pt-32">
                           <Work />
                       </div>
                    </motion.div>
                )}

                {/* ABOUT VIEW */}
                {isComplete && activeView === 'about' && (
                    <motion.div 
                        key="about"
                        className="absolute inset-0 overflow-y-auto no-scrollbar z-10"
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 0.5 }}
                    > 
                       <div className="min-h-full p-8 md:p-16 pt-32">
                           <About />
                       </div>
                    </motion.div>
                )}

                {/* CONTACT VIEW */}
                {isComplete && activeView === 'contact' && (
                    <motion.div 
                        key="contact"
                        className="absolute inset-0 overflow-y-auto no-scrollbar flex items-center justify-center z-10"
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 0.5 }}
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
          RIGHT: NAVIGATION (SMOKED GLASS + SPOTLIGHT)
      ========================================= */}
      <Spotlight 
        className="absolute top-1/2 -translate-y-1/2 right-6 w-[100px] md:w-[120px] lg:w-[140px] h-fit rounded-[24px] flex flex-col bg-transparent z-20 transition-opacity duration-1000 overflow-hidden"
        fill="rgba(255, 255, 255, 0.15)"
      > 
        <motion.div
           className="flex flex-col w-full"
           initial={{ opacity: 1, x: 0 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0 }}
        >
          {navItems.map((item, idx) => {
              const isActive = activeView === item.id;
              const isHovered = hoveredLink === item.id;

              // 🎨 HEX COLORS (For calculating opacities)
              const hexColors = [
                  '#06b6d4', // Cyan
                  '#f43f5e', // Rose
                  '#7c3aed', // Violet
                  '#f97316', // Orange
                  '#facc15', // Yellow
                  '#10b981', // Emerald
                  '#3b82f6'  // Blue
              ];

              // 1. GLASS GRADIENT (Stronger, 15%) - FIXED DIRECTION
              const glassGradientCols = hexColors.map(hex => {
                  const r = parseInt(hex.slice(1, 3), 16);
                  const g = parseInt(hex.slice(3, 5), 16);
                  const b = parseInt(hex.slice(5, 7), 16);
                  return `rgba(${r},${g},${b},0.15)`;
              });
              const glassStyle = `linear-gradient(135deg, ${glassGradientCols.join(', ')})`;

              // 2. BACKGROUND GRADIENT (Subtle, 3%) - ALTERNATING DIRECTION
              const bgGradientCols = hexColors.map(hex => {
                  const r = parseInt(hex.slice(1, 3), 16);
                  const g = parseInt(hex.slice(3, 5), 16);
                  const b = parseInt(hex.slice(5, 7), 16);
                  return `rgba(${r},${g},${b},0.03)`;
              });
              
              const activeBgSeries = idx % 2 === 0 ? bgGradientCols : [...bgGradientCols].reverse();
              const buttonStyle = `linear-gradient(135deg, ${activeBgSeries.join(', ')})`;

              return (
                <button
                    key={item.id}
                    onClick={() => setActiveView(item.id as ViewState)}
                    onMouseEnter={() => setHoveredLink(item.id)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={`
                        group aspect-square w-full border-t border-b border-white/[0.03] relative flex flex-col items-center justify-center cursor-pointer transition-all duration-500
                        hover:bg-white/[0.02]
                        first:border-t-white/[0.03]
                        z-10
                    `}
                    style={{ background: buttonStyle }}
                >
                    {/* 💠 SCI-FI GLASS SHARDS (Split Transition) */}
                    <AnimatePresence mode="wait">
                        {isActive && (
                            <div className={`absolute z-0 flex flex-col rounded-[12px] overflow-visible transition-all duration-300 ${isHovered ? 'inset-x-4 inset-y-[25%]' : 'inset-[25%]'}`}>
                                {/* Use 4 Shards for the Split Effect */}
                                {[0, 1, 2, 3].map((i) => {
                                    // Direction: Top/Bottom Left (-1), Middle Right (1)
                                    const direction = (i === 0 || i === 3) ? -1 : 1;
                                    
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ x: direction * 40, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: direction * 40, opacity: 0 }}
                                            transition={{ 
                                                type: "spring", 
                                                stiffness: 350, 
                                                damping: 25,
                                                mass: 0.8,
                                                delay: i * 0.02 // Subtle stagger
                                            }}
                                            className={`
                                                w-full h-[25%] 
                                                backdrop-blur-[4px] border-l border-r border-white/30
                                                ${i === 0 ? 'rounded-t-[12px] border-t shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]' : ''}
                                                ${i === 3 ? 'rounded-b-[12px] border-b shadow-[0_4px_10px_rgba(0,0,0,0.3)]' : ''}
                                            `}
                                            style={{
                                                background: glassStyle
                                            }}
                                        />
                                    );
                                })}
                            </div> 
                        )}
                    </AnimatePresence>

                    <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden text-white group-hover:text-white transition-colors">
                        {/* ICON: Slides Left on Hover */}
                        <motion.div 
                           animate={{ 
                               x: isHovered ? -50 : 0,
                               opacity: isHovered ? 0 : (isActive ? 1 : 0.6),
                               scale: isActive ? 1.1 : 1
                           }}
                           transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <item.icon 
                                size={28} 
                                weight="duotone"
                                className={isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]' : 'drop-shadow-sm'}
                            />
                        </motion.div>

                        {/* TEXT: Slides In from Right on Hover */}
                        <motion.div 
                           className="absolute inset-0 flex items-center justify-center pointer-events-none"
                           initial={{ x: 50, opacity: 0 }}
                           animate={{ 
                               x: isHovered ? 0 : 50, 
                               opacity: isHovered ? 1 : 0 
                           }}
                           transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <span className="font-mono text-xs tracking-[0.2em] font-bold text-white/90 uppercase mr-[-0.2em]">
                                {item.label}
                            </span>
                        </motion.div>
                    </div>
                </button>
              );
          })}
        </motion.div>
      </Spotlight>

    </div>
  );
}
