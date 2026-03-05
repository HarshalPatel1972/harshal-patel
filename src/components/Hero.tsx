"use client";

import { useEffect, useRef } from "react";
import { animate as anime, utils } from "animejs";
import { profile } from "@/data/profile";
import { useMagnetic } from "./AnimationKit";
import { SubliminalKanji } from "./ui/SubliminalKanji";

export function Hero() {
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg-ink)] px-6"
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
        
        {/* Professional Minimalist Status */}
        <div className="cinematic-in block mb-8 border border-[var(--text-bone)] px-4 py-2 uppercase tracking-widest text-[10px] sm:text-xs font-bold font-sans text-[var(--text-bone)] bg-black/50 backdrop-blur-sm">
          Available for Opportunities
        </div>

        {/* Cinematic Title Scaling container */}
        <div ref={titlesRef} className="relative mb-8 w-full">
           {/* FIRST NAME */}
           <h1 className="cinematic-in text-[5rem] sm:text-[8rem] md:text-[11rem] lg:text-[14rem] leading-[0.8] font-black font-display uppercase text-[var(--text-bone)] select-none chromatic-aberration" style={{ letterSpacing: "-0.04em" }}>
             {profile.name.split(" ")[0]}
           </h1>
           
           {/* LAST NAME (Offset, outlined, intersecting) */}
           <h1 className="cinematic-in text-[5rem] sm:text-[8rem] md:text-[11rem] lg:text-[14rem] leading-[0.8] font-black font-display uppercase tracking-[-0.04em] text-transparent select-none md:ml-[15%]"
               style={{ WebkitTextStroke: "2px var(--text-bone)" }}
           >
             {profile.name.split(" ").slice(1).join(" ")}
           </h1>
           
           {/* Role Accent Block overlapping the typography */}
           <div className="cinematic-in absolute bottom-0 right-0 md:bottom-[20%] md:right-[10%] bg-[var(--accent-blood)] text-white font-sans font-bold text-sm sm:text-xl md:text-2xl px-6 py-4 pt-5 uppercase tracking-wider transform translate-y-1/2 md:translate-y-0">
             Software Engineer
           </div>
        </div>

        {/* Clear, straightforward tagline without typewriter or terminal nonsense */}
        <p className="cinematic-in text-base md:text-xl text-[var(--text-muted)] max-w-xl font-sans leading-relaxed mb-16 mt-8 md:mt-4">
          {profile.tagline}
        </p>

        {/* Bold, Minimalist CTAs */}
        <div className="cinematic-in flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a ref={cta1Ref as any} href="#projects"
            className="flex items-center justify-center gap-4 bg-[var(--text-bone)] text-[var(--bg-ink)] px-10 py-5 text-sm md:text-base font-bold uppercase tracking-widest hover:scale-105 transition-transform duration-300 transform origin-left"
          >
            View Work
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          
          <a ref={cta2Ref as any} href="#contact"
             className="flex items-center justify-center px-10 py-5 border-2 border-[var(--text-bone)] text-[var(--text-bone)] text-sm md:text-base font-bold uppercase tracking-widest hover:bg-[var(--text-bone)] hover:text-[var(--bg-ink)] transition-colors duration-300"
          >
            Contact
          </a>
        </div>

      </div>

      {/* Cinematic Frame lines (Top and Bottom subtle borders) */}
      <div className="absolute top-8 left-8 right-8 h-[1px] bg-[var(--text-bone)] opacity-10 pointer-events-none hidden md:block" />
      <div className="absolute bottom-8 left-8 right-8 h-[1px] bg-[var(--text-bone)] opacity-10 pointer-events-none hidden md:block" />
    </section>
  );
}
