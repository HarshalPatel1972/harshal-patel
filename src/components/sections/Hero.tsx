"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lightning } from "@phosphor-icons/react";
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
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#050505] via-[#050505]/20 md:via-transparent to-transparent" />
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
            


            {/* 🟦 COLUMN 2: MAIN TEXT CONTENT (5 Cols - Safe Zone) */}
            <div className="md:col-span-5 relative z-20">
              
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
        <span className="block font-mono text-[8px] md:text-[9px] text-white/30 tracking-widest mb-1">CREDITS</span>
        <a href="https://fiddle.digital" target="_blank" rel="noopener noreferrer" className="text-white font-space font-bold text-[10px] md:text-xs tracking-wider flex items-center justify-end gap-2 hover:text-cyan-400 transition-colors">
          <Lightning weight="fill" className="text-cyan-400 w-3 h-3" />
          Fiddle.Digital
        </a>
      </motion.div>

    </section>
  );
}
