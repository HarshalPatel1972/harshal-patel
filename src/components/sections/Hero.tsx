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

      {/* 📐 TECHNICAL GRID: 10 COLUMNS (SQUARES) */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 hidden md:block opacity-10"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '10vw 10vw'
        }}
      />



      <AnimatePresence>
        {isComplete && (
          <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            




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
