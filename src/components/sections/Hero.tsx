"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import React, { useState, useEffect, useRef } from "react"; // Added useRef
import Image from "next/image";
import { usePreloader } from "@/lib/preloader-context";
import { HeroGrid } from "@/components/ui/HeroGrid";

export function Hero() {
  const { isComplete } = usePreloader();
  const [showContent, setShowContent] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [blinkerIndex, setBlinkerIndex] = useState(0);

  // 🧪 DESIGN LAB STATE
  // 🔒 FINALIZED CONFIG
  const titleSettings = {
    font: 'var(--font-anton)',
    fontSize: 2.0,
    animation: 'FLIP',
    letterSpacing: '0.05em'
  };

  // 🎭 ANIMATION PRESETS
  const animationPresets: Record<string, { container: Variants; item: Variants }> = {
    FOCUS: {
      container: { 
        visible: { transition: { staggerChildren: 0.05 } } 
      },
      item: {
        initial: { filter: 'blur(10px)', opacity: 0, scale: 0.9, y: 10 },
        visible: { filter: 'blur(0px)', opacity: 1, scale: 1, y: 0 },
        exit: { filter: 'blur(5px)', opacity: 0, scale: 1.1, y: -10 }
      }
    },
    SLIDE: {
      container: { 
        visible: { transition: { staggerChildren: 0.03 } } 
      },
      item: {
        initial: { y: 40, opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { y: -40, opacity: 0 }
      }
    },
    ZOOM: {
      container: { 
        visible: { transition: { staggerChildren: 0.04 } } 
      },
      item: {
        initial: { scale: 1.5, opacity: 0, filter: 'brightness(2)' },
        visible: { scale: 1, opacity: 1, filter: 'brightness(1)' },
        exit: { scale: 0.8, opacity: 0 }
      }
    },
    GHOST: {
      container: { 
        visible: { transition: { staggerChildren: 0.1 } } 
      },
      item: {
        initial: { opacity: 0, letterSpacing: '1em', filter: 'blur(4px)' },
        visible: { opacity: 1, letterSpacing: '0.05em', filter: 'blur(0px)' },
        exit: { opacity: 0, scale: 1.2, filter: 'blur(10px)' }
      }
    },
    DIAL: {
      container: { 
        visible: { transition: { staggerChildren: 0.05 } } 
      },
      item: {
        initial: { rotateX: 90, y: 30, opacity: 0 },
        visible: { rotateX: 0, y: 0, opacity: 1 },
        exit: { rotateX: -90, y: -30, opacity: 0 }
      }
    },
    FLIP: {
      container: { 
        visible: { transition: { staggerChildren: 0.05 } } 
      },
      item: {
        initial: { rotateY: 90, opacity: 0 },
        visible: { rotateY: 0, opacity: 1, transition: { type: 'spring', damping: 15, stiffness: 100 } },
        exit: { rotateY: -90, opacity: 0, transition: { duration: 0.2 } }
      }
    },
    WAVE: {
      container: { 
        visible: { transition: { staggerChildren: 0.04 } } 
      },
      item: {
        initial: { y: 20, opacity: 0 },
        visible: { 
          y: [20, -10, 0], 
          opacity: 1,
          transition: { times: [0, 0.6, 1], duration: 0.6 }
        },
        exit: { y: -20, opacity: 0 }
      }
    }
  };

  const fonts = [
    { name: 'Dramatic Serif', value: 'var(--font-playfair)', style: 'italic' },
    { name: 'Strict Tech', value: 'var(--font-space-grotesk)', style: 'normal' },
    { name: 'Luxury Mono', value: 'var(--font-geist-mono)', style: 'normal' },
    { name: 'Impact Block', value: 'var(--font-anton)', style: 'normal' },
    { name: 'Clean Sans', value: 'var(--font-geist-sans)', style: 'normal' },
    { name: 'Elegant Classic', value: 'var(--font-eb-garamond)', style: 'normal' },
    { name: 'Modern Sans', value: 'var(--font-inter)', style: 'normal' },
    { name: 'Cyber Punk', value: 'var(--font-jetbrains-mono)', style: 'normal' }
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
      setBlinkerIndex(-1); // Start with 0.5s pause
    }, 3500); 
    return () => clearInterval(interval);
  }, [showContent, questions.length]);

  // Handle Truth Blinker sequence (500ms steps)
  useEffect(() => {
    if (!showContent) return;
    const blinkerTimer = setInterval(() => {
      setBlinkerIndex((prev) => (prev < 6 ? prev + 1 : prev)); 
    }, 400);
    return () => clearInterval(blinkerTimer);
  }, [showContent, currentQuestion]);

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
                left: 'calc(9.2% - 30px)',
                top: 'calc(63.6% - 11px)',
                width: 'max-content',
                maxWidth: '90%'
              }}
            >
              <span 
                className="bg-clip-text text-transparent transition-all duration-300" 
                style={{ 
                  fontSize: '4rem', 
                  backgroundImage: "url('/All Day Blurred.png')", 
                  backgroundSize: "cover", 
                  backgroundPosition: "center", 
                  backgroundAttachment: "fixed", 
                  backgroundClip: "text", 
                  WebkitBackgroundClip: "text", 
                  color: "transparent",
                  opacity: blinkerIndex === 0 ? 1 : 0.3,
                  transition: 'opacity 0.2s ease-out'
                }}
              >I</span>
              <span style={{ fontSize: '4rem' }}> </span>
              <span 
                className="bg-clip-text text-transparent" 
                style={{ 
                  fontSize: '4rem', 
                  backgroundImage: "url('/All Day Blurred.png')", 
                  backgroundSize: "cover", 
                  backgroundPosition: "center", 
                  backgroundAttachment: "fixed", 
                  backgroundClip: "text", 
                  WebkitBackgroundClip: "text", 
                  color: "transparent",
                  opacity: blinkerIndex === 1 ? 1 : 0.3,
                  transition: 'opacity 0.2s ease-out'
                }}
              >CAN</span>
              <span style={{ fontSize: '4rem' }}>{'\n'}</span>
              <span 
                className="bg-clip-text text-transparent" 
                style={{ 
                  fontSize: '4rem', 
                  backgroundImage: "url('/All Day Blurred.png')", 
                  backgroundSize: "cover", 
                  backgroundPosition: "center", 
                  backgroundAttachment: "fixed", 
                  backgroundClip: "text", 
                  WebkitBackgroundClip: "text", 
                  color: "transparent",
                  opacity: blinkerIndex === 2 ? 1 : 0.3,
                  transition: 'opacity 0.2s ease-out'
                }}
              >DO</span>
              <span style={{ fontSize: '4rem' }}> </span>
              {/* "THIS" text wrapper */}
              <span 
                className="relative inline-block mx-4"
                style={{
                  transition: 'all 0.2s ease-out'
                }}
              >
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
                    opacity: blinkerIndex === 3 ? 1 : 0.3,
                    transition: 'opacity 0.2s ease-out',
                    // 🌫️ FEATHERED MASK (Radial hole centered on box: 132px, 73px)
                    maskImage: 'radial-gradient(ellipse 110px 55px at 132px 73px, transparent 60%, black 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 110px 55px at 132px 73px, transparent 60%, black 100%)',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat'
                  }}
                >
                  THIS
                </span>
                
                {/* 2. THE HOLE (Overlay Box) */}
                <div 
                  className="absolute bg-transparent flex items-center justify-center overflow-hidden z-20"
                  style={{ 
                    // 🔒 FINALIZED BOX STATS
                    top: '24px', 
                    left: '35px', 
                    width: '194px', 
                    height: '98px', 
                    perspective: '1000px', // 🎡 3D Support
                    opacity: 1, // 🟢 FINAL FIX: Titles stay bright even when footer dims
                    // 🌫️ EXTREME FEATHER (Heavy inset and outer shadows for smoke effect)
                    boxShadow: 'inset 0 0 30px 15px #050505, 0 0 15px 5px #050505',
                    transition: 'all 0.3s ease-out'
                  }}
                >
                  <div 
                    data-testid="question-display"
                    className="flex flex-col items-center justify-center font-bold text-sky-300 leading-none text-center"
                    style={{ 
                      fontSize: `${titleSettings.fontSize}rem`, 
                      fontFamily: titleSettings.font,
                      letterSpacing: titleSettings.letterSpacing,
                      fontStyle: 'normal',
                      transformStyle: 'preserve-3d',
                      textShadow: '0 0 15px rgba(59, 130, 246, 0.5)' // 💡 BLOOM: Makes the text look luminous
                    }}
                  >
                    {/* Persistent Slot Logic */}
                    <div className="flex flex-col items-start justify-center gap-y-1">
                      {Array.from({ length: Math.max(...questions.map(q => q.split(' ').length)) }).map((_, wordIdx) => {
                        const words = questions[currentQuestion].split(' ');
                        const currentWord = words[wordIdx] || "";
                        
                        // Max chars for this specific word slot across all questions
                        const maxCharsForThisWordSlot = Math.max(...questions.map(q => {
                          const w = q.split(' ')[wordIdx];
                          return w ? w.length : 0;
                        }));

                        return (
                          <div key={wordIdx} className="flex flex-wrap items-center justify-start gap-x-[0.05em] min-h-[1.2em]">
                            {Array.from({ length: maxCharsForThisWordSlot }).map((_, charIdx) => {
                              const char = currentWord[charIdx];
                              return (
                                <div key={charIdx} className="relative min-w-[0.55em] h-[1.2em] flex items-center justify-center">
                                  <AnimatePresence mode="popLayout" initial={false}>
                                    {char && (
                                      <motion.span
                                        key={`${currentQuestion}-${wordIdx}-${charIdx}`}
                                        variants={currentPreset.item}
                                        initial="initial"
                                        animate="visible"
                                        exit="exit"
                                        className="inline-block relative z-10"
                                        transition={{ 
                                          type: "spring", 
                                          stiffness: 260, 
                                          damping: 20,
                                          delay: charIdx * 0.02 
                                        }}
                                      >
                                        {char}
                                      </motion.span>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </span>

              <span style={{ fontSize: '4rem' }}> </span>
              <span 
                className="bg-clip-text text-transparent transition-all duration-300" 
                style={{ 
                  display: "inline-block",
                  paddingLeft: "0.1em", // 🛡️ PROTECTION: Prevents the Impact font 'A' from clipping
                  fontSize: '4rem', 
                  backgroundImage: "url('/All Day Blurred.png')", 
                  backgroundSize: "cover", 
                  backgroundPosition: "center", 
                  backgroundAttachment: "fixed", 
                  backgroundClip: "text", 
                  WebkitBackgroundClip: "text", 
                  color: "transparent",
                  opacity: blinkerIndex === 4 ? 1 : 0.3,
                  transition: 'opacity 0.2s ease-out'
                }}
              >ALL</span>
              <span style={{ fontSize: '4rem' }}> </span>
              <span 
                className="bg-clip-text text-transparent" 
                style={{ 
                  display: "inline-block",
                  paddingLeft: "0.1em",
                  fontSize: '4rem', 
                  backgroundImage: "url('/All Day Blurred.png')", 
                  backgroundSize: "cover", 
                  backgroundPosition: "center", 
                  backgroundAttachment: "fixed", 
                  backgroundClip: "text", 
                  WebkitBackgroundClip: "text", 
                  color: "transparent",
                  opacity: blinkerIndex === 5 ? 1 : 0.3,
                  transition: 'opacity 0.2s ease-out'
                }}
              >DAY</span>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
