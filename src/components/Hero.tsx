import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { profile } from "@/data/profile";
import { useMagnetic } from "./AnimationKit";
import ExorcistsScroll from './ui/ExorcistsScroll';
import { SubliminalKanji } from "./ui/SubliminalKanji";
import { useLanguage } from "@/context/LanguageContext";

export function Hero() {
  const { language } = useLanguage();
  const currentProfile = profile[language];
  const containerRef = useRef<HTMLDivElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);
  const cta1Ref = useMagnetic<HTMLAnchorElement>(0.2);
  const cta2Ref = useMagnetic<HTMLAnchorElement>(0.2);
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

  const currentIntro = introStages[language as keyof typeof introStages];

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

  // To handle the delayed period for "missing.", we split it into separate units
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
                const isFind = cleanWord === 'find' || cleanWord === '見つけ' || cleanWord === '찾아내어' || cleanWord === '找出' || cleanWord === 'ढूंढता' || cleanWord === 'trouve' || cleanWord === 'menemukan';
                const isBroken = cleanWord === 'broken' || cleanWord === '壊れた' || cleanWord === '망가진' || cleanWord === '破碎' || cleanWord === 'टूटा' || cleanWord === 'brisé' || cleanWord === 'rusak';
                const isBuild = cleanWord === 'build' || cleanWord === '創る' || cleanWord === 'बनाता' || cleanWord === 'membangun';
                const isMissing = cleanWord === 'missing' || cleanWord === '足りない' || cleanWord === '부족한' || cleanWord === '缺失' || cleanWord === 'गायब' || cleanWord === 'manque' || cleanWord === 'hilang' || word === '.';
                
                const baseBlur = 12;
                const baseTravel = 25;
                
                const showSpecial = activeProgress >= 0.95;
                
                return (
                    <span 
                      key={i}
                      className="inline-block mr-[0.55em] mb-2"
                      style={{
                        opacity: activeProgress,
                        transform: `translateY(${(1 - activeProgress) * baseTravel}px)`,
                        filter: `blur(${(1 - activeProgress) * baseBlur}px)`,
                        willChange: 'opacity, transform, filter'
                      }}
                    >
                      <span 
                        className={`relative select-none transition-all duration-700
                          ${(isBroken || isBuild || isMissing) ? 
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
            <div className="relative h-20 w-8 flex flex-col items-center justify-center">
              {[0, 1, 2, 3, 4].map((i) => (
                <svg 
                  key={i} 
                  className="absolute animate-arrow-flow" 
                  style={{ animationDelay: `${i * 0.4}s` }}
                  width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 4L12 20M12 20L5 13M12 20L19 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"/>
                </svg>
              ))}
            </div>
          </div>

        <div style={heroRecedeStyle} className="w-full h-full flex items-center justify-center">
          {/* Halftone / Grain Texture Base */}
          <div className="absolute inset-0 halftone-bg z-0 opacity-10 pointer-events-none" />

          {/* Vertical Watermark */}
          <SubliminalKanji kanji={language === 'ja' || language === 'zh-tw' ? "起源" : language === 'ko' ? "기원" : language === 'hi' ? "मूल" : "ORIGIN"} position="right" />

          {/* ─── EXORCIST'S SCROLL (Narrative Background 06) ─── */}
          <ExorcistsScroll />

          <div id="hero-content-fadeout" className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center md:items-start text-center md:text-left justify-center mt-12 md:mt-24 pointer-events-none">
            <div className="cinematic-in inline-flex items-center gap-3 mb-8 px-5 py-2 border-l-4 border-[var(--accent-blood)] bg-white text-[var(--bg-ink)] brutal-shadow transform -rotate-1">
              <span className={`uppercase tracking-[0.2em] text-[10px] sm:text-xs font-black ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
                {language === 'en' ? "Available for Opportunities" : language === 'ja' ? "仕事の依頼を受付中" : language === 'ko' ? "업무 의뢰 가능" : language === 'zh-tw' ? "開放合作機會" : language === 'fr' ? "Disponible pour des Opportunités" : language === 'id' ? "Tersedia untuk Peluang" : "अवसरों के लिए उपलब्ध"}
              </span>
            </div>

            <div ref={titlesRef} className="relative mb-8 w-full">
              <h1 id="hero-title" className={`cinematic-in text-[13.3vw] sm:text-[7.1rem] md:text-[9.8rem] lg:text-[12.5rem] leading-[0.8] font-black uppercase text-[var(--text-bone)] select-none chromatic-aberration ${language === 'hi' ? 'font-hindi' : 'font-display'}`} style={{ letterSpacing: "-0.04em" }}>
                {currentProfile.name.split(" ")[0]}
              </h1>
              <h1 className={`cinematic-in text-[13.3vw] sm:text-[7.1rem] md:text-[9.8rem] lg:text-[12.5rem] leading-[0.8] font-black uppercase tracking-[-0.04em] text-transparent select-none md:ml-[15%] text-stroke-bone ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
                {currentProfile.name.split(" ").slice(1).join(" ")}
              </h1>
            </div>

            <p className="cinematic-in text-base md:text-xl text-[var(--text-muted)] max-w-xl font-mono leading-relaxed mb-12 mt-4 md:mt-4">
              {currentProfile.tagline}
            </p>

            <div className="cinematic-in flex flex-col sm:flex-row gap-6 md:gap-8 w-full sm:w-auto self-center md:self-start -mt-[35px] pointer-events-auto">
              <a ref={cta1Ref} href="#projects" className="group relative flex items-center justify-center min-w-[200px] md:min-w-[240px] bg-transparent border border-[var(--text-bone)]/30 hover:border-[var(--accent-blood)] transition-colors duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-[var(--accent-blood)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-0" />
                <div className="relative z-10 flex items-center px-5 py-3 md:px-7 md:py-5">
                   <span className={`text-white font-black text-base md:text-xl tracking-[0.2em] uppercase transition-all duration-500 group-hover:tracking-[0.3em] ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
                    {language === 'en' ? "View Work" : language === 'ja' ? "実績を見る" : language === 'ko' ? "실적 보기" : language === 'zh-tw' ? "查看作品" : language === 'fr' ? "Voir les Projets" : language === 'id' ? "Lihat Karya" : "कार्य देखें"}
                  </span>
                </div>
              </a>
              <a ref={cta2Ref} href="#contact" className="group relative flex items-center justify-center min-w-[200px] md:min-w-[240px] bg-transparent border border-[var(--text-bone)]/30 hover:border-[var(--text-bone)] transition-colors duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-0" />
                <div className="relative z-10 flex items-center px-5 py-3 md:px-7 md:py-5">
                   <span className={`text-[var(--text-bone)] group-hover:text-[var(--bg-ink)] font-black text-base md:text-xl tracking-[0.2em] uppercase transition-all duration-500 group-hover:tracking-[0.3em] ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
                    {language === 'en' ? "Contact" : language === 'ja' ? "連絡する" : language === 'ko' ? "연락하기" : language === 'zh-tw' ? "聯繫方式" : language === 'fr' ? "Contact" : language === 'id' ? "Hubungi" : "संपर्क करें"}
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
      `}</style>
    </section>
  );
}
