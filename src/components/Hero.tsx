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
      "Searching for speed?",
      "Facing scale's need?",
      "A fresh eye for the win?",
      "You’ve reached the source. Let the building begin."
    ],
    ja: [
      "速さを求めるか？",
      "規模に挑むか？",
      "勝利への新たな眼差し。",
      "ならば、ここが構築の『起源』だ。"
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
    transform: `scale(${1 - scrollProgress * 0.5}) translateY(${scrollProgress * -150}px)`,
    filter: `blur(${scrollProgress * 25}px)`,
    opacity: 1 - scrollProgress * 3.5, // Fade branding out faster to make the void "deep"
    pointerEvents: (scrollProgress > 0.4 ? 'none' : 'auto') as any,
    willChange: 'transform, filter, opacity'
  };

  const allWords = currentIntro.join(" ").split(" ");

  return (
    <section ref={trackRef} className="h-[250vh] relative bg-[var(--bg-ink)]">
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
          {/* Main Professional Statement Paragraph - Bigger and Centered */}
          <div className="max-w-7xl text-justify">
            {allWords.map((word, i) => {
              // Thresholds mapped so that the last word is fully revealed at scrollProgress = 1.0
              const start = (i / allWords.length) * 0.8;
              const end = start + 0.2;
              const activeProgress = Math.max(0, Math.min(1, (scrollProgress - start) / (end - start)));
              
              return (
                <span 
                  key={i}
                  className="inline-block mr-[0.3em] mb-2"
                  style={{
                    opacity: activeProgress,
                    transform: `translateY(${(1 - activeProgress) * 20}px)`,
                    filter: `blur(${(1 - activeProgress) * 10}px)`,
                    willChange: 'opacity, transform, filter'
                  }}
                >
                  <span 
                    className={`text-3xl md:text-5xl lg:text-7xl font-black font-display uppercase tracking-tighter leading-none select-none transition-all duration-500
                      ${(() => {
                        const w = word.toLowerCase().replace(/[?.,!]/g, '');
                        // Cursed Teal Segment (Speed / Perception / Source)
                        if (w.includes('speed') || w.includes('速さ') || w.includes('eye') || w.includes('眼差し') || w.includes('source') || w.includes('起源')) {
                          return 'text-[var(--accent-cursed)] drop-shadow-[0_0_15px_rgba(14,224,195,0.4)]';
                        }
                        // Blood Red Segment (Scale / Outcomes / Action)
                        if (w.includes('scale') || w.includes('規模') || w.includes('win') || w.includes('勝利') || w.includes('building') || w.includes('構築') || w.includes('begin')) {
                          return 'text-[var(--accent-blood)] drop-shadow-[0_0_15px_rgba(217,17,17,0.4)]';
                        }
                        // Bone White (Narrative connecting tissue)
                        return 'text-[var(--text-bone)]';
                      })()}`}
                    style={{ 
                      textShadow: activeProgress > 0.8 ? '0 0 20px rgba(255,255,255,0.05)' : 'none'
                    }}
                  >
                    {word}
                  </span>
                  {/* Force line break after "need?" (EN index 5) or "挑むか？" (JA index 1) */}
                  {((language === 'en' && i === 5) || (language === 'ja' && i === 1)) && <br className="hidden md:block" />}
                </span>
              );
            })}
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
        </div>

        <div style={heroRecedeStyle} className="w-full h-full flex items-center justify-center">
          {/* Halftone / Grain Texture Base */}
          <div className="absolute inset-0 halftone-bg z-0 opacity-10 pointer-events-none" />

          {/* Vertical Kanji Watermark */}
          <SubliminalKanji kanji="起源" position="right" />

          {/* ─── MAPPA INK-SLASH (Visual Element Only) ─── */}
          <div className="ink-slash absolute left-[-10%] sm:left-[5%] top-[10%] w-[120%] sm:w-[90%] h-[70%] z-0 pointer-events-none opacity-100 select-none flex items-center justify-center">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full drop-shadow-2xl opacity-100">
                <path d="M10,80 Q30,50 60,60 T90,20 Q80,10 50,40 T10,80 Z" fill="var(--accent-blood)" opacity="0.6" />
                <path d="M5,90 Q40,40 70,70 T95,10 Q70,30 30,80 T5,90 Z" fill="var(--accent-blood)" opacity="0.5" />
              </svg>
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center md:items-start text-center md:text-left justify-center mt-12 md:mt-24">
            <div className="cinematic-in inline-flex items-center gap-3 mb-8 px-5 py-2 border-l-4 border-[var(--accent-blood)] bg-white text-[var(--bg-ink)] brutal-shadow transform -rotate-1">
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

            <div className="cinematic-in flex flex-col sm:flex-row gap-6 md:gap-8 w-full sm:w-auto self-center md:self-start -mt-[35px]">
              <a ref={cta1Ref as any} href="#projects" className="group relative flex items-center justify-center min-w-[200px] md:min-w-[240px] bg-transparent border border-[var(--text-bone)]/30 hover:border-[var(--accent-blood)] transition-colors duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-[var(--accent-blood)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-0" />
                <div className="relative z-10 flex items-center px-5 py-3 md:px-7 md:py-5">
                  <span className="text-white font-black font-display text-base md:text-xl tracking-[0.2em] uppercase transition-all duration-500 group-hover:tracking-[0.3em]">
                    {language === 'en' ? "View Work" : "実績を見る"}
                  </span>
                </div>
              </a>
              <a ref={cta2Ref as any} href="#contact" className="group relative flex items-center justify-center min-w-[200px] md:min-w-[240px] bg-transparent border border-[var(--text-bone)]/30 hover:border-[var(--text-bone)] transition-colors duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-0" />
                <div className="relative z-10 flex items-center px-5 py-3 md:px-7 md:py-5">
                  <span className="text-[var(--text-bone)] group-hover:text-[var(--bg-ink)] font-black font-display text-base md:text-xl tracking-[0.2em] uppercase transition-all duration-500 group-hover:tracking-[0.3em]">
                    {language === 'en' ? "Contact" : "連絡する"}
                  </span>
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
