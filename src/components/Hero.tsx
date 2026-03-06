"use client";

import { useEffect, useRef } from "react";
import { animate as anime, utils } from "animejs";
import { profile } from "@/data/profile";
import { useMagnetic } from "./AnimationKit";
import { SubliminalKanji } from "./ui/SubliminalKanji";
import { useLanguage } from "@/context/LanguageContext";

export function Hero() {
  const { language } = useLanguage();
  const currentProfile = profile[language];

  const containerRef = useRef<HTMLDivElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);
  const cta1Ref = useMagnetic(0.2);
  const cta2Ref = useMagnetic(0.2);

  // Cinematic opening animations (MAPPA Style: slow continuous drift + sharp impacts)
  useEffect(() => {
    if (!containerRef.current) return;

    // Staggered harsh entrance for main elements
    const elements = containerRef.current.querySelectorAll(".cinematic-in");
    anime(elements as any, {
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 1000,
      delay: utils.stagger(200, { start: 300 }),
      easing: "outCubic",
    });

    // Slow cinematic scaling of the main background ink slash
    const slash = containerRef.current.querySelector(".ink-slash");
    if (slash) {
      anime(slash, {
        scale: [0.8, 1.1],
        opacity: [0, 1],
        duration: 3000,
        easing: "easeOutSine",
      });
    }

    // Continuous ultra-slow parallax drift for the main title (Natural Breathing)
    if (titlesRef.current) {
      anime(titlesRef.current, {
        scale: [1, 1.05, 1],
        duration: 24000,
        loop: true,
        ease: "easeInOutSine"
      });
    }
  }, []);

  return (
    <section 
      id="hero" 
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg-ink)] px-4 md:px-6"
    >
      {/* Halftone / Grain Texture Base */}
      <div className="absolute inset-0 halftone-bg z-0 opacity-10 pointer-events-none" />

      {/* Vertical Kanji Watermark */}
      <SubliminalKanji kanji="起源" position="right" />

      {/* Massive Abstract Ink Stroke (MAPPA style title card background) */}
      <div className="ink-slash absolute left-[-10%] sm:left-[10%] top-[20%] w-[120%] sm:w-[80%] h-[60%] z-0 pointer-events-none opacity-0 select-none flex items-center justify-center">
         <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-[var(--accent-blood)] opacity-20 drop-shadow-2xl">
            <path d="M10,80 Q30,50 60,60 T90,20 Q80,10 50,40 T10,80 Z" fill="currentColor" />
            <path d="M5,90 Q40,40 70,70 T95,10 Q70,30 30,80 T5,90 Z" fill="currentColor" opacity="0.5" />
         </svg>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center md:items-start text-center md:text-left justify-center mt-12 md:mt-24">
        
        {/* Professional Minimalist Status -> Brutalist Warning Tape */}
        <div className="cinematic-in inline-flex items-center gap-3 mb-8 px-5 py-2 border-l-4 border-[var(--accent-blood)] bg-[var(--text-bone)] text-[var(--bg-ink)] brutal-shadow transform -rotate-1">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-blood)] animate-pulse" />
          <span className="uppercase tracking-[0.2em] text-[10px] sm:text-xs font-black font-display">
            {language === 'en' ? "Available for Opportunities" : "仕事の依頼を受付中"}
          </span>
        </div>

        {/* Cinematic Title Scaling container */}
        <div ref={titlesRef} className="relative mb-8 w-full">
           {/* FIRST NAME */}
           <h1 className="cinematic-in text-[15vw] sm:text-[8rem] md:text-[11rem] lg:text-[14rem] leading-[0.8] font-black font-display uppercase text-[var(--text-bone)] select-none chromatic-aberration" style={{ letterSpacing: "-0.04em" }}>
             {currentProfile.name.split(" ")[0]}
           </h1>
           
           {/* LAST NAME (Offset, outlined, intersecting) */}
           <h1 className="cinematic-in text-[15vw] sm:text-[8rem] md:text-[11rem] lg:text-[14rem] leading-[0.8] font-black font-display uppercase tracking-[-0.04em] text-transparent select-none md:ml-[15%] text-stroke-bone">
             {currentProfile.name.split(" ").slice(1).join(" ")}
           </h1>
           
           {/* Role Accent Block overlapping the typography */}
           <div className="cinematic-in relative md:absolute bottom-auto md:bottom-[20%] right-auto md:right-[10%] bg-[var(--accent-blood)] text-white font-black font-display text-sm sm:text-xl md:text-3xl px-6 py-3 sm:px-8 sm:py-5 uppercase tracking-[0.15em] mt-4 md:mt-0 mx-auto md:mx-0 max-w-[280px] md:max-w-none w-full md:w-auto text-center manga-cut-tr shadow-2xl">
             {currentProfile.title}
           </div>
        </div>

        {/* Clear, straightforward tagline without typewriter or terminal nonsense */}
        <p className="cinematic-in text-base md:text-xl text-[var(--text-muted)] max-w-xl font-mono leading-relaxed mb-16 mt-8 md:mt-4">
          {currentProfile.tagline}
        </p>

        {/* Aggressive, Diagonal Brutalist CTAs */}
        <div className="cinematic-in flex flex-col sm:flex-row gap-6 w-full sm:w-auto max-w-[280px] md:max-w-none self-center md:self-start -mt-[15px]">
          <a ref={cta1Ref as any} href="#projects"
            className="group relative flex items-center justify-center gap-4 bg-[var(--text-bone)] text-[var(--bg-ink)] px-8 py-5 md:px-12 md:py-6 text-sm md:text-lg font-black font-display uppercase tracking-widest manga-cut-br brutal-shadow hover:bg-[var(--accent-blood)] hover:text-white transition-all duration-300 transform -skew-x-3"
          >
            <span>{language === 'en' ? "View Work" : "実績を見る"}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="group-hover:translate-x-2 transition-transform duration-300">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          
          <a ref={cta2Ref as any} href="#contact"
             className="relative flex items-center justify-center px-8 py-5 md:px-12 md:py-6 bg-[var(--bg-ink)] border-2 border-[var(--text-bone)] text-[var(--text-bone)] text-sm md:text-lg font-black font-display uppercase tracking-widest manga-cut-tr hover:bg-[var(--text-bone)] hover:text-[var(--bg-ink)] transition-colors duration-300 transform -skew-x-3"
          >
            {language === 'en' ? "Contact" : "連絡する"}
          </a>
        </div>

      </div>

      {/* Cinematic Frame lines (Top and Bottom subtle borders) */}
      <div className="absolute top-8 left-8 right-8 h-[1px] bg-[var(--text-bone)] opacity-10 pointer-events-none hidden md:block" />
      <div className="absolute bottom-8 left-8 right-8 h-[1px] bg-[var(--text-bone)] opacity-10 pointer-events-none hidden md:block" />
    </section>
  );
}
