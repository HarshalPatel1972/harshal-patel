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
  const containerRef = useRef<HTMLDivElement>(null); // 🧱 Ref for Coordinate Tracking
  
  // TUNING STATE
  const [footerPos, setFooterPos] = useState({ x: 3.2, y: 72 });
  const [footerText, setFooterText] = useState("I CAN DO THIS ALL DAY");
  const [footerWordSizes, setFooterWordSizes] = useState([10, 10, 10, 10, 10, 10, 10, 10]); // Defaults
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const [footerFont, setFooterFont] = useState('var(--font-anton)');

  // Helper to safely set size
  const updateWordSize = (size: number) => {
    const newSizes = [...footerWordSizes];
    newSizes[selectedWordIndex] = size;
    setFooterWordSizes(newSizes);
  };

  // Helper to set GLOBAL size
  const updateGlobalSize = (size: number) => {
    const newSizes = new Array(footerWordSizes.length).fill(size);
    setFooterWordSizes(newSizes);
  };

  const updatePos = (info: any) => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const { x, y } = info.point;
    
    // Convert to percentage relative to screen
    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;
    
    setFooterPos({ x: parseFloat(xPercent.toFixed(1)), y: parseFloat(yPercent.toFixed(1)) });
  };

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
      ref={containerRef}
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
                backgroundImage: "url('/All Day Blurred.png')",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                backgroundSize: "cover",
                backgroundPosition: "center",
                wordSpacing: '0.2em',
                transform: 'scaleY(1.3)', 
                transformOrigin: 'top left',
                // HD SMUDGE + Shadow
                // HD SMUDGE (Baked) + Shadow
                filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.1))',
                // FINALIZED COORDINATES from User
                left: '9.2%',
                top: '63.6%',
                width: 'max-content',
                maxWidth: '90%'
              }}
            >
              <span style={{ fontSize: '4rem' }}>I</span>
              <span style={{ fontSize: '4rem' }}> </span>
              <span style={{ fontSize: '4rem' }}>CAN</span>
              <span style={{ fontSize: '4rem' }}>{'\n'}</span>
              <span style={{ fontSize: '4rem' }}>DO</span>
              <span style={{ fontSize: '4rem' }}> </span>
              {/* "THIS" text wrapper */}
              <span className="relative inline-block mx-4">
                {/* 1. THE TEXT ITSELF (Clean, no children) */}
                <span style={{ fontSize: '9rem' }}>THIS</span>
                
                {/* 2. THE TUNER OVERLAY (Sibling, Absolute) */}
                <motion.div 
                  drag
                  dragMomentum={false}
                  className="absolute bg-blue-500/30 border-2 border-yellow-400 flex items-center justify-center cursor-move z-50 overflow-hidden"
                  style={{ 
                    top: '0%', left: '0%', // Start aligned
                    width: '100%', height: '100%', // Cover it initially
                    resize: 'both', overflow: 'auto'
                  }}
                  onDragEnd={(_, info) => {
                    console.log("📍 Moved:", info.point);
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={questions[currentQuestion]}
                      className="flex flex-col items-center justify-center font-bold text-white leading-tight text-center pointer-events-none"
                      style={{ fontSize: '1.5rem', fontFamily: 'var(--font-space)' }}
                    >
                      {questions[currentQuestion].split(' ').map((word, i) => (
                         <span key={i}>{word}</span>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Debug Info */}
                  <div className="absolute top-0 left-0 bg-black text-[10px] text-yellow-400 p-1 font-mono pointer-events-none">
                    Resize Me
                  </div>
                </motion.div>
              </span>

              <span style={{ fontSize: '4rem' }}> </span>
              <span style={{ fontSize: '4rem' }}>ALL</span>
              <span style={{ fontSize: '4rem' }}> </span>
              <span style={{ fontSize: '4rem' }}>DAY</span>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      
    </section>
  );
}
