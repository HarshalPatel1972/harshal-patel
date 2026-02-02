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

  // 🧪 DESIGN LAB STATE
  const [titleSettings, setTitleSettings] = useState({
    font: 'var(--font-playfair)',
    fontSize: 2.4,
    animation: 'FOCUS',
    letterSpacing: '0.05em'
  });

  // 🎭 ANIMATION PRESETS
  const animationPresets = {
    FOCUS: {
      container: { 
        visible: { transition: { staggerChildren: 0.05 } } 
      },
      item: {
        initial: { filter: 'blur(10px)', opacity: 0, scale: 0.9, y: 10 },
        animate: { filter: 'blur(0px)', opacity: 1, scale: 1, y: 0 },
        exit: { filter: 'blur(5px)', opacity: 0, scale: 1.1, y: -10 }
      }
    },
    SLIDE: {
      container: { 
        visible: { transition: { staggerChildren: 0.03 } } 
      },
      item: {
        initial: { y: 40, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -40, opacity: 0 }
      }
    },
    ZOOM: {
      container: { 
        visible: { transition: { staggerChildren: 0.04 } } 
      },
      item: {
        initial: { scale: 1.5, opacity: 0, filter: 'brightness(2)' },
        animate: { scale: 1, opacity: 1, filter: 'brightness(1)' },
        exit: { scale: 0.8, opacity: 0 }
      }
    },
    GHOST: {
      container: { 
        visible: { transition: { staggerChildren: 0.1 } } 
      },
      item: {
        initial: { opacity: 0, letterSpacing: '1em', filter: 'blur(4px)' },
        animate: { opacity: 1, letterSpacing: '0.05em', filter: 'blur(0px)' },
        exit: { opacity: 0, scale: 1.2, filter: 'blur(10px)' }
      }
    }
  };

  const fonts = [
    { name: 'Dramatic Serif', value: 'var(--font-playfair)', style: 'italic' },
    { name: 'Strict Tech', value: 'var(--font-space-grotesk)', style: 'normal' },
    { name: 'Luxury Mono', value: 'var(--font-geist-mono)', style: 'normal' },
    { name: 'Impact Block', value: 'var(--font-anton)', style: 'normal' },
    { name: 'Clean Sans', value: 'var(--font-geist-sans)', style: 'normal' }
  ];

  const questions = [
    "Designing Systems?",
    "Shipping Features?",
    "Crafting UI?",
    "Training Models?",
    "Analyzing Trends?",
    "Solving Problems?",
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
  
  const currentPreset = animationPresets[titleSettings.animation as keyof typeof animationPresets];

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
                  className="absolute bg-transparent flex items-end justify-center pb-[30px] overflow-hidden z-20"
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
                      key={questions[currentQuestion] + titleSettings.animation}
                      variants={currentPreset.container}
                      initial="initial"
                      animate="visible"
                      exit="exit"
                      className="flex flex-col items-center justify-center font-bold text-blue-400 leading-none text-center"
                      style={{ 
                        fontSize: `${titleSettings.fontSize}rem`, 
                        fontFamily: titleSettings.font,
                        letterSpacing: titleSettings.letterSpacing,
                        fontStyle: fonts.find(f => f.value === titleSettings.font)?.style as any || 'normal'
                      }}
                    >
                      {questions[currentQuestion].split(' ').map((word, wordIdx) => (
                         <div key={wordIdx} className="flex gap-[0.2em]">
                           {word.split('').map((char, charIdx) => (
                             <motion.span 
                               key={charIdx} 
                               variants={currentPreset.item}
                               transition={{ duration: 0.5 }}
                             >
                               {char}
                             </motion.span>
                           ))}
                         </div>
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

            {/* 🎛️ TITLE DESIGN LAB (Fixed Center) */}
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-black/90 p-5 border border-blue-500/50 rounded-xl shadow-2xl backdrop-blur-xl w-[320px] grid gap-4 pointer-events-auto">
              <div className="text-blue-400 font-bold text-center border-b border-white/10 pb-2">TITLE DESIGN LAB</div>
              
              {/* FONTS */}
              <div>
                <label className="text-[10px] text-gray-400 block mb-2 uppercase tracking-widest">Select Font</label>
                <div className="grid grid-cols-1 gap-1">
                  {fonts.map(f => (
                    <button 
                      key={f.value}
                      onClick={() => setTitleSettings(p => ({ ...p, font: f.value }))}
                      className={`text-left px-3 py-1.5 rounded text-sm transition-colors ${titleSettings.font === f.value ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                      style={{ fontFamily: f.value, fontStyle: f.style }}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* ANIMATIONS */}
              <div>
                <label className="text-[10px] text-gray-400 block mb-2 uppercase tracking-widest">Animation Style</label>
                <div className="grid grid-cols-2 gap-1">
                  {Object.keys(animationPresets).map(anim => (
                    <button 
                      key={anim}
                      onClick={() => setTitleSettings(p => ({ ...p, animation: anim }))}
                      className={`px-2 py-1.5 rounded text-[10px] font-bold transition-colors ${titleSettings.animation === anim ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                    >
                      {anim}
                    </button>
                  ))}
                </div>
              </div>

              {/* SIZE */}
              <div className="flex items-center justify-between bg-white/5 p-3 rounded">
                <span className="text-xs text-gray-400 tracking-widest">FONT SIZE</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setTitleSettings(p => ({ ...p, fontSize: Math.max(1, p.fontSize - 0.2) }))} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded hover:bg-white/20 transition-colors">-</button>
                  <span className="text-blue-400 font-bold min-w-[3ch] text-center">{titleSettings.fontSize.toFixed(1)}</span>
                  <button onClick={() => setTitleSettings(p => ({ ...p, fontSize: Math.min(6, p.fontSize + 0.2) }))} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded hover:bg-white/20 transition-colors">+</button>
                </div>
              </div>

              <div className="text-[10px] text-center text-gray-500 italic mt-1 border-t border-white/5 pt-2">
                Pick your look, then tell me the settings.
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
