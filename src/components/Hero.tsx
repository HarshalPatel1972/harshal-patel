import { useEffect, useRef, useState } from "react";
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
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const introStages = {
    en: [
      "Building systems that grow with your business.",
      "Focusing on speed, reliability, and modern architecture.",
      "Solving difficult technical problems with clean, efficient code.",
      "Delivering software that powers high-performance experiences.",
      "Harshal Patel // Software Engineer"
    ],
    ja: [
      "ビジネスと共に成長するシステムを構築します。",
      "速度、信頼性、そしてモダンなアーキテクチャに重点を置いています。",
      "クリーンで効率的なコードで、困難な技術的課題を解決します。",
      "ハイパフォーマンスな体験を支えるソフトウェアを提供します。",
      "ハルシャル・パテル // ソフトウェアエンジニア"
    ]
  };

  const currentIntro = introStages[language as 'en' | 'ja'];
  
  // Split the intro into individual words for the word-by-word reveal
  const words = currentIntro.join(" ").split(" ");

  // ─── SCROLL TRACKER ENGINE ───
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
    transform: `scale(${1 - scrollProgress * 0.4}) translateY(${scrollProgress * -100}px)`,
    filter: `blur(${scrollProgress * 20}px)`,
    opacity: 1 - scrollProgress * 2.5,
    pointerEvents: (scrollProgress > 0.4 ? 'none' : 'auto') as any,
    willChange: 'transform, filter, opacity'
  };

  return (
    <section ref={trackRef} className="h-[400vh] relative bg-[var(--bg-ink)]">
      <div 
        id="hero" 
        ref={containerRef} 
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-4 md:px-6"
      >
        {/* Cinematic HUD Lines */}
        <div className="absolute inset-x-24 inset-y-0 pointer-events-none opacity-5 flex justify-between z-0">
          <div className="w-[1px] h-full bg-[var(--text-bone)]" />
          <div className="w-[1px] h-full bg-[var(--text-bone)]" />
          <div className="w-[1px] h-full bg-[var(--text-bone)]" />
        </div>

        {/* ─── THE VOID INTRO REVEAL (Materializes on Scroll Word-by-Word) ─── */}
        <div className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center px-8 md:px-32">
          {/* Main Professional Statement Paragraph */}
          <div className="max-w-5xl text-center md:text-left flex flex-wrap justify-center md:justify-start gap-x-[0.3em] gap-y-2 mb-12">
            {currentIntro.slice(0, 4).join(" ").split(" ").map((word, i) => {
              const start = 0.05 + (i / 40) * 0.6; // Scale based on ~40 words total
              const end = start + 0.08;
              const activeProgress = Math.max(0, Math.min(1, (scrollProgress - start) / (end - start)));
              
              return (
                <span 
                  key={i}
                  className="inline-block"
                  style={{
                    opacity: activeProgress,
                    transform: `translateY(${(1 - activeProgress) * 20}px)`,
                    filter: `blur(${(1 - activeProgress) * 10}px)`,
                    willChange: 'opacity, transform, filter'
                  }}
                >
                  <span className="text-xl md:text-3xl lg:text-4xl font-black font-display uppercase tracking-tight leading-tight text-[var(--text-bone)]">
                    {word}
                  </span>
                </span>
              );
            })}
          </div>

          {/* Harshal Patel // Software Engineer Grande Finale Line */}
          <div className="w-full max-w-5xl flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-4 md:gap-8">
            {currentIntro[4].split(" ").map((word, i) => {
              const start = 0.75 + (i * 0.04);
              const end = start + 0.1;
              const activeProgress = Math.max(0, Math.min(1, (scrollProgress - start) / (end - start)));
              const isName = word === "Harshal" || word === "Patel";
              
              return (
                <div 
                  key={i}
                  className="inline-block overflow-hidden"
                  style={{
                    opacity: activeProgress,
                    transform: `translateY(${(1 - activeProgress) * 40}px) skewX(${(1 - activeProgress) * -10}deg)`,
                    filter: `blur(${(1 - activeProgress) * 15}px)`,
                    willChange: 'opacity, transform, filter'
                  }}
                >
                  <span className={`text-4xl md:text-6xl lg:text-8xl font-black font-display uppercase tracking-tighter leading-none ${isName ? 'text-[var(--accent-blood)]' : 'text-[var(--text-bone)]/40 text-xl md:text-3xl'}`}>
                    {word}
                  </span>
                  {isName && i === 1 && (
                    <div className="h-2 bg-[var(--accent-blood)] mt-2 w-full origin-left transform scale-x-100" style={{ transition: 'none', transform: `scaleX(${activeProgress})` }} />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* SCROLL INDICATOR */}
          <div 
            className="absolute bottom-12 left-0 right-0 flex flex-col items-center transition-opacity duration-700"
            style={{ opacity: scrollProgress > 0.05 ? 0 : 0.8 }}
          >
            <div className="text-[10px] font-mono tracking-[0.5em] text-[var(--text-bone)] mb-4 uppercase">Scroll to Decipher</div>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--text-bone)] to-transparent" />
          </div>
        </div>

        <div style={heroRecedeStyle} className="w-full h-full flex items-center justify-center">
          {/* Halftone / Grain Texture Base */}
          <div className="absolute inset-0 halftone-bg z-0 opacity-10 pointer-events-none" />

          {/* Vertical Kanji Watermark */}
          <SubliminalKanji kanji="起源" position="right" />

          {/* ─── MAPPA INK-SLASH (Visual Element Only) ─── */}
          <div className="ink-slash absolute left-[-10%] sm:left-[5%] top-[10%] w-[120%] sm:w-[90%] h-[70%] z-0 pointer-events-none opacity-100 select-none flex items-center justify-center">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full drop-shadow-2xl opacity-20">
                <path d="M10,80 Q30,50 60,60 T90,20 Q80,10 50,40 T10,80 Z" fill="var(--accent-blood)" opacity="0.3" />
                <path d="M5,90 Q40,40 70,70 T95,10 Q70,30 30,80 T5,90 Z" fill="var(--accent-blood)" opacity="0.2" />
              </svg>
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center md:items-start text-center md:text-left justify-center mt-12 md:mt-24">
            <div className="cinematic-in inline-flex items-center gap-3 mb-8 px-5 py-2 border-l-4 border-[var(--accent-blood)] bg-[var(--text-bone)] text-[var(--bg-ink)] brutal-shadow transform -rotate-1">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-blood)] animate-pulse" />
              <span className="uppercase tracking-[0.2em] text-[10px] sm:text-xs font-black font-display">
                {language === 'en' ? "Available for Opportunities" : "仕事の依頼を受付中"}
              </span>
            </div>

            <div ref={titlesRef} className="relative mb-8 w-full">
              <h1 className="cinematic-in text-[15vw] sm:text-[8rem] md:text-[11rem] lg:text-[14rem] leading-[0.8] font-black font-display uppercase text-[var(--text-bone)] select-none chromatic-aberration" style={{ letterSpacing: "-0.04em" }}>
                {currentProfile.name.split(" ")[0]}
              </h1>
              <h1 className="cinematic-in text-[15vw] sm:text-[8rem] md:text-[11rem] lg:text-[14rem] leading-[0.8] font-black font-display uppercase tracking-[-0.04em] text-transparent select-none md:ml-[15%] text-stroke-bone">
                {currentProfile.name.split(" ").slice(1).join(" ")}
              </h1>
            </div>

            <p className="cinematic-in text-base md:text-xl text-[var(--text-muted)] max-w-xl font-mono leading-relaxed mb-12 mt-4 md:mt-4">
              {currentProfile.tagline}
            </p>

            <div className="cinematic-in flex flex-col sm:flex-row gap-6 md:gap-8 w-full sm:w-auto self-center md:self-start mt-2">
              <a ref={cta1Ref as any} href="#projects" className="group relative flex items-center justify-between min-w-[260px] md:min-w-[320px] bg-transparent border border-[var(--text-bone)]/30 hover:border-[var(--accent-blood)] transition-colors duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-[var(--accent-blood)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-0" />
                <div className="relative z-10 flex items-center px-6 py-4 md:px-8 md:py-6 w-full">
                  <span className="text-white font-black font-display text-lg md:text-2xl tracking-[0.2em] uppercase transition-all duration-500 group-hover:tracking-[0.3em]">
                    {language === 'en' ? "View Work" : "実績を見る"}
                  </span>
                  <span className="ml-auto text-[10px] md:text-xs font-mono tracking-widest text-[var(--text-bone)]/50 group-hover:text-white transition-colors duration-500">[01]</span>
                </div>
              </a>
              <a ref={cta2Ref as any} href="#contact" className="group relative flex items-center justify-between min-w-[260px] md:min-w-[320px] bg-transparent border border-[var(--text-bone)]/30 hover:border-[var(--text-bone)] transition-colors duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-[var(--text-bone)] scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-0" />
                <div className="relative z-10 flex items-center px-6 py-4 md:px-8 md:py-6 w-full">
                  <span className="text-[var(--text-bone)] group-hover:text-[var(--bg-ink)] font-black font-display text-lg md:text-2xl tracking-[0.2em] uppercase transition-all duration-500 group-hover:tracking-[0.3em]">
                    {language === 'en' ? "Contact" : "連絡する"}
                  </span>
                  <span className="ml-auto text-[10px] md:text-xs font-mono tracking-widest text-[var(--accent-blood)] group-hover:text-[var(--bg-ink)] transition-colors duration-500">[02]</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="absolute top-8 left-8 right-8 h-[1px] bg-[var(--text-bone)] opacity-10 pointer-events-none hidden md:block" />
        <div className="absolute bottom-8 left-8 right-8 h-[1px] bg-[var(--text-bone)] opacity-10 pointer-events-none hidden md:block" />
      </div>
    </section>
  );
}
