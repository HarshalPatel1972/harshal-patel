"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePreloader } from "@/lib/preloader-context";
import { useEffect, useState } from "react";

export function Hero() {
  const { isComplete } = usePreloader();
  const [showContent, setShowContent] = useState(false);

  // Synchronize avec le flash de transition du preloader
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  return (
    <section className="relative min-h-screen pt-12 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      
      {/* 💥 THE IMPACT REVEAL */}
      <AnimatePresence>
        {isComplete && (
          <div className="relative z-10">
            {/* NAME: Impact Animation */}
            <motion.h1
              className="text-6xl md:text-9xl font-bold tracking-tighter text-white mb-4"
              initial={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
              animate={showContent ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
              transition={{ 
                duration: 0.8, 
                ease: [0.25, 1, 0.5, 1], // Heavy Impact Easing
                delay: 0.1 
              }}
            >
                HARSHAL PATEL
            </motion.h1>

            {/* ROLE: Systems Engineer */}
            <motion.p
              className="text-lg md:text-2xl text-white/40 font-mono tracking-widest uppercase mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Systems Engineer // Full-Stack Architect
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <a 
                href="#work" 
                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
              >
                VIEW_ENTITIES
              </a>
              <a 
                href="#contact" 
                className="px-8 py-4 border border-white/10 text-white font-medium rounded-full hover:bg-white/5 transition-colors"
              >
                REQUEST_ACCESS
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Backlight / Ambient Glow Reveal */}
      <motion.div 
        className="absolute inset-0 z-0 bg-gradient-to-b from-zinc-900/50 to-black pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isComplete ? { opacity: 1 } : {}}
        transition={{ duration: 2 }}
      />
      
      {/* 🎞️ SCANLINE EFFECT (Cyberpunk Vibe) */}
      <div className="absolute inset-0 pointer-events-none z-20 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </section>
  );
}
