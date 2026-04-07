import React, { useEffect, useRef, useMemo, memo } from "react";
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
  
  const cleanWord = word.toUpperCase().replace(/[.,/#!$%^&*;:{}=\-_`~()♩]/g,"");
  const isBroken = cleanWord === 'BROKEN' || cleanWord === '壊れた' || cleanWord === '망가진' || cleanWord === '破碎' || cleanWord === 'टूटा' || cleanWord === 'BRISÉ' || cleanWord === 'RUSAK' || cleanWord === 'BROKE-THING' || cleanWord === 'BROKETHING';
  const isBuild = cleanWord === 'BUILD' || cleanWord === '創る' || cleanWord === 'बनाता' || cleanWord === 'MEMBANGUN' || cleanWord === 'NEW-THING' || cleanWord === 'NEWTHING';
  const isMissing = cleanWord === 'MISSING' || cleanWord === '足りない' || cleanWord === '부족한' || cleanWord === '缺失' || cleanWord === 'गायब' || cleanWord === 'MANQUE' || cleanWord === 'HILANG' || word === '.';
  
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
            `text-[2.15rem] md:text-[4.89rem] lg:text-[6.84rem] ${language === 'hi' ? 'font-season' : 'font-cirka'} text-[var(--accent-blood)] drop-shadow-[0_0_10px_rgba(var(--accent-blood-rgb),0.3)]` : 
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
  const cta1Ref = useRef<HTMLAnchorElement>(null);
  const cta2Ref = useRef<HTMLAnchorElement>(null);
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
    "pt-br": ["Eu encontro o que está quebrado", "e eu construo o que falta."],
    "es-419": ["Encuentro lo que está roto", "y construyo lo que falta."],
    es: ["Encuentro lo que está roto", "y construyo lo que falta."],
    eridian: ["♩ FIND BROKE-THING.", "BUILD NEW-THING. AMAZE! ♩"]
  };

  const currentIntro = introStages[language as keyof typeof introStages] || introStages.en;
  const allWords = useMemo(() => currentIntro.join(" ").split(" "), [currentIntro]);

  // SCROLL ENGINE (NON-POLLING PASSIVE LISTENER)
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
      id="hero" 
      className="relative w-full h-[150vh] bg-black overflow-visible"
      style={{ "--scroll-progress": 0 } as React.CSSProperties}
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div 
          ref={heroContentRef}
          className="relative z-10 w-full px-6 md:px-12 flex flex-col items-center md:items-start will-change-transform"
        >
          <div className="max-w-[90vw] md:max-w-[70vw]">
            <div className="mb-6 md:mb-8">
              {allWords.map((word, i) => (
                <IntroWord key={`${language}-${i}`} word={word} i={i} totalWords={allWords.length} language={language} />
              ))}
            </div>

            <div className="flex flex-col mb-12">
               <h1 className={`cinematic-in text-[13.3vw] sm:text-[7.1rem] md:text-[9.8rem] lg:text-[12.5rem] leading-[0.8] font-black uppercase tracking-[-0.04em] text-[var(--text-bone)] select-none relative z-20 ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
                 {language === 'hi' ? (
                  <span className="inline-block transition-all duration-300">
                    {currentProfile.name.split(" ")[0]}
                  </span>
                 ) : (
                   currentProfile.name.split(" ")[0].split("").map((char, i) => (
                    <span key={i} className="inline-block transition-all duration-300">
                      {char}
                    </span>
                  ))
                 )}
               </h1>
               <h1 className={`cinematic-in text-[13.3vw] sm:text-[7.1rem] md:text-[9.8rem] lg:text-[12.5rem] leading-[0.8] font-black uppercase tracking-[-0.04em] text-transparent select-none md:ml-[15%] text-stroke-bone relative z-20 ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
                  {language === 'hi' ? (
                   <span className="inline-block transition-all duration-300">
                     {currentProfile.name.split(" ").slice(1).join(" ")}
                   </span>
                  ) : (
                    currentProfile.name.split(" ").slice(1).join(" ").split("").map((char, i) => (
                     <span key={i} className="inline-block transition-all duration-300">
                       {char}
                     </span>
                   ))
                  )}
               </h1>
            </div>

            <p className="cinematic-in text-base md:text-xl text-[var(--text-muted)] max-w-xl font-mono leading-relaxed mb-12 mt-4 md:mt-4">
              {currentProfile.tagline}
            </p>

            <div className="cinematic-in flex flex-col sm:flex-row gap-6 md:gap-8 w-full sm:w-auto self-center md:self-start -mt-[35px] pointer-events-auto">
              <a ref={cta1Ref} href="#projects" className="mobile-glow group relative flex items-center justify-center min-w-[200px] md:min-w-[240px] bg-transparent border border-[var(--text-bone)]/30 hover:border-[var(--accent-blood)] transition-colors duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-[var(--accent-blood)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-0" />
                <div className="relative z-10 flex items-center px-5 py-3 md:px-7 md:py-5">
                   <span className={`text-white font-black text-base md:text-xl tracking-[0.2em] uppercase transition-all duration-500 ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
                    {language === 'en' ? "View Work" : language === 'ja' ? "実績を見る" : language === 'ko' ? "실적 보기" : language === 'zh-tw' ? "查看作品" : language === 'fr' ? "Voir les Projets" : language === 'id' ? "Lihat Karya" : language === 'de' ? "Arbeit ansehen" : language === 'it' ? "Vedi Lavori" : language === 'pt-br' ? "Ver Trabalhos" : (language === 'es-419' || language === 'es') ? "Ver Trabajos" : language === 'eridian' ? "VIEW-WORKS" : "कार्य देखें"}
                  </span>
                </div>
              </a>
              <a ref={cta2Ref} href="#contact" className="mobile-glow group relative flex items-center justify-center min-w-[200px] md:min-w-[240px] bg-transparent border border-[var(--text-bone)]/30 hover:border-[var(--text-bone)] transition-colors duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-500 z-0" />
                <div className="relative z-10 flex items-center px-5 py-3 md:px-7 md:py-5">
                   <span className={`text-[var(--text-bone)] group-hover:text-[var(--bg-ink)] font-black text-base md:text-xl tracking-[0.2em] uppercase transition-all duration-500 ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
                    {language === 'en' ? "Contact" : language === 'ja' ? "連絡する" : language === 'ko' ? "연락하기" : language === 'zh-tw' ? "聯繫方式" : language === 'fr' ? "Contact" : language === 'id' ? "Hubungi" : language === 'de' ? "Kontakt" : language === 'it' ? "Contatto" : language === 'pt-br' ? "Contato" : (language === 'es-419' || language === 'es') ? "Contacto" : language === 'eridian' ? "SEND-SIGNAL" : "संपर्क करें"}
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

        /* 📱 MOBILE GLOW PULSE - TRIGGERING AWE FROM THE FIRST MOMENT */
        @media (max-width: 1024px) {
          .mobile-glow {
            animation: mobile-button-pulse 3s infinite;
            border-color: var(--accent-blood) !important;
          }
        }

        @keyframes mobile-button-pulse {
          0% { box-shadow: 0 0 0 0 rgba(var(--accent-blood-rgb), 0.4); }
          50% { box-shadow: 0 0 20px 2px rgba(var(--accent-blood-rgb), 0.7); }
          100% { box-shadow: 0 0 0 0 rgba(var(--accent-blood-rgb), 0.4); }
        }
      `}</style>
    </section>
  );
}
