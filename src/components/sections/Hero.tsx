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
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 🎛️ BOX TUNER STATE (New)
  const boxRef = useRef<HTMLDivElement>(null);
  const [tunerState, setTunerState] = useState({ 
    x: 0, y: 0, w: 200, h: 100, 
    fontSize: 1.5, 
    font: 'var(--font-space)' 
  });

  // 📍 FOOTER POSITION STATE (Percentages)
  const [footerPos, setFooterPos] = useState({ x: 9.2, y: 63.6 });

  const updateTunerState = () => {
    if (boxRef.current && containerRef.current) {
      const box = boxRef.current;
      setTunerState(prev => ({
        ...prev,
        x: box.offsetLeft,
        y: box.offsetTop,
        w: box.clientWidth,
        h: box.clientHeight
      }));
    }
  };

  const updateFooterPos = (_: any, info: any) => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const { x, y } = info.point;
    // Simple % conversion based on viewport/container
    // Note: info.point is absolute page coordinates. 
    // Ideally we use the element's offset, but Framer's drag modifies transform, not left/top directly.
    // For tuning, let's use a simpler approach: 
    // Just update state using delta or assume the element is being dragged visually and we read standard props?
    // Actually, `onDragEnd` gives us the final position? 
    // Let's stick to valid percentages.
    
    const xPct = (x / window.innerWidth) * 100;
    const yPct = (y / window.innerHeight) * 100;
    setFooterPos({ x: parseFloat(xPct.toFixed(1)), y: parseFloat(yPct.toFixed(1)) });
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
            {/* 2. FINALIZED FOOTER (Locked) */}
            <motion.div 
              drag // 🟢 ENABLE DRAG FOR TUNING
              dragMomentum={false}
              onDragEnd={updateFooterPos}
              initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="absolute z-30 font-black uppercase leading-none select-none whitespace-pre-wrap cursor-move"
              style={{ 
                fontFamily: 'Impact, sans-serif',
                color: "white", 
                wordSpacing: '0.2em',
                transform: 'scaleY(1.3)', 
                transformOrigin: 'top left',
                filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.1))',
                // 🟢 LINK TO STATE
                left: `${footerPos.x}%`,
                top: `${footerPos.y}%`,
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
                {/* 1. THE TEXT ITSELF (Clipped) */}
                <span className="bg-clip-text text-transparent" style={{ fontSize: '9rem', backgroundImage: "url('/All Day Blurred.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>THIS</span>
                
                {/* 2. THE TUNER OVERLAY (Sibling, Absolute) */}
                <motion.div 
                  ref={boxRef}
                  drag
                  dragMomentum={false}
                  onDragEnd={updateTunerState}
                  onMouseUp={updateTunerState} // Capture resize end
                  className="absolute bg-blue-500/30 border-2 border-yellow-400 flex items-center justify-center cursor-move z-50 overflow-hidden"
                  style={{ 
                    top: '0%', left: '0%', 
                    width: '100%', height: '100%', 
                    resize: 'both', overflow: 'auto',
                    color: 'white' // Override parent opacity
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={questions[currentQuestion]}
                      className="flex flex-col items-center justify-center font-bold text-white leading-tight text-center pointer-events-none"
                      style={{ 
                        fontSize: `${tunerState.fontSize}rem`, 
                        fontFamily: tunerState.font,
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                      }}
                    >
                      {questions[currentQuestion].split(' ').map((word, i) => (
                         <span key={i}>{word}</span>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </span>

              <span style={{ fontSize: '4rem' }}> </span>
              <span className="bg-clip-text text-transparent" style={{ fontSize: '4rem', backgroundImage: "url('/All Day Blurred.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>ALL</span>
              <span style={{ fontSize: '4rem' }}> </span>
              <span className="bg-clip-text text-transparent" style={{ fontSize: '4rem', backgroundImage: "url('/All Day Blurred.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>DAY</span>
            </motion.div>
            
            {/* 🎛️ TUNER PANEL */}
            <div className="fixed top-24 right-10 z-[100] bg-black/80 text-green-400 p-4 border border-green-500 font-mono text-xs rounded grid gap-2 shadow-2xl backdrop-blur">
              <div className="font-bold text-lg text-white mb-2 border-b border-white/20 pb-1">GLOBAL TUNER</div>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4 border-b border-white/10 pb-4">
                 <div className="col-span-2 text-green-300 font-bold">1. FOOTER POS</div>
                 <div>
                    <div className="text-gray-400">LEFT %</div>
                    <div className="text-xl">{footerPos.x}</div>
                 </div>
                 <div>
                    <div className="text-gray-400">TOP %</div>
                    <div className="text-xl">{footerPos.y}</div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4">
                 <div className="col-span-2 text-green-300 font-bold">2. BOX BOX</div>
                 <div>
                    <div className="text-gray-400">WIDTH</div>
                    <div className="text-xl">{tunerState.w}px</div>
                 </div>
                 <div>
                    <div className="text-gray-400">HEIGHT</div>
                    <div className="text-xl">{tunerState.h}px</div>
                 </div>
                 <div>
                   <div className="text-gray-400">SIZE</div>
                   <div className="text-xl">{tunerState.fontSize}rem</div>
                 </div>
              </div>


              <div className="mt-2 border-t border-white/20 pt-2 space-y-2">
                 <div className="flex items-center justify-between">
                    <span>FONT SIZE</span>
                    <div className="space-x-1">
                      <button onClick={() => setTunerState(p => ({...p, fontSize: Math.max(0.5, p.fontSize - 0.5)}))} className="bg-white/10 px-2 py-1 hover:bg-white/20">-</button>
                      <button onClick={() => setTunerState(p => ({...p, fontSize: p.fontSize + 0.5}))} className="bg-white/10 px-2 py-1 hover:bg-white/20">+</button>
                    </div>
                 </div>
                 
                 <div className="flex flex-col gap-1">
                    <span>FONT FAMILY</span>
                    <button onClick={() => setTunerState(p => ({...p, font: 'var(--font-space)'}))} className={`text-left px-2 py-1 ${tunerState.font.includes('space') ? 'bg-green-900/50 text-white' : 'hover:bg-white/5'}`}>Space Grotesk</button>
                    <button onClick={() => setTunerState(p => ({...p, font: 'var(--font-anton)'}))} className={`text-left px-2 py-1 ${tunerState.font.includes('anton') ? 'bg-green-900/50 text-white' : 'hover:bg-white/5'}`}>Anton (Impact-like)</button>
                 </div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      
    </section>
  );
}
