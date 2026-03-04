"use client";

import { animate as anime } from "animejs";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePreloader } from "@/lib/preloader-context";
import { HeroGrid } from "@/components/ui/HeroGrid";
import { AnimeIn } from "@/components/ui/AnimeIn";

function HeroChar({ char, delay, animation }: { char: string; delay: number; animation: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const config: any = {
      duration: 600,
      delay,
      easing: 'outQuart'
    };

    if (animation === 'FLIP') {
      config.rotateY = [90, 0];
      config.opacity = [0, 1];
    } else if (animation === 'SLIDE') {
      config.translateY = [20, 0];
      config.opacity = [0, 1];
    } else if (animation === 'FOCUS') {
      config.filter = ['blur(10px)', 'blur(0px)'];
      config.opacity = [0, 1];
      config.scale = [0.9, 1];
    } else {
      config.opacity = [0, 1];
    }

    anime(ref.current, config);
  }, [char, animation, delay]);

  return (
    <span ref={ref as any} className="inline-block relative z-10">
      {char}
    </span>
  );
}

export function Hero() {
  const { isComplete } = usePreloader();
  const [showContent, setShowContent] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [blinkerIndex, setBlinkerIndex] = useState(0);

  const titleSettings = {
    font: 'var(--font-anton)',
    fontSize: 2.0,
    animation: 'FLIP',
    letterSpacing: '0.05em'
  };

  const questions = [
    "Designing Systems?",
    "Shipping Features?",
    "Crafting UI?",
    "Training Models?",
    "Analyzing Trends?",
    "Solving Problems?",
  ];

  useEffect(() => {
    if (!showContent) return;
    const interval = setInterval(() => {
      setCurrentQuestion((prev) => (prev + 1) % questions.length);
      setBlinkerIndex(-1);
    }, 3500); 
    return () => clearInterval(interval);
  }, [showContent, questions.length]);

  useEffect(() => {
    if (!showContent) return;
    const blinkerTimer = setInterval(() => {
      setBlinkerIndex((prev) => (prev < 6 ? prev + 1 : prev)); 
    }, 400);
    return () => clearInterval(blinkerTimer);
  }, [showContent, currentQuestion]);

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

      {/* 📛 NAME REVEAL */}
      <div className="absolute inset-0 pointer-events-none select-none z-20">
        <AnimeIn
          initial={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          duration={1500}
          delay={200}
        >
          <h1 
            className="absolute font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-white/50 to-white/5" 
            style={{ 
              fontSize: '8vw', 
              fontFamily: 'Impact, sans-serif', 
              filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))',
              left: '3.2%', 
              top: '40.3%'
            }}
          >
            HARSHAL
          </h1>
        </AnimeIn>
        
        <AnimeIn
          initial={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          duration={1500}
          delay={400}
        >
          <h1 
            className="absolute font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-white/50 to-white/5" 
            style={{ 
              fontSize: '8vw', 
              fontFamily: 'Impact, sans-serif', 
              filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))',
              left: '16.4%', 
              top: '55.0%'
            }}
          >
            PATEL
          </h1>
        </AnimeIn>
      </div>

      {showContent && (
        <div className="w-full h-full absolute inset-0 z-30 pointer-events-none">
          {/* 2. FOOTER SEQUENCE */}
          <AnimeIn 
            initial={{ opacity: 0, translateX: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, translateX: 0, filter: 'blur(0px)' }}
            duration={1000}
            delay={300}
            className="absolute font-black uppercase leading-none select-none whitespace-pre-wrap"
            style={{ 
              fontFamily: 'Impact, sans-serif',
              color: "white", 
              wordSpacing: '0.2em',
              transform: 'scaleY(1.3)', 
              transformOrigin: 'top left',
              filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.1))',
              left: 'calc(9.2% - 30px)',
              top: 'calc(63.6% - 11px)',
              width: 'max-content',
              maxWidth: '90%'
            }}
          >
            <span 
              className="bg-clip-text text-transparent transition-opacity duration-200" 
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
              }}
            >I</span>
            <span style={{ fontSize: '4rem' }}> </span>
            <span 
              className="bg-clip-text text-transparent transition-opacity duration-200" 
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
              }}
            >CAN</span>
            <span style={{ fontSize: '4rem' }}>{'\n'}</span>
            <span 
              className="bg-clip-text text-transparent transition-opacity duration-200" 
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
              }}
            >DO</span>
            <span style={{ fontSize: '4rem' }}> </span>
            <span className="relative inline-block mx-4">
              <span 
                className="bg-clip-text text-transparent transition-opacity duration-200" 
                style={{ 
                  display: 'inline-block',
                  fontSize: '9rem', 
                  backgroundImage: "url('/All Day Blurred.png')", 
                  backgroundSize: "cover", 
                  backgroundPosition: "center", 
                  backgroundAttachment: "fixed", 
                  backgroundClip: "text", 
                  WebkitBackgroundClip: "text", 
                  color: "transparent",
                  opacity: blinkerIndex === 3 ? 1 : 0.3,
                  maskImage: 'radial-gradient(ellipse 110px 55px at 132px 73px, transparent 60%, black 100%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 110px 55px at 132px 73px, transparent 60%, black 100%)',
                }}
              >
                THIS
              </span>
              
              <div 
                className="absolute bg-transparent flex items-center justify-center overflow-hidden z-20"
                style={{ 
                  top: '24px', 
                  left: '35px', 
                  width: '194px', 
                  height: '98px', 
                  perspective: '1000px',
                  boxShadow: 'inset 0 0 30px 15px #050505, 0 0 15px 5px #050505',
                }}
              >
                <div 
                  className="flex flex-col items-center justify-center font-bold text-sky-300 leading-none text-center"
                  style={{ 
                    fontSize: `${titleSettings.fontSize}rem`, 
                    fontFamily: titleSettings.font,
                    letterSpacing: titleSettings.letterSpacing,
                    transformStyle: 'preserve-3d',
                    textShadow: '0 0 15px rgba(59, 130, 246, 0.5)'
                  }}
                >
                  <div className="flex flex-col items-start justify-center gap-y-1">
                    {Array.from({ length: Math.max(...questions.map(q => q.split(' ').length)) }).map((_, wordIdx) => {
                      const words = questions[currentQuestion].split(' ');
                      const currentWord = words[wordIdx] || "";
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
                                {char && (
                                  <HeroChar 
                                    key={`${currentQuestion}-${wordIdx}-${charIdx}`}
                                    char={char}
                                    delay={charIdx * 20}
                                    animation={titleSettings.animation}
                                  />
                                )}
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
              className="bg-clip-text text-transparent transition-opacity duration-200" 
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
                opacity: blinkerIndex === 4 ? 1 : 0.3,
              }}
            >ALL</span>
            <span style={{ fontSize: '4rem' }}> </span>
            <span 
              className="bg-clip-text text-transparent transition-opacity duration-200" 
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
              }}
            >DAY</span>
          </AnimeIn>
        </div>
      )}
    </section>
  );
}
