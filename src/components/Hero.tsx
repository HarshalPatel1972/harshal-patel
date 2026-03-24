import React, { useEffect, useRef, useMemo, memo, useState } from "react";
import { profile } from "@/data/profile";
import { useMagnetic } from "./AnimationKit";
import ExorcistsScroll from './ui/ExorcistsScroll';
import { useLanguage } from "@/context/LanguageContext";

/**
 * Priority 11: Memoizing individual words to prevent re-renders
 * during scroll-based style updates.
 */
const IntroWord = memo(({ word, i, totalWords, language }: { 
  word: string; 
  i: number; 
  totalWords: number; 
  language: string 
}) => {
  const start = (i / totalWords) * 0.8;
  const end = start + 0.2;
  
  const cleanWord = word.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
  const isBroken = cleanWord === 'broken' || cleanWord === '壊れた' || cleanWord === '망가진' || cleanWord === '破碎' || cleanWord === 'टूटा' || cleanWord === 'brisé' || cleanWord === 'rusak';
  const isBuild = cleanWord === 'build' || cleanWord === '創る' || cleanWord === 'बनाता' || cleanWord === 'membangun';
  const isMissing = cleanWord === 'missing' || cleanWord === '足りない' || cleanWord === '부족한' || cleanWord === '缺失' || cleanWord === 'गायब' || cleanWord === 'manque' || cleanWord === 'hilang' || word === '.';
  
  return (
    <span 
      className="inline-block mr-[0.55em] mb-2 reveal-word"
      style={{
        "--start": start,
        "--end": end,
      } as React.CSSProperties}
    >
      <span 
        className={`relative select-none transition-all duration-700
          ${(isBroken || isBuild || isMissing) ? 
            `text-[2.15rem] md:text-[4.89rem] lg:text-[6.84rem] ${language === 'hi' ? 'font-season' : 'font-cirka'} text-[var(--accent-blood)] drop-shadow-[0_0_10px_rgba(217,17,17,0.3)]` : 
            `text-[1.87rem] md:text-[4.25rem] lg:text-[5.95rem] ${language === 'hi' ? 'font-season' : 'font-season'} text-[var(--text-bone)]`}`}
      >
        {word}
      </span>
      {((language === 'en' && i === 3) || (language === 'ja' && i === 0)) && <br className="hidden md:block" />}
    </span>
  );
});

IntroWord.displayName = "IntroWord";

export function Hero() {
  const { language } = useLanguage();
  const currentProfile = profile[language];
  const [whoAmIMode, setWhoAmIMode] = useState(false);
  const [showRangoText, setShowRangoText] = useState(false);
  const keysRef = useRef<string[]>([]);
  const titlesRef = useRef<HTMLDivElement>(null);
  const cta1Ref = useMagnetic<HTMLAnchorElement>(0.2);
  const cta2Ref = useMagnetic<HTMLAnchorElement>(0.2);
  const trackRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const introStages = {
    en: ["I find what's broken", "and build what's missing."],
    ja: ["壊れたものを見つけ、", "足りないものを創る。"],
    ko: ["망가진 것을 찾아내어", "부족한 것을 채웁니다."],
    "zh-tw": ["找出破碎之處，", "構築缺失之事。"],
    hi: ["मैं ढूंढता हूँ जो टूटा है,", "और बनाता हूँ जो गायब है।"],
    fr: ["Je trouve ce qui est brisé", "et je construis ce qui manque."],
    id: ["Saya menemukan apa yang rusak", "dan membangun apa yang hilang."],
    de: ["Ich finde, was kaputt ist,", "und baue, was fehlt."],
    it: ["Trovo ciò che è rotto", "e costruisco ciò che manca."],
    "pt-br": ["Eu encontro o que está quebrado", "e construo o que falta."],
    "es-419": ["Encuentro lo que está roto", "y construyo lo que falta."],
    es: ["Encuentro lo que está roto", "y construyo lo que falta."]
  };

  const currentIntro = introStages[language as keyof typeof introStages] || introStages.en;
  const allWords = useMemo(() => currentIntro.join(" ").split(" "), [currentIntro]);

  // WHOAMI EASTER EGG LISTENER 🏮
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      keysRef.current.push(e.key.toLowerCase());
      if (keysRef.current.length > 6) keysRef.current.shift();
      const sequence = keysRef.current.join("");
      if (sequence === "whoami") {
        setWhoAmIMode(true);
        setTimeout(() => setShowRangoText(true), 250); 
        keysRef.current = [];
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  // FLASHLIGHT TRACKING (High-Res RAF Engine) 🔦
  useEffect(() => {
    let rafId: number;
    const update = () => {
      if (whoAmIMode && spotlightRef.current) {
        spotlightRef.current.style.setProperty('--mouse-x', `${mouseRef.current.x}px`);
        spotlightRef.current.style.setProperty('--mouse-y', `${mouseRef.current.y}px`);
      }
      rafId = requestAnimationFrame(update);
    };
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(update);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [whoAmIMode]);

  // SCROLL ENGINE
  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current || !heroContentRef.current) return;
      const st = window.scrollY;
      const sectionOffset = trackRef.current.offsetTop;
      const trackHeight = trackRef.current.offsetHeight - window.innerHeight;
      if (st > sectionOffset + trackHeight + 500) return;
      const progress = Math.max(0, Math.min(1, (st - sectionOffset) / trackHeight));
      trackRef.current.style.setProperty('--scroll-progress', progress.toString());
      const scale = 1 - progress * 0.5;
      const translate = progress * -150;
      const opacity = Math.max(0, 1 - progress * 3.5);
      const blur = progress * 20;
      heroContentRef.current.style.transform = `translate3d(0, ${translate}px, 0) scale(${scale})`;
      heroContentRef.current.style.opacity = opacity.toString();
      heroContentRef.current.style.filter = blur > 0.5 ? `blur(${blur}px)` : 'none';
      heroContentRef.current.style.pointerEvents = progress > 0.4 ? 'none' : 'auto';
    };
    window.addEventListener("scroll", handleScroll, { passive: true }); 
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={trackRef}
      className="h-[250vh] relative bg-[var(--bg-ink)] z-0 isolate transform-gpu overflow-visible"
      style={{ "--scroll-progress": "0" } as React.CSSProperties}
    >
      {/* UNIVERSAL FLASHLIGHT 📽️ */}
      <div 
        ref={spotlightRef}
        className={`fixed inset-0 z-[100] pointer-events-none transition-opacity ${whoAmIMode ? 'opacity-100 duration-[50ms]' : 'opacity-0 duration-1000'}`}
        style={{
          background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), transparent 100px, rgba(0,0,0,0.99) 300px)`,
          backdropFilter: whoAmIMode ? 'contrast(2) grayscale(1) brightness(0.6)' : 'none',
          willChange: 'background'
        }}
      />

      <div id="hero" className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-4 md:px-6">
        {/* RANGO VIEWPORT IMPACT 🌵 */}
        {whoAmIMode && (
          <div 
            className="absolute inset-0 z-[80] flex flex-col items-center justify-center bg-black select-none transition-all duration-700 pointer-events-auto cursor-none"
            onClick={() => { setWhoAmIMode(false); setShowRangoText(false); }}
          >
             {showRangoText && (
               <>
                 <div className="mb-4 cinematic-in opacity-80">
                    <span className="uppercase tracking-[0.5em] text-sm md:text-xl font-black text-white">
                      NO MAN CAN WALK OUT ON HIS OWN STORY
                    </span>
                 </div>
                 <h1 className="text-[28vw] leading-[0.7] font-black uppercase text-white tracking-[-0.04em] flex gap-x-[4vw]">
                    {"RANGO".split("").map((char, i) => (
                      <span key={i} className="inline-block hover:text-[var(--accent-blood)] transition-colors duration-300">
                        {char}
                      </span>
                    ))}
                 </h1>
                 <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 opacity-20 text-[10px] tracking-[1em] text-white uppercase italic">
                    The Spirit of the West awaits
                 </div>
               </>
             )}
          </div>
        )}

        <div className={`absolute inset-x-4 md:inset-x-24 inset-y-0 z-50 pointer-events-none flex items-center justify-center transition-opacity duration-500 ${whoAmIMode ? 'opacity-0' : 'opacity-100'}`}>
          <div className="relative w-full max-w-7xl flex flex-col items-center md:items-start gap-6 md:gap-12 text-center md:text-left">
            <div id="hero-intro-text" className="leading-[1.05] md:leading-[1.15]">
              {allWords.map((word, i) => (
                <IntroWord key={i} word={word} i={i} totalWords={allWords.length} language={language} />
              ))}
            </div>
          </div>
        </div>
          
        <div className={`absolute bottom-[44px] md:bottom-[-6px] left-0 right-0 flex flex-col items-center transition-opacity duration-700 pointer-events-none z-30 ${whoAmIMode ? 'opacity-0' : 'opacity-100'}`} style={{ opacity: 'calc(1 - (var(--scroll-progress) * 10))' } as any}>
          <div className="relative h-20 w-8 flex flex-col items-center justify-center">
            {[0, 1, 2].map((i) => (
              <svg 
                key={i} 
                className="absolute animate-arrow-flow" 
                style={{ animationDelay: `${i * 0.6}s` }} 
                width="24"
                height="24" 
                viewBox="0 0 24 24" 
                fill="none"
              >
                <path d="M12 4L12 20M12 20L5 13M12 20L19 13" stroke="white" strokeWidth="2.5" strokeLinecap="square" className="opacity-60"/>
              </svg>
            ))}
          </div>
        </div>

        <div ref={heroContentRef} className={`w-full h-full flex items-center justify-center transition-opacity duration-500 ${whoAmIMode ? 'opacity-0' : 'opacity-100'}`}>
          <div className="absolute inset-0 halftone-bg z-0 opacity-10 pointer-events-none" />
          <div className="md:hidden w-full h-full">
             <ExorcistsScroll />
          </div>

          <div id="hero-content-fadeout" className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center md:items-start text-center md:text-left justify-center mt-12 md:mt-24 pointer-events-none">
            <div id="available-for-opps" className="cinematic-in inline-flex items-center gap-3 mb-8 px-5 py-2 border-l-4 border-[var(--accent-blood)] bg-white text-[var(--bg-ink)] brutal-shadow transform -rotate-1">
              <span className={`uppercase tracking-[0.2em] text-[10px] sm:text-xs font-black ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
                {language === 'en' ? "Available for Opportunities" : language === 'ja' ? "仕事の依頼を受付中" : language === 'ko' ? "업무 의뢰 가능" : language === 'zh-tw' ? "開放合作機會" : language === 'fr' ? "Disponible pour des Opportunिटीज" : language === 'id' ? "Tersedia untuk Peluang" : language === 'de' ? "Verfügbar für Möglichkeiten" : language === 'it' ? "Disponibile per Opportunità" : language === 'pt-br' ? "Disponível para Oportunidades" : (language === 'es-419' || language === 'es') ? "Disponible para Oportunidades" : "अवसरों के लिए उपलब्ध"}
              </span>
            </div>

            <div ref={titlesRef} className="relative mb-8 w-full cursor-none group/title">
              <h1 id="hero-title" className={`cinematic-in text-[13.3vw] sm:text-[7.1rem] md:text-[9.8rem] lg:text-[12.5rem] leading-[0.8] font-black uppercase text-[var(--text-bone)] select-none chromatic-aberration relative z-20 ${language === 'hi' ? 'font-hindi' : 'font-display'}`} style={{ letterSpacing: "-0.04em" }}>
                {currentProfile.name.split(" ")[0].split("").map((char, i) => (
                  <span key={i} className="inline-block transition-all duration-300 hover:skew-x-12 hover:text-[var(--accent-blood)] hover:scale-110">
                    {char}
                  </span>
                ))}
              </h1>
              <h1 className={`cinematic-in text-[13.3vw] sm:text-[7.1rem] md:text-[9.8rem] lg:text-[12.5rem] leading-[0.8] font-black uppercase tracking-[-0.04em] text-transparent select-none md:ml-[15%] text-stroke-bone relative z-20 ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
                 {currentProfile.name.split(" ").slice(1).join(" ").split("").map((char, i) => (
                  <span key={i} className="inline-block transition-all duration-300 hover:-skew-x-12 hover:text-[var(--accent-blood)] hover:scale-110">
                    {char}
                  </span>
                ))}
              </h1>
            </div>

            <p className="cinematic-in text-base md:text-xl text-[var(--text-muted)] max-w-xl font-mono leading-relaxed mb-12 mt-4 md:mt-4">
              {currentProfile.tagline}
            </p>
          </div>
        </div>

        <div className="absolute top-8 left-8 right-8 h-[1px] bg-[var(--text-bone)] opacity-10 pointer-events-none hidden md:block" />
        <div className="absolute bottom-8 left-8 right-8 h-[1px] bg-[var(--text-bone)] opacity-10 pointer-events-none hidden md:block" />
      </div>
      <style>{`
        .reveal-word {
          --progress: clamp(0, (var(--scroll-progress) - var(--start)) / (var(--end) - var(--start)), 1);
          opacity: var(--progress);
          transform: translateY(calc((1 - var(--progress)) * 25px));
          filter: blur(calc((1 - var(--progress)) * 12px));
          will-change: transform, opacity;
        }
        @keyframes arrow-flow {
          0% { transform: translateY(-45px); opacity: 0; }
          20% { opacity: 0.15; }
          50% { transform: translateY(0px); opacity: 1; }
          80% { opacity: 0.15; }
          100% { transform: translateY(45px); opacity: 0; }
        }
        .animate-arrow-flow {
          animation: arrow-flow 1.8s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}
