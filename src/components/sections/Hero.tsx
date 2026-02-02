"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react"; // Added useRef
import Image from "next/image";
import { usePreloader } from "@/lib/preloader-context";
import { HeroGrid } from "@/components/ui/HeroGrid";

export function Hero() {
  const { isComplete } = usePreloader();
  const [showContent, setShowContent] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    "Designing Systems?",   // SDE
    "Shipping Features?",   // Full Stack
    "Crafting UI?",         // Frontend
    "Training Models?",     // Data Scientist
    "Analyzing Trends?",    // Data Analyst
    "Solving Problems?",    // Core Engineering
  ];

  // Cycle Questions
  useEffect(() => {
    if (!showContent) return;
    const interval = setInterval(() => {
      setCurrentQuestion((prev) => (prev + 1) % questions.length);
    }, 4500); 
    return () => clearInterval(interval);
  }, [showContent, questions.length]);

  // Trigger Content Show
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);
  
  return (
    <section 
      className="relative min-h-screen flex flex-col justify-end px-4 md:px-10 overflow-hidden bg-[#050505] pb-8 md:pb-12"
    >
      {/* 🖼️ HERO BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-10">
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

      {/* 📛 FINALIZED NAME LAYOUT (Locked) */}
      <div 
        className="absolute inset-0 pointer-events-none select-none z-20"
      >
        <motion.h1 
          className="absolute font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-white/50 to-white/5" 
          style={{ 
            fontSize: '8vw', 
            fontFamily: 'Impact, sans-serif', 
            mixBlendMode: 'normal',
            filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))',
            left: '3.2%', 
            top: '40.3%'
          }}
        >
          HARSHAL
        </motion.h1>
        
        <motion.h1 
          className="absolute font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-white/50 to-white/5" 
          style={{ 
            fontSize: '8vw', 
            fontFamily: 'Impact, sans-serif', 
            mixBlendMode: 'normal',
            filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))',
            left: '16.4%', 
            top: '55.0%'
          }}
        >
          PATEL
        </motion.h1>
      </div>

      <AnimatePresence>
        {showContent && (
          <>
            {/* 2. FINALIZED FOOTER (Locked) */}
            <motion.div 
              initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="absolute z-30 font-black uppercase leading-none select-none whitespace-pre-wrap"
              style={{ 
                fontFamily: 'Impact, sans-serif',
                color: "white", 
                wordSpacing: '0.2em',
                transform: 'scaleY(1.3)', 
                transformOrigin: 'top left',
                filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.1))',
                // 🔒 FINALIZED POS (From User)
                left: '9.2%',
                top: '63.6%',
                width: 'max-content',
                maxWidth: '90%'
              }}
            >
              <span className="bg-clip-text text-transparent" style={{ fontSize: '4rem', backgroundImage: "url('/All Day Blurred.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>I</span>
              <span style={{ fontSize: '4rem' }}> </span>
              <span className="bg-clip-text text-transparent" style={{ fontSize: '4rem', backgroundImage: "url('/All Day Blurred.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>CAN</span>
              <span style={{ fontSize: '4rem' }}>{'\n'}</span>
              <span className="bg-clip-text text-transparent" style={{ fontSize: '4rem', backgroundImage: "url('/All Day Blurred.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>DO</span>
              <span style={{ fontSize: '4rem' }}> </span>
              {/* "THIS" text wrapper */}
              <span className="relative inline-block mx-4">
                {/* 1. THE TEXT ITSELF (Clipped with Hole) */}
                <span 
                  className="bg-clip-text text-transparent" 
                  style={{ 
                    display: 'inline-block', // 🟢 FIX: Enforce block coords for mask alignment
                    fontSize: '9rem', 
                    backgroundImage: "url('/All Day Blurred.png')", 
                    backgroundSize: "cover", 
                    backgroundPosition: "center", 
                    backgroundAttachment: "fixed", 
                    backgroundClip: "text", 
                    WebkitBackgroundClip: "text", 
                    color: "transparent",
                    // ✂️ CUTOUT MASK (Hole: x=35, y=24, w=194, h=98)
                    // Construct 4 rectangles around the hole:
                    // 1. Top Bar (h=24)
                    // 2. Bottom Bar (y=122)
                    // 3. Left Side (w=35, h=98, y=24)
                    // 4. Right Side (x=229, h=98, y=24)
                    maskImage: 'linear-gradient(black, black), linear-gradient(black, black), linear-gradient(black, black), linear-gradient(black, black)',
                    maskPosition: '0 0, 0 122px, 0 24px, 229px 24px',
                    maskSize: '100% 24px, 100% calc(100% - 122px), 35px 98px, calc(100% - 229px) 98px',
                    maskRepeat: 'no-repeat',
                    WebkitMaskImage: 'linear-gradient(black, black), linear-gradient(black, black), linear-gradient(black, black), linear-gradient(black, black)',
                    WebkitMaskPosition: '0 0, 0 122px, 0 24px, 229px 24px',
                    WebkitMaskSize: '100% 24px, 100% calc(100% - 122px), 35px 98px, calc(100% - 229px) 98px',
                    WebkitMaskRepeat: 'no-repeat'
                  }}
                >
                  THIS
                </span>
                
                {/* 2. THE HOLE (Overlay Box) */}
                <div 
                  className="absolute bg-transparent flex items-end justify-center pb-[10px] overflow-hidden z-20"
                  style={{ 
                    // 🔒 FINALIZED BOX STATS
                    top: '24px', 
                    left: '35px', 
                    width: '194px', 
                    height: '98px', 
                    // 🌫️ EDGE BLUR (Softens the hard cut)
                    boxShadow: '0 0 8px 4px #050505'
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={questions[currentQuestion]}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center justify-center font-bold text-blue-500 leading-none text-center"
                      style={{ 
                        fontSize: '2.4rem', 
                        fontFamily: 'Impact, sans-serif',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {questions[currentQuestion].split(' ').map((word, i) => (
                         <span key={i}>{word}</span>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </span>

              <span style={{ fontSize: '4rem' }}> </span>
              <span className="bg-clip-text text-transparent" style={{ fontSize: '4rem', backgroundImage: "url('/All Day Blurred.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>ALL</span>
              <span style={{ fontSize: '4rem' }}> </span>
              <span className="bg-clip-text text-transparent" style={{ fontSize: '4rem', backgroundImage: "url('/All Day Blurred.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>DAY</span>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
