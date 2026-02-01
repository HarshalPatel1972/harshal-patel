"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePreloader } from "@/lib/preloader-context";
import { useEffect, useState } from "react";

export function Hero() {
  const { isComplete } = usePreloader();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-4 md:px-20 overflow-hidden bg-[#050505] pt-20 md:pt-0">
      
      {/* 🖼️ HERO BACKGROUND IMAGE (Full Page) */}
      {/* 🖼️ HERO BACKGROUND IMAGE (Full Page) */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/harshal-1.png" 
          alt="Harshal Patel"
          fill
          className="object-cover object-[50%_25%]"
          priority
        />
        {/* Gradient Scrims: Fade Left (Text) -> Right (Image) */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#050505] via-[#050505]/80 md:via-transparent to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
      </div>

      {/* 📐 TECHNICAL GRID / GUIDE LINES (Hidden on Mobile) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10 hidden md:block">
        <div className="absolute top-[20%] left-0 w-full h-[1px] bg-white"></div>
        <div className="absolute bottom-[20%] left-0 w-full h-[1px] bg-white"></div>
        <div className="absolute top-0 left-[10%] w-[1px] h-full bg-white"></div>
        <div className="absolute top-0 right-[10%] w-[1px] h-full bg-white"></div>
      </div>

      <AnimatePresence>
        {isComplete && (
          <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* 🟢 COLUMN 1: SYSTEM META (2 Cols) */}
            <motion.div 
              className="md:col-span-2 flex flex-row md:flex-col gap-4 font-mono text-[9px] md:text-[10px] text-white/40 tracking-widest uppercase md:pt-4 justify-between md:justify-start border-b md:border-b-0 border-white/10 pb-4 md:pb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={showContent ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
               {/* ... Keep existing content (SYS.ONLINE, LOC, ID) ... */}
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                 <span>SYS.ONLINE</span>
              </div>
              <div>LOC: VARANASI_</div>
              <div className="hidden md:block">ID: HARSHAL_V1.0</div>
            </motion.div>

            {/* 🟦 COLUMN 2: MAIN TEXT CONTENT (6 Cols) */}
            <div className="md:col-span-6 relative z-20">
              
              <h1 className="font-space font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tighter text-white mb-6 md:mb-8">
                <motion.div 
                   initial={{ opacity: 0, y: 50 }}
                   animate={showContent ? { opacity: 1, y: 0 } : {}}
                   transition={{ duration: 0.8, ease: "circOut", delay: 0.2 }}
                >
                  SOFTWARE
                </motion.div>
                <motion.div 
                   className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400"
                   initial={{ opacity: 0, y: 50 }}
                   animate={showContent ? { opacity: 1, y: 0 } : {}}
                   transition={{ duration: 0.8, ease: "circOut", delay: 0.3 }}
                >
                  ENGINEER
                </motion.div>
              </h1>

              <motion.div 
                className="max-w-xl border-l-[1px] border-white/20 pl-4 md:pl-6 space-y-4"
                initial={{ opacity: 0 }}
                animate={showContent ? { opacity: 1 } : {}}
                transition={{ delay: 0.6, duration: 1 }}
              >
                <p className="font-mono text-xs sm:text-sm md:text-base text-white/70 leading-relaxed">
                  <span className="text-emerald-500 font-bold">{`>`}</span> Executing logical design patterns to solve complex user problems.
                </p>
                <p className="font-mono text-xs sm:text-sm md:text-base text-white/70 leading-relaxed">
                  <span className="text-cyan-500 font-bold">{`>`}</span> Optimizing for scale, performance, and aesthetic precision.
                </p>
              </motion.div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-12 w-full sm:w-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={showContent ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
              >
                 <a 
                   href="#work"
                   className="group relative px-6 py-4 sm:py-3 bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-colors overflow-hidden text-center sm:text-left"
                 >
                    <div className="absolute inset-0 bg-emerald-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="font-mono text-xs font-bold text-white tracking-[0.2em] group-hover:text-emerald-400 transition-colors">
                      [ ACCESS_WORK ]
                    </span>
                 </a>
                 <a 
                   href="#contact"
                   className="px-6 py-4 sm:py-3 border border-transparent hover:border-white/10 transition-colors text-center sm:text-left"
                 >
                    <span className="font-mono text-xs text-white/50 hover:text-white transition-colors tracking-[0.2em]">
                      // INITIATE_CONTACT
                    </span>
                 </a>
              </motion.div>
            </div>

            {/* 🖼️ HERO IMAGE MOVED TO BACKGROUND */}

          </div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="absolute bottom-6 md:bottom-12 right-6 md:right-20 text-right"
        initial={{ opacity: 0 }}
        animate={showContent ? { opacity: 1 } : {}}
        transition={{ delay: 1.5 }}
      >
        <span className="block font-mono text-[8px] md:text-[9px] text-white/30 tracking-widest mb-1">CURRENT_STATUS</span>
        <span className="text-emerald-400 font-mono text-[10px] md:text-xs tracking-wider">
          OPEN_FOR_OPPORTUNITIES
        </span>
      </motion.div>

    </section>
  );
}
