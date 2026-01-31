"use client";

import { motion, AnimatePresence } from "framer-motion";
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
    <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 overflow-hidden bg-black">
      
      {/* 🟢 STATUS INDICATOR (Bottom Left/Center) */}
      <motion.div 
        className="absolute bottom-12 left-6 md:left-12 flex items-center gap-3 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={showContent ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span className="text-white/60 font-sans text-sm font-medium tracking-wide">
          Open to New Opportunities
        </span>
      </motion.div>

      <AnimatePresence>
        {isComplete && (
          <div className="relative z-10 max-w-5xl w-full text-left">
            
            {/* 🖊️ TYPOGRAPHIC HERO STATEMENT */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white">
              <motion.span 
                 className="block text-white/90 mb-2"
                 initial={{ opacity: 0, y: 20 }}
                 animate={showContent ? { opacity: 1, y: 0 } : {}}
                 transition={{ duration: 0.6, delay: 0.2 }}
              >
                A problem-solver at heart, I am a
              </motion.span>
              
              <motion.span 
                className="block text-[#b684f2] mb-2" // Purple Highlight
                initial={{ opacity: 0, y: 20 }}
                animate={showContent ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Product Designer
              </motion.span>
              
              <motion.span 
                className="block text-white/90"
                 initial={{ opacity: 0, y: 20 }}
                 animate={showContent ? { opacity: 1, y: 0 } : {}}
                 transition={{ duration: 0.6, delay: 0.6 }}
              >
                who turns user needs into impactful solutions
              </motion.span>
              
              <motion.span 
                className="block text-white/90 mt-2"
                 initial={{ opacity: 0, y: 20 }}
                 animate={showContent ? { opacity: 1, y: 0 } : {}}
                 transition={{ duration: 0.6, delay: 0.8 }}
              >
                while ensuring product teams meet their KPIs.
              </motion.span>
            </h1>

          </div>
        )}
      </AnimatePresence>
      
      {/* 🎞️ SCANLINE (Subtle Texture) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </section>
  );
}
