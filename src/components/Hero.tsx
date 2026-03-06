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
           
           {/* Brutalist Role Stamp */}
           <div className="cinematic-in relative md:absolute bottom-auto md:bottom-[15%] right-auto md:right-[5%] flex flex-col items-end mt-8 md:mt-0 mx-auto w-fit md:w-auto">
             <div className="bg-[var(--text-bone)] text-[var(--bg-ink)] px-6 py-3 md:px-10 md:py-4 border-r-8 border-[var(--accent-blood)] shadow-[12px_12px_0px_0px_rgba(217,17,17,0.8)] transition-transform hover:-translate-y-1 hover:-translate-x-1 duration-300">
               <span className="font-black font-display text-base sm:text-2xl md:text-4xl uppercase tracking-[0.2em] md:tracking-[0.4em] ml-2 md:ml-4">
                 {currentProfile.title}
               </span>
             </div>
             {/* Small translated technical sub-text common in MAPPA/Evangelion UIs */}
             <div className="text-[var(--accent-blood)] text-[10px] md:text-[12px] tracking-[0.4em] font-mono font-bold mt-4 mr-2">
               {"// SYSTEM.ROLE.EXEC_"}
             </div>
           </div>
        </div>

        {/* Clear, straightforward tagline without typewriter or terminal nonsense */}
        <p className="cinematic-in text-base md:text-xl text-[var(--text-muted)] max-w-xl font-mono leading-relaxed mb-12 mt-4 md:mt-4">
          {currentProfile.tagline}
        </p>

        {/* Ultra-Stylized Technical MAPPA CTAs */}
        <div className="cinematic-in flex flex-col sm:flex-row gap-6 md:gap-8 w-full sm:w-auto self-center md:self-start mt-2">
          
          <a ref={cta1Ref as any} href="#projects"
            className="group relative flex items-center justify-between min-w-[260px] md:min-w-[320px] bg-transparent border border-[var(--text-bone)]/30 hover:border-[var(--accent-blood)] transition-colors duration-500 overflow-hidden"
          >
            {/* The MAPPA bleeding fill block that expands */}
            <div className="absolute inset-0 bg-[var(--accent-blood)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-0" />
            
            <div className="relative z-10 flex items-center px-6 py-4 md:px-8 md:py-6 w-full">
              <span className="text-white font-black font-display text-lg md:text-2xl tracking-[0.2em] uppercase transition-all duration-500 group-hover:tracking-[0.3em]">
                {language === 'en' ? "View Work" : "実績を見る"}
              </span>
              <span className="ml-auto text-[10px] md:text-xs font-mono tracking-widest text-[var(--text-bone)]/50 group-hover:text-white transition-colors duration-500">
                [01]
              </span>
            </div>
          </a>
          
          <a ref={cta2Ref as any} href="#contact"
             className="group relative flex items-center justify-between min-w-[260px] md:min-w-[320px] bg-transparent border border-[var(--text-bone)]/30 hover:border-[var(--text-bone)] transition-colors duration-500 overflow-hidden"
          >
            {/* The fill block that expands from the opposite side */}
            <div className="absolute inset-0 bg-[var(--text-bone)] scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-0" />
            
            <div className="relative z-10 flex items-center px-6 py-4 md:px-8 md:py-6 w-full">
              <span className="text-[var(--text-bone)] group-hover:text-[var(--bg-ink)] font-black font-display text-lg md:text-2xl tracking-[0.2em] uppercase transition-all duration-500 group-hover:tracking-[0.3em]">
                {language === 'en' ? "Contact" : "連絡する"}
              </span>
              <span className="ml-auto text-[10px] md:text-xs font-mono tracking-widest text-[var(--accent-blood)] group-hover:text-[var(--bg-ink)] transition-colors duration-500">
                [02]
              </span>
            </div>
          </a>
        </div>

      </div>

      {/* Cinematic Frame lines (Top and Bottom subtle borders) */}
      <div className="absolute top-8 left-8 right-8 h-[1px] bg-[var(--text-bone)] opacity-10 pointer-events-none hidden md:block" />
      <div className="absolute bottom-8 left-8 right-8 h-[1px] bg-[var(--text-bone)] opacity-10 pointer-events-none hidden md:block" />
    </section>
  );
}
