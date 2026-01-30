"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePreloader } from "@/lib/preloader-context";
import { APPS } from "@/lib/apps";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isComplete } = usePreloader();

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center pointer-events-none"
      initial={{ y: -20, opacity: 0 }}
      animate={isComplete ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-full max-w-7xl px-6 py-4 flex items-center justify-between pointer-events-auto">
        
        {/* Logo / Brand */}
        <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={isComplete ? { opacity: 1, x: 0 } : {}}
           className="text-white font-bold tracking-tight text-lg"
        >
          HARSHAL<span className="text-zinc-500">.</span>OS
        </motion.div>

        {/* 📦 THE CAPSULE (NOW THE NAVBAR PILL) */}
        <motion.div
           layout
           layoutId="navbar-pill"
           className={cn(
             "relative flex items-center px-4 py-2 rounded-full border border-white/10 bg-zinc-900/60 backdrop-blur-md shadow-xl transition-all duration-500",
             isComplete ? "opacity-100" : "opacity-0"
           )}
        >
            <div className="flex items-center gap-4">
               {APPS.map((app) => (
                    <motion.div
                        key={app.name}
                        layoutId={app.name}
                        className="group relative cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                        <app.icon 
                            size={18} 
                            className="text-white hover:text-white transition-colors"
                            style={{ 
                                filter: `drop-shadow(0 0 8px ${app.hex}80)`,
                                color: app.hex
                            }}
                        />
                        {/* Hover Tooltip (Optional) */}
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                            {app.name}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>

        {/* Right Actions / Contact */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isComplete ? { opacity: 1, x: 0 } : {}}
          className="flex items-center gap-4"
        >
           <a 
             href="#contact" 
             className="px-4 py-2 text-[10px] font-mono tracking-widest uppercase border border-white/10 rounded-full hover:bg-white/5 transition-colors text-white/70 hover:text-white"
           >
             CONNECT_USER
           </a>
        </motion.div>
      </div>
    </motion.nav>
  );
}
