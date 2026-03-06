"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { createTimeline, stagger } from "animejs";
import { mappaQuotes } from "@/data/quotes";
import { useLanguage } from "@/context/LanguageContext";

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [complete, setComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLHeadingElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const slashRef = useRef<HTMLDivElement>(null);
  const subliminalRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<any>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const breathIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { language } = useLanguage();

  // Pick a random quote once on mount, stable across renders
  const quoteIndex = useRef(Math.floor(Math.random() * mappaQuotes.en.length));
  const activeQuotes = mappaQuotes[language];
  const q = activeQuotes[quoteIndex.current % activeQuotes.length];
  const quote = q.text;
  const source = q.source.split(" // ")[0];
  const words = quote.split(/\s+/).length;
  const readTime = Math.max(5500, 4000 + words * 320);

  const kanjiList = ["呪", "死", "力", "勝", "運", "命", "覚", "醒"];

  // Pre-compute wrapped characters as React elements (no innerHTML mutation needed)
  const wrappedChars = useMemo(() => {
    const isJapanese = language === 'ja';
    const charStyle = { opacity: 0, transform: 'translateY(40px)', filter: 'blur(20px)' };
    if (isJapanese) {
      return quote.split("").map((char, i) => (
        <span key={i} className="p-char inline-block will-change-transform" style={charStyle}>
          {char === ' ' || char === '　' ? '\u00A0' : char}
        </span>
      ));
    } else {
      const wordList = quote.split(" ");
      const elements: React.ReactNode[] = [];
      wordList.forEach((word, wi) => {
        if (wi > 0) {
          elements.push(
            <span key={`sp-${wi}`} className="p-char inline-block will-change-transform" style={charStyle}>{'\u00A0'}</span>
          );
          elements.push(" ");
        }
        elements.push(
          <span key={`w-${wi}`} className="inline-block whitespace-nowrap">
            {word.split("").map((char, ci) => (
              <span key={ci} className="p-char inline-block will-change-transform" style={charStyle}>{char}</span>
            ))}
          </span>
        );
      });
      return elements;
    }
  }, [quote, language]);

  useEffect(() => {
    if (complete) return;
    document.body.style.overflow = "hidden";

    // Small delay to ensure DOM is painted with p-char spans before anime targets them
    const initTimeout = setTimeout(() => {
      const tl = createTimeline({
        defaults: {
          ease: 'easeOutQuint'
        }
      });
      timelineRef.current = tl;

      // Step 1: The 'Cinematic Aperture' Opening
      const apertureTargets = [topBarRef.current, bottomBarRef.current].filter(Boolean) as HTMLElement[];
      if (apertureTargets.length > 0) {
        tl.add(apertureTargets, {
          translateY: (el: any) => (el as HTMLElement).dataset.dir === 'top' ? '-100%' : '100%',
          duration: 1600,
          ease: 'easeInOutQuint'
        }, 200);
      }

      // Step 2: The Red Sunder (Visual Pulse) + Subliminal Kanji
      if (slashRef.current) {
        tl.add(slashRef.current, {
          scaleX: [0, 1.2],
          opacity: [0, 1, 0],
          duration: 1000,
          ease: 'easeInOutSine'
        }, 600);
      }

      if (subliminalRef.current) {
        tl.add(subliminalRef.current, {
          opacity: [0, 0.4, 0],
          scale: [0.8, 1.2],
          duration: 150,
          ease: 'steps(1)'
        }, 700);
      }

      // Step 3: Precision character reveal
      const pChars = document.querySelectorAll('.p-char');
      if (pChars.length > 0) {
        tl.add('.p-char', {
          opacity: [0, 1],
          translateY: [40, 0],
          filter: ['blur(20px)', 'blur(0px)'],
          duration: 800,
          delay: stagger(15),
          ease: 'easeOutQuart'
        }, 1000);
      }

      // Step 4: Elevated Source Presentation
      if (sourceRef.current) {
        tl.add(sourceRef.current, {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 1200,
          ease: 'easeOutCubic'
        }, 1800);
      }

      exitTimeoutRef.current = setTimeout(() => {
        const exitTl = createTimeline({
          defaults: {
            ease: 'easeInQuint'
          },
          onComplete: () => {
            setComplete(true);
            onComplete?.();
            document.body.style.overflow = "";
            
            // Tactical Entry Flash
            document.body.classList.remove("impact-flash-active");
            void document.body.offsetWidth; 
            document.body.classList.add("impact-flash-active");
            setTimeout(() => document.body.classList.remove("impact-flash-active"), 700);
          }
        });

        if (pChars.length > 0) {
          exitTl.add('.p-char', {
            opacity: 0,
            translateY: -60,
            filter: 'blur(30px)',
            delay: stagger(10, { from: 'center' }),
            duration: 1000
          });
        }

        if (sourceRef.current) {
          exitTl.add(sourceRef.current, {
            opacity: 0,
            duration: 800
          }, 200);
        }

        const exitApertureTargets = [topBarRef.current, bottomBarRef.current].filter(Boolean) as HTMLElement[];
        if (exitApertureTargets.length > 0) {
          exitTl.add(exitApertureTargets, {
            translateY: 0,
            duration: 1500,
            ease: 'easeInExpo'
          }, 600);
        }
      }, readTime);

      // Subtle Perspective Breath
      let frame = 0;
      breathIntervalRef.current = setInterval(() => {
        if (containerRef.current) {
          frame++;
          const drift = Math.sin(frame / 60) * 0.4;
          containerRef.current.style.transform = `perspective(1200px) rotateX(${drift}deg) rotateY(${drift * 0.5}deg)`;
        }
      }, 16);
    }, 50); // 50ms delay ensures React has painted the p-char spans

    return () => {
      clearTimeout(initTimeout);
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
      document.body.style.overflow = "";
    };
  }, [complete, onComplete, quote, readTime, language]);

  if (complete) return null;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[999999] bg-[#050505] flex items-center justify-center overflow-hidden px-6 md:px-44"
    >
      {/* Cinematic Shutter System */}
      <div data-dir="top" ref={topBarRef} className="absolute top-0 left-0 right-0 h-1/2 bg-[#020202] z-40 border-b border-[#E8E8E6]/5 will-change-transform" />
      <div data-dir="bottom" ref={bottomBarRef} className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#020202] z-40 border-t border-[#E8E8E6]/5 will-change-transform" />

      {/* Atmospheric Layers */}
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,17,17,0.03)_0%,transparent_85%)] opacity-60" />
      <div className="absolute inset-0 halftone-bg opacity-[0.05] mix-blend-overlay pointer-events-none" />
      
      {/* Subliminal Kanji Flash */}
      <div 
        ref={subliminalRef}
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none opacity-0 select-none"
      >
        <span className="text-[25vw] font-black text-[#d91111] opacity-20 filter blur-sm">
          {kanjiList[quoteIndex.current % kanjiList.length]}
        </span>
      </div>

      {/* The Sunder Flash */}
      <div 
        ref={slashRef} 
        className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#d91111] -translate-y-1/2 z-30 shadow-[0_0_50px_rgba(217,17,17,0.9)] opacity-0 will-change-transform" 
      />

      <div className="relative z-20 flex flex-col items-center max-w-7xl w-full mx-auto">
         <h1 
          ref={quoteRef} 
          className="text-3xl md:text-7xl lg:text-[8rem] font-black font-display text-[#E8E8E6] uppercase tracking-[-0.05em] leading-[0.75] text-center mb-28 italic will-change-transform drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] mx-auto"
         >
           {wrappedChars}
         </h1>
         
         <div 
          ref={sourceRef}
          className="flex items-center justify-center gap-6 md:gap-24 opacity-0 will-change-transform mx-auto"
         >
            <div className="w-12 md:w-48 h-[1px] bg-[#d91111]/40 shadow-[0_4px_30px_rgba(217,17,17,0.5)]" />
            <div className="relative group px-6 py-4 md:px-14 md:py-7 border border-[#E8E8E6]/10 backdrop-blur-sm">
              <span className="font-mono text-xs md:text-3xl text-[#d91111] tracking-[0.3em] md:tracking-[1.1em] uppercase font-black italic">
                {source}
              </span>
              <div className="absolute top-0 left-0 w-[5px] h-full bg-[#d91111] shadow-[0_0_20px_rgba(217,17,17,0.8)]" />
            </div>
            <div className="w-12 md:w-48 h-[1px] bg-[#d91111]/40 shadow-[0_4px_30px_rgba(217,17,17,0.5)]" />
         </div>
      </div>

      {/* Cinematic Texture Overlays */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.08] grain-bg mix-blend-overlay" />
      <div className="absolute inset-0 pointer-events-none z-50 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)] opacity-80" />
    </div>
  );
}
