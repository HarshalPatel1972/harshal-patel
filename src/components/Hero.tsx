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
  const keysRef = useRef<string[]>([]);
  const titlesRef = useRef<HTMLDivElement>(null);
  const cta1Ref = useMagnetic<HTMLAnchorElement>(0.2);
  const cta2Ref = useMagnetic<HTMLAnchorElement>(0.2);
  const trackRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

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
        setTimeout(() => setWhoAmIMode(false), 4400); 
        keysRef.current = [];
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

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
      {/* THEATRICAL SPOTLIGHT 📽️ */}
      <div className={`fixed inset-0 z-[60] pointer-events-none transition-all duration-1000 ${whoAmIMode ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: `radial-gradient(circle at center, transparent 15%, rgba(0,0,0,0.98) 75%)`,
          backdropFilter: whoAmIMode ? 'contrast(1.6) grayscale(1) brightness(0.8)' : 'none'
        }}
      />

      <div 
        id="hero" 
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-4 md:px-6"
      >
        <div className="absolute inset-x-4 md:inset-x-24 inset-y-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="relative w-full max-w-7xl flex items-start gap-6 md:gap-12 transition-all duration-500" style={{ filter: whoAmIMode ? 'brightness(1.5)' : 'none' }}>
            <div id="hero-intro-text" className="text-justify leading-[1.05] md:leading-[1.15]">
              {allWords.map((word, i) => (
                <IntroWord key={i} word={word} i={i} totalWords={allWords.length} language={language} />
              ))}
            </div>
          </div>
        </div>

        <div 
          className="absolute bottom-[44px] md:bottom-[-6px] left-0 right-0 flex flex-col items-center transition-opacity duration-700 pointer-events-none z-30"
          style={{ opacity: 'calc(1 - (var(--scroll-progress) * 10))' } as any}
        >
          <div className="relative h-20 w-8 flex flex-col items-center justify-center">
            {[0, 1, 2, 3, 4].map((i) => (
              <svg 
                key={i} 
                className="absolute animate-arrow-flow" 
                style={{ animationDelay: `${i * 0.4}s` }} 
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

        <div ref={heroContentRef} className="w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 halftone-bg z-0 opacity-10 pointer-events-none" />
          <ExorcistsScroll />

          <div id="hero-content-fadeout" className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center md:items-start text-center md:text-left justify-center mt-12 md:mt-24 pointer-events-none">
            <div id="available-for-opps" className="cinematic-in inline-flex items-center gap-3 mb-8 px-5 py-2 border-l-4 border-[var(--accent-blood)] bg-white text-[var(--bg-ink)] brutal-shadow transform -rotate-1 transition-all duration-700" style={{ opacity: whoAmIMode ? 0.9 : 1, transform: whoAmIMode ? 'scale(1.1) rotate(0deg)' : 'rotate(-1deg)' }}>
              <span className={`uppercase tracking-[0.2em] text-[10px] sm:text-xs font-black ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
                {whoAmIMode ? "NO MAN CAN WALK OUT ON HIS OWN STORY" : (language === 'en' ? "Available for Opportunities" : language === 'ja' ? "仕事の依頼を受付中" : language === 'ko' ? "업무 의뢰 가능" : language === 'zh-tw' ? "開放合作機會" : language === 'fr' ? "Disponible pour des Opportunités" : language === 'id' ? "Tersedia untuk Peluang" : language === 'de' ? "Verfügbar für Möglichkeiten" : language === 'it' ? "Disponibile per Opportunità" : language === 'pt-br' ? "Disponível para Oportunidades" : (language === 'es-419' || language === 'es') ? "Disponible para Oportunidades" : "अवसरों के लिए उपलब्ध")}
              </span>
            </div>

            <div ref={titlesRef} className="relative mb-8 w-full cursor-none group/title">
              <h1 id="hero-title" className={`cinematic-in text-[13.3vw] sm:text-[7.1rem] md:text-[9.8rem] lg:text-[12.5rem] leading-[0.8] font-black uppercase text-[var(--text-bone)] select-none chromatic-aberration relative z-20 ${language === 'hi' ? 'font-hindi' : 'font-display'} transition-all duration-300 ${whoAmIMode ? 'blur-[2px] animate-pulse' : ''}`} style={{ letterSpacing: "-0.04em" }}>
                {whoAmIMode ? "RANGO" : currentProfile.name.split(" ")[0].split("").map((char, i) => (
                  <span key={i} className="inline-block transition-all duration-300 hover:skew-x-12 hover:text-[var(--accent-blood)] hover:scale-110">
                    {char}
                  </span>
                ))}
              </h1>
              <h1 className={`cinematic-in text-[13.3vw] sm:text-[7.1rem] md:text-[9.8rem] lg:text-[12.5rem] leading-[0.8] font-black uppercase tracking-[-0.04em] text-transparent select-none md:ml-[15%] text-stroke-bone relative z-20 ${language === 'hi' ? 'font-hindi' : 'font-display'} transition-all duration-300 ${whoAmIMode ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                 {!whoAmIMode && currentProfile.name.split(" ").slice(1).join(" ").split("").map((char, i) => (
                  <span key={i} className="inline-block transition-all duration-300 hover:-skew-x-12 hover:text-[var(--accent-blood)] hover:scale-110">
                    {char}
                  </span>
                ))}
              </h1>
            </div>

            <p className={`cinematic-in text-base md:text-xl text-[var(--text-muted)] max-w-xl font-mono leading-relaxed mb-12 mt-4 md:mt-4 transition-all duration-500 ${whoAmIMode ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              {currentProfile.tagline}
            </p>

            <div className={`cinematic-in flex flex-col sm:flex-row gap-6 md:gap-8 w-full sm:w-auto self-center md:self-start -mt-[35px] pointer-events-auto transition-all duration-500 ${whoAmIMode ? 'opacity-20 blur-sm pointer-events-none' : 'opacity-100'}`}>
              <a ref={cta1Ref} href="#projects" className="group relative flex items-center justify-center min-w-[200px] md:min-w-[240px] bg-transparent border border-[var(--text-bone)]/30 hover:border-[var(--accent-blood)] transition-colors duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-[var(--accent-blood)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-0" />
                <div className="relative z-10 flex items-center px-5 py-3 md:px-7 md:py-5">
                   <span className={`text-white font-black text-base md:text-xl tracking-[0.2em] uppercase transition-all duration-500 group-hover:tracking-[0.3em] ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
                    {language === 'en' ? "View Work" : language === 'ja' ? "実績を見る" : language === 'ko' ? "실적 보기" : language === 'zh-tw' ? "查看作品" : language === 'fr' ? "Voir les Projets" : language === 'id' ? "Lihat Karya" : language === 'de' ? "Arbeit ansehen" : language === 'it' ? "Vedi Lavori" : language === 'pt-br' ? "Ver Trabalhos" : (language === 'es-419' || language === 'es') ? "Ver Trabajos" : "कार्य देखें"}
                  </span>
                </div>
              </a>
              <a ref={cta2Ref} href="#contact" className="group relative flex items-center justify-center min-w-[200px] md:min-w-[240px] bg-transparent border border-[var(--text-bone)]/30 hover:border-[var(--text-bone)] transition-colors duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-500 z-0" />
                <div className="relative z-10 flex items-center px-5 py-3 md:px-7 md:py-5">
                   <span className={`text-[var(--text-bone)] group-hover:text-[var(--bg-ink)] font-black text-base md:text-xl tracking-[0.2em] uppercase transition-all duration-500 group-hover:tracking-[0.3em] ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
                    {language === 'en' ? "Contact" : language === 'ja' ? "連絡する" : language === 'ko' ? "연락하기" : language === 'zh-tw' ? "聯繫方式" : language === 'fr' ? "Contact" : language === 'id' ? "Hubungi" : language === 'de' ? "Kontakt" : language === 'it' ? "Contatto" : language === 'pt-br' ? "Contato" : (language === 'es-419' || language === 'es') ? "Contacto" : "संपर्क करें"}
                  </span>
                </div>
              </a>
            </div>
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
          0% { transform: translateY(-30px); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(30px); opacity: 0; }
        }
        .animate-arrow-flow {
          animation: arrow-flow 2s infinite linear;
        }
      `}</style>
    </section>
  );
}
