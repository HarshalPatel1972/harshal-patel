"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { useMagnetic } from "./AnimationKit";
import ExorcistsScroll from './ui/ExorcistsScroll';
import { SubliminalKanji } from "./ui/SubliminalKanji";
import { useLanguage } from "@/context/LanguageContext";

export function Hero() {
  const { language } = useLanguage();
  const currentProfile = profile[language as keyof typeof profile];
  const containerRef = useRef<HTMLDivElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);
  const cta1Ref = useMagnetic<HTMLButtonElement>(0.2);
  const cta2Ref = useMagnetic<HTMLButtonElement>(0.2);
  const [scrollProgress, setScrollProgress] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const introStages = {
    en: [
      "I find what's broken",
      "and build what's missing."
    ],
    ja: [
      "壊れたものを見つけ、",
      "足りないものを創る。"
    ],
    ko: [
      "망가진 것을 찾아내어",
      "부족한 것을 채웁니다."
    ],
    "zh-tw": [
      "找出破碎之處，",
      "構築缺失之事。"
    ],
    hi: [
      "मैं ढूंढता हूँ जो टूटा है,",
      "और बनाता हूँ जो गायब है।"
    ],
    fr: [
      "Je trouve ce qui est brisé",
      "et je construis ce qui manque."
    ],
    id: [
      "Saya menemukan apa yang rusak",
      "dan membangun apa yang hilang."
    ]
  };

  const buttonLabels = {
    en: { work: "View Projects", about: "About Me" },
    ja: { work: "プロジェクト", about: "私について" },
    ko: { work: "프로젝트 보기", about: "소개" },
    "zh-tw": { work: "查看專案", about: "關於我" },
    hi: { work: "प्रोजेक्ट देखें", about: "मेरे बारे में" },
    fr: { work: "Voir Projets", about: "À Propos" },
    id: { work: "Lihat Proyek", about: "Tentang Saya" }
  };

  const currentIntro = introStages[language as keyof typeof introStages];
  const currentButtons = buttonLabels[language as keyof typeof buttonLabels] || buttonLabels.en;

  // ─── SCROLL TRACKER ENGINE ───────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const st = window.scrollY;
      const sectionOffset = trackRef.current.offsetTop;
      const trackHeight = trackRef.current.offsetHeight - window.innerHeight;
      
      const progress = Math.max(0, Math.min(1, (st - sectionOffset) / trackHeight));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compute transform values based on scroll progress
  const heroRecedeStyle = {
    transform: `scale(${1 - scrollProgress * 0.5}) translateY(${scrollProgress * -150}px)`,
    filter: `blur(${scrollProgress * 25}px)`,
    opacity: 1 - scrollProgress * 3.5,
    pointerEvents: (scrollProgress > 0.4 ? 'none' : 'auto') as React.CSSProperties['pointerEvents'],
    willChange: 'transform, filter, opacity'
  };

  const allWords = currentIntro.join(" ").split(" ");

  return (
    <section
      ref={trackRef}
      className="h-[250vh] relative bg-[var(--bg-ink)] z-0 isolate transform-gpu"
    >
      <div 
        id="hero" 
        ref={containerRef} 
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-4 md:px-6"
      >

        <div className="absolute inset-x-4 md:inset-x-24 inset-y-0 z-50 pointer-events-none flex items-center justify-center">
          
          <div className="relative w-full max-w-7xl flex items-start gap-6 md:gap-12">

            <div id="hero-intro-text" className="text-justify leading-[1.05] md:leading-[1.15]">
              {allWords.map((word, i) => {
                const start = (i / allWords.length) * 0.8;
                const end = start + 0.2;
                const activeProgress = Math.max(0, Math.min(1, (scrollProgress - start) / (end - start)));
                
                const cleanWord = word.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
                const isSpecial = cleanWord === 'broken' || cleanWord === 'build' || cleanWord === 'missing' ||
                                  cleanWord === '壊れた' || cleanWord === '創る' || cleanWord === '足りない' ||
                                  cleanWord === '망가진' || cleanWord === '부족한' || 
                                  cleanWord === '破碎' || cleanWord === '缺失' ||
                                  cleanWord === 'टूटा' || cleanWord === 'बनाता' || cleanWord === 'गायब' ||
                                  cleanWord === 'brisé' || cleanWord === 'construit' || cleanWord === 'manque' ||
                                  cleanWord === 'rusak' || cleanWord === 'membangun';
                
                return (
                    <span 
                      key={i}
                      className="inline-block mr-[0.55em] mb-2"
                      style={{
                        opacity: activeProgress,
                        transform: `translateY(${(1 - activeProgress) * 25}px)`,
                        filter: `blur(${(1 - activeProgress) * 12}px)`,
                        willChange: 'opacity, transform, filter'
                      }}
                    >
                      <span 
                        className={`select-none transition-all duration-700
                          ${isSpecial ? 
                            `text-[2.15rem] md:text-[4.89rem] lg:text-[6.84rem] ${language === 'hi' ? 'font-season' : 'font-cirka'} text-[var(--accent-blood)] drop-shadow-[0_0_10px_rgba(217,17,17,0.3)]` : 
                            `text-[1.87rem] md:text-[4.25rem] lg:text-[5.95rem] ${language === 'hi' ? 'font-season' : 'font-season'} text-[var(--text-bone)]`}`}
                      >
                        {word}
                      </span>
                    {/* Poetic Line breaks */}
                    {((language === 'en' && i === 3) || 
                      (language === 'ja' && i === 0)) && <br className="hidden md:block" />}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
          
          {/* CLEAN ARROW FLOW INDICATOR */}
          <div 
            className="absolute bottom-[14px] left-0 right-0 flex flex-col items-center transition-all duration-700 pointer-events-none"
            style={{ 
              opacity: scrollProgress > 0.05 ? 0 : 0.8,
              transform: `translateY(${scrollProgress > 0.05 ? 40 : 0}px)`
            }}
          >
             <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--text-bone)] to-transparent opacity-20" />
          </div>

        <div style={heroRecedeStyle} className="w-full h-full flex items-center justify-center">
          {/* Halftone / Grain Texture Base */}
          <div className="absolute inset-0 halftone-bg z-0 opacity-10 pointer-events-none" />

          {/* Subliminal Elements Layer */}
          <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-150 pointer-events-none">
            <SubliminalKanji kanji="構築" />
          </div>

          <div className="relative z-10 w-full px-6 flex flex-col items-center">
            
            {/* Minimalist Profile Indicator (Poetic) */}
            <div className="mb-8 flex items-center gap-12 opacity-80 mix-blend-difference overflow-hidden">
               <span className="text-[10px] tracking-[0.5em] text-[var(--text-bone)] font-mono uppercase">System: Operational</span>
               <div className="w-12 h-[1px] bg-[var(--accent-blood)] opacity-50" />
               <span className="text-[10px] tracking-[0.5em] text-[var(--text-bone)] font-mono uppercase">Identity: {currentProfile.title.split(' ')[0]}</span>
            </div>

            <div 
              ref={titlesRef}
              className="relative flex flex-col items-center space-y-4 md:space-y-6"
            >
              {/* Cinematic Name Reveal (Already visible or part of scroll recede) */}
               <h1 className="text-4xl md:text-6xl lg:text-7xl font-cirka text-[var(--text-bone)] tracking-tighter mix-blend-difference">
                 {currentProfile.name}
               </h1>
            </div>

            <div className="mt-20 flex flex-col md:flex-row items-center gap-8 md:gap-16">
               <button 
                 ref={cta1Ref}
                 data-cursor="play"
                 className="group relative px-8 py-3 bg-[var(--text-bone)] text-[var(--bg-ink)] font-season text-lg overflow-hidden transition-all duration-500 hover:tracking-widest"
               >
                 <span className="relative z-10">{currentButtons.work}</span>
                 <div className="absolute inset-0 bg-[var(--accent-blood)] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
               </button>

               <button 
                 ref={cta2Ref}
                 className="group flex items-center gap-4 text-[var(--text-bone)] font-season text-lg tracking-wide hover:gap-8 transition-all duration-500"
               >
                 <span className="opacity-60 group-hover:opacity-100 transition-opacity underline decoration-[var(--accent-blood)] decoration-2 underline-offset-8">
                   {currentButtons.about}
                 </span>
                 <div className="w-8 h-[1px] bg-[var(--text-bone)] opacity-40 group-hover:w-16 transition-all" />
               </button>
            </div>
          </div>

          {/* BACKGROUND DECORATIVE LINES (Poetic/Structural) */}
          <div className="absolute inset-0 z-[-1] pointer-events-none opacity-20">
            <div className="absolute left-[8%] top-0 bottom-0 w-[1px] bg-[var(--text-bone)] opacity-5" />
            <div className="absolute right-[8%] top-0 bottom-0 w-[1px] bg-[var(--text-bone)] opacity-5" />
            <div className="absolute top-[20%] left-0 right-0 h-[1px] bg-[var(--text-bone)] opacity-5" />
            <div className="absolute bottom-[20%] left-0 right-0 h-[1px] bg-[var(--text-bone)] opacity-5" />
          </div>
        </div>

        {/* Global UI Decoration (Corner Frames) */}
        <div className="absolute top-8 left-8 right-8 h-[1px] bg-[var(--text-bone)] opacity-10 pointer-events-none hidden md:block" />
        <div className="absolute bottom-8 left-8 right-8 h-[1px] bg-[var(--text-bone)] opacity-10 pointer-events-none hidden md:block" />
      </div>
    </section>
  );
}

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const h = document.documentElement, b = document.body, st = 'scrollTop', sh = 'scrollHeight';
      const total = (h[sh] || b[sh]) - h.clientHeight;
      if (total === 0) {
        setProgress(0);
        return;
      }
      setProgress((h[st] || b[st]) / total * 100);
    };
    window.addEventListener('scroll', update);
    return () => window.removeEventListener('scroll', update);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-[1px] z-[100] pointer-events-none">
      <div className="h-full bg-[var(--accent-blood)] transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
    </div>
  );
}
