"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconCpu, IconGridDots, IconMail, IconArrowUpRight } from "@tabler/icons-react";

/**
 * DESKTOP DASHBOARD (No-Scroll)
 * A grid-based interface where navigation is embedded in the cells.
 */
export function DesktopDashboard() {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  // Helper to handle hover state
  const handleHover = (id: string | null) => setHoveredCell(id);

  return (
    <div className="h-screen w-full bg-black text-white overflow-hidden relative font-space">
      
      {/* 🔮 BACKGROUND GRID LINES */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20 z-0">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="border border-white/10" />
        ))}
      </div>

      <div className="relative z-10 w-full h-full grid grid-cols-3 grid-rows-3">

        {/* 1. TOP LEFT: Status */}
        <div className="p-8 border-r border-b border-white/5 flex flex-col justify-between">
            <div className="text-xs text-mint-500 animate-pulse">● SYS.ONLINE</div>
            <div className="text-[10px] text-white/40 font-mono">ID: HARSHAL_V1.0</div>
        </div>

        {/* 2. TOP CENTER: Empty / Decoration */}
        <div className="border-r border-b border-white/5 p-8 flex items-center justify-center">
            {/* Maybe a small clock or weather? */}
        </div>

        {/* 3. TOP RIGHT: CONNECT */}
        <Link 
            href="/contact" 
            className="group border-b border-white/5 bg-black hover:bg-white/5 transition-colors relative flex flex-col items-center justify-center cursor-pointer"
            onMouseEnter={() => handleHover('contact')}
            onMouseLeave={() => handleHover(null)}
        >
            <IconMail size={40} className="text-white/50 group-hover:text-mint-400 transition-colors mb-4" />
            <span className="text-sm tracking-widest text-white/60 group-hover:text-white">INITIATE_CONTACT</span>
            <IconArrowUpRight className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-mint-500" />
        </Link>


        {/* 4. MIDDLE LEFT: WORK (MODULES) */}
        <Link 
            href="/work" 
            className="group border-r border-b border-white/5 bg-black hover:bg-white/5 transition-colors relative flex flex-col items-center justify-center cursor-pointer"
            onMouseEnter={() => handleHover('work')}
            onMouseLeave={() => handleHover(null)}
        >
            <IconGridDots size={40} className="text-white/50 group-hover:text-mint-400 transition-colors mb-4" />
            <span className="text-sm tracking-widest text-white/60 group-hover:text-white">MODULE_REGISTRY</span>
            <IconArrowUpRight className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-mint-500" />
        </Link>


        {/* 5. CENTER: IDENTITY (HERO) */}
        <div className="border-r border-b border-white/5 flex flex-col items-center justify-center bg-black relative overflow-hidden group">
            {/* Glitch Effect on Hover? */}
            <h2 className="text-xs tracking-[0.5em] text-mint-500 mb-2">SYSTEM ARCHITECT</h2>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white group-hover:scale-105 transition-transform duration-500">
                HARSHAL
            </h1>
            <div className="flex gap-2 mt-2">
                <span className="w-2 h-2 bg-mint-500 rounded-full" />
                <span className="w-2 h-2 bg-white/20 rounded-full" />
                <span className="w-2 h-2 bg-white/20 rounded-full" />
            </div>
        </div>


        {/* 6. MIDDLE RIGHT: ABOUT (SPECS) */}
        <Link 
            href="/about" 
            className="group border-b border-white/5 bg-black hover:bg-white/5 transition-colors relative flex flex-col items-center justify-center cursor-pointer"
            onMouseEnter={() => handleHover('about')}
            onMouseLeave={() => handleHover(null)}
        >
            <IconCpu size={40} className="text-white/50 group-hover:text-mint-400 transition-colors mb-4" />
            <span className="text-sm tracking-widest text-white/60 group-hover:text-white">SYSTEM_SPECS</span>
            <IconArrowUpRight className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-mint-500" />
        </Link>


        {/* 7. BOTTOM LEFT: Decoration */}
        <div className="border-r border-white/5 p-8">
             <div className="h-full w-full border border-dashed border-white/10 rounded flex items-center justify-center">
                <span className="text-[10px] text-white/20">AWAITING_INPUT</span>
             </div>
        </div>

        {/* 8. BOTTOM CENTER: Footer / Copyright */}
        <div className="border-r border-white/5 p-8 flex items-end justify-center">
            <span className="text-[10px] text-white/30">© 2026 HARSHAL OS</span>
        </div>

        {/* 9. BOTTOM RIGHT: Socials? */}
        <div className="p-8 flex items-center justify-center gap-4">
             {/* Social Icons could go here */}
        </div>

      </div>
    </div>
  );
}
