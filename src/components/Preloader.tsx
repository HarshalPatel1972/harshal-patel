"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { createTimeline, stagger } from "animejs";
import mappaData from "@/data/mappa_master.json";
import { useLanguage } from "@/context/LanguageContext";

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [complete, setComplete] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLHeadingElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const slashRef = useRef<HTMLDivElement>(null);
  const subliminalRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<any>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const breathIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { language } = useLanguage();

  // Unified Data Access: Pick one scene (Quote + Image + Mapping) once
  const sceneIndex = useRef(Math.floor(Math.random() * mappaData.length));
  const scene = mappaData[sceneIndex.current % mappaData.length];
  
  const quote = language === 'ja' ? scene.ja.text : scene.en.text;
  const author = language === 'ja' ? scene.ja.author : scene.en.author;
  const source = author;
  const bgImage = scene.image;

  const wordCount = quote.split(/\s+/).filter(w => w.length > 0).length;
  const readTime = Math.max(5500, 4000 + wordCount * 320);

  const targetBgOpacity = Math.min(0.15, wordCount * 0.02);

  const quoteFontSizeClass = useMemo(() => {
    const len = quote.length;
    const isJA = language === 'ja';
    
    // Japanese characters are wider/heavier, so they need slightly more aggressive scaling
    if (isJA) {
      if (len > 60) return "text-xl md:text-3xl lg:text-[3.5rem]";
      if (len > 40) return "text-2xl md:text-4xl lg:text-[4.5rem]";
      if (len > 25) return "text-2xl md:text-5xl lg:text-[5.5rem]";
      if (len > 15) return "text-3xl md:text-6xl lg:text-[6.5rem]";
      return "text-3xl md:text-7xl lg:text-[8rem]";
    } else {
      if (len > 100) return "text-lg md:text-2xl lg:text-[3.8rem]";
      if (len > 80) return "text-xl md:text-3xl lg:text-[4.5rem]";
      if (len > 60) return "text-2xl md:text-4xl lg:text-[5.5rem]";
      if (len > 40) return "text-2xl md:text-5xl lg:text-[6.5rem]";
      return "text-3xl md:text-7xl lg:text-[8rem]";
    }
  }, [quote, language]);

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
    setMounted(true);
  }, []);

  useEffect(() => {
    if (complete || !mounted) return;
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

        if (bgImageRef.current) {
          tl.add(bgImageRef.current, {
            opacity: [0, targetBgOpacity],
            duration: (pChars.length * 15) + 800,
            ease: 'linear'
          }, 1000);
        }
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

        if (bgImageRef.current) {
          exitTl.add(bgImageRef.current, {
            opacity: 0,
            duration: 800,
            ease: 'easeOutSine'
          }, 0);
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
  }, [complete, onComplete, quote, readTime, language, mounted]);

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
      
      {/* AUTHOR MAPPED BACKGROUND (Cinematic Materialization) */}
      {bgImage && (
        <div 
          ref={bgImageRef}
          className="absolute inset-0 z-0 opacity-0 pointer-events-none"
          style={{ 
            backgroundImage: `url('${bgImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(1) brightness(0.8)' // MAPPA aesthetic: high-contrast monochrome base
          }}
        />
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,17,17,0.03)_0%,transparent_85%)] opacity-60" />
      <div className="absolute inset-0 halftone-bg opacity-[0.05] mix-blend-overlay pointer-events-none" />
      

      {/* The Sunder Flash */}
      <div 
        ref={slashRef} 
        className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#d91111] -translate-y-1/2 z-30 shadow-[0_0_50px_rgba(217,17,17,0.9)] opacity-0 will-change-transform" 
      />

      <div className="relative z-20 flex flex-col items-center max-w-7xl w-full mx-auto">
         <h1 
          ref={quoteRef} 
          className={`${quoteFontSizeClass} font-black font-display text-[#E8E8E6] uppercase tracking-[-0.05em] ${quote.length > 50 ? 'leading-[0.95]' : 'leading-[0.85]'} text-center mb-28 italic will-change-transform drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] mx-auto`}
         >
           {mounted ? wrappedChars : null}
         </h1>
         
         <div 
          ref={sourceRef}
          className="flex items-center justify-center gap-6 md:gap-24 opacity-0 will-change-transform mx-auto"
         >
            <div className="w-12 md:w-48 h-[1px] bg-[#d91111]/40 shadow-[0_4px_30px_rgba(217,17,17,0.5)]" />
            <div className="relative group px-6 py-4 md:px-14 md:py-7 border border-[#E8E8E6]/10 backdrop-blur-sm">
              <span className="font-mono text-xs md:text-3xl text-[#d91111] tracking-[0.3em] md:tracking-[1.1em] uppercase font-black italic">
                {mounted ? source : null}
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
