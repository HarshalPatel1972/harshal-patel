"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lightning } from "@phosphor-icons/react";
import Image from "next/image";
import { usePreloader } from "@/lib/preloader-context";
import { useEffect, useState } from "react";
import { HeroGrid } from "@/components/ui/HeroGrid";

export function Hero() {
  const { isComplete } = usePreloader();
  const [showContent, setShowContent] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    "Problem Solving?",
    "Web Designing?",
    "UI Engineering?",
    "Performance Tuning?",
    "Backend Architecture?"
  ];

  // Cycle Questions
  useEffect(() => {
    if (!showContent) return;
    const interval = setInterval(() => {
      setCurrentQuestion((prev) => (prev + 1) % questions.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [showContent]);

  // Trigger Content Show
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  return (
    <section className="relative min-h-screen flex flex-col justify-end px-4 md:px-20 overflow-hidden bg-[#050505] pb-20 md:pb-32">
      
      {/* 🖼️ HERO BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/harshal-1.png" 
          alt="Harshal Patel"
          fill
          className="object-cover object-[50%_25%]"
          priority
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#050505] via-[#050505]/40 md:via-transparent to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
      </div>

      <HeroGrid />

      <AnimatePresence>
        {showContent && (
          <div className="relative z-20 w-full max-w-[90rem] mx-auto flex flex-col justify-end h-full pointer-events-none">
            
            {/* 1. ROTATING QUESTION */}
            <div className="mb-2 md:mb-6 h-12 md:h-20 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.h2 
                  key={currentQuestion}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-2xl md:text-5xl font-bold text-white/80 font-space tracking-tight pl-2"
                >
                  {questions[currentQuestion]}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* 2. MASSIVE ANSWER */}
            <motion.h1 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-6xl md:text-[8rem] lg:text-[10rem] leading-[0.85] font-black text-white uppercase font-space tracking-tighter mix-blend-overlay opacity-90"
            >
              I CAN DO<br />THIS ALL DAY
            </motion.h1>

          </div>
        )}
      </AnimatePresence>
      
      {/* CREDITS */}
      <motion.div 
        className="absolute bottom-6 md:bottom-12 right-6 md:right-20 text-right z-30"
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
