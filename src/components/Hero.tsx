import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { useMagnetic } from "./AnimationKit";
import { ScrollReveal } from './ScrollReveal';
import ExorcistsScroll from './ui/ExorcistsScroll';
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
      "Searching for speed? Facing scale's need?",
      "A fresh eye for the win? You’ve reached the source. Let the building begin."
    ],
    ja: [
      "速さを求めるか？ 規模に挑むか？",
      "勝利への新たな眼差し。 ならば、ここが構築の『起源』だ。"
    ],
    ko: [
      "속도를 찾고 계신가요? 규모의 필요성에 직面해 계신가요?",
      "승리를 위한 새로운 시각? 당신은 그 기원에 도달했습니다. 이제 구축을 시작합시다。"
    ],
    "zh-tw": [
      "正在追求速度？需要擴展規模？",
      "為勝利尋找新眼光？你已到達起源。現在，開始構築吧。"
    ],
    hi: [
      "गति की तलाश है? स्केल की ज़रूरत है?",
      "जीत के लिए एक नई नज़र? आप स्रोत तक पहुँच गए हैं। निर्माण शुरू करें।"
    ]
  };

  const currentIntro = introStages[language as keyof typeof introStages];
  
  // Split the intro into individual words for the word-by-word reveal
  const words = currentIntro.join(" ").split(" ");

  // ─── SCROLL TRACKER ENGINE ───
  useEffect(() => {
    let ticking = false;
    let rafId: number;

    const handleScroll = () => {
      // ⚡ Bolt Optimization: Batch DOM reads (offsetTop, offsetHeight) and state updates
      // inside requestAnimationFrame using a ticking flag.
      // Impact: Eliminates layout thrashing and limits React re-renders on high-frequency
      // scroll events to maximum 60fps, significantly improving scroll performance.
      if (!ticking) {
        rafId = window.requestAnimationFrame(() => {
          if (!trackRef.current) {
            ticking = false;
            return;
          }
          const st = window.scrollY;
          const sectionOffset = trackRef.current.offsetTop;
          const trackHeight = trackRef.current.offsetHeight - window.innerHeight;

          const progress = Math.max(0, Math.min(1, (st - sectionOffset) / trackHeight));
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
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

        <div className="absolute inset-x-4 md:inset-x-24 inset-y-0 z-50 pointer-events-none flex items-center justify-center">
          
          <div className="relative w-full max-w-7xl flex items-start gap-6 md:gap-12">

            <div className="text-justify leading-[0.95] md:leading-[1.05]">
              {allWords.map((word, i) => {
                const start = (i / allWords.length) * 0.8;
                const end = start + 0.2;
                const activeProgress = Math.max(0, Math.min(1, (scrollProgress - start) / (end - start)));
                
                // Narrative Semantic Styling for Rhyme Version
                const isSpecial = word.toLowerCase().includes('speed') || word.toLowerCase().includes('scale') || 
                                  word.toLowerCase().includes('win') || word.toLowerCase().includes('source') || 
                                  word.toLowerCase().includes('begin') ||
                                  word.includes('速さ') || word.includes('規模') || word.includes('勝利') || 
                                  word.includes('起源') || word.includes('構築') ||
                                  word.includes('속도') || word.includes('규모') || word.includes('승리') || 
                                  word.includes('기원') || word.includes('구축') ||
                                  word.includes('速度') || word.includes('規模') || word.includes('勝利') || 
                                  word.includes('起源') || word.includes('構築') ||
                                  word.includes('गति') || word.includes('स्केल') || word.includes('जीत') ||
                                  word.includes('स्रोत') || word.includes('निर्माण');
                
                return (
                  <span 
                    key={i}
                    className="inline-block mr-[0.22em] mb-2"
                    style={{
                      opacity: activeProgress,
                      transform: `translateY(${(1 - activeProgress) * 25}px)`,
                      filter: `blur(${(1 - activeProgress) * 12}px)`,
                      willChange: 'opacity, transform, filter'
                    }}
                  >
                    <span 
                      className={`text-[1.38rem] md:text-[2.76rem] lg:text-[4.14rem] uppercase tracking-tighter select-none transition-all duration-700
                        ${isSpecial ? 
                          `${language === 'hi' ? 'font-hindi' : 'font-serif'} italic font-normal capitalize text-[var(--accent-blood)] drop-shadow-[0_0_10px_rgba(217,17,17,0.3)]` : 
                          `${language === 'hi' ? 'font-hindi' : 'font-display'} font-medium text-[var(--text-bone)]`}`}
                    >
                      {word}
                    </span>
                    {/* Poetic Line breaks */}
                    {((language === 'en' && i === 5) || 
                      (language === 'ja' && i === 1)) && <br className="hidden md:block" />}
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

          {/* Vertical Kanji Watermark */}
          <SubliminalKanji kanji="起源" position="right" />

          {/* ─── EXORCIST'S SCROLL (Narrative Background 06) ─── */}
          <ExorcistsScroll />

          <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center md:items-start text-center md:text-left justify-center mt-12 md:mt-24 pointer-events-none">
            <div className="cinematic-in inline-flex items-center gap-3 mb-8 px-5 py-2 border-l-4 border-[var(--accent-blood)] bg-white text-[var(--bg-ink)] brutal-shadow transform -rotate-1">
              <span className={`uppercase tracking-[0.2em] text-[10px] sm:text-xs font-black ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
                {language === 'en' ? "Available for Opportunities" : language === 'ja' ? "仕事の依頼を受付中" : language === 'ko' ? "업무 의뢰 가능" : language === 'zh-tw' ? "開放合作機會" : "अवसरों के लिए उपलब्ध"}
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
              <a ref={cta1Ref as any} href="#projects" className="group relative flex items-center justify-center min-w-[200px] md:min-w-[240px] bg-transparent border border-[var(--text-bone)]/30 hover:border-[var(--accent-blood)] transition-colors duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-[var(--accent-blood)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-0" />
                <div className="relative z-10 flex items-center px-5 py-3 md:px-7 md:py-5">
                  <span className={`text-white font-black text-base md:text-xl tracking-[0.2em] uppercase transition-all duration-500 group-hover:tracking-[0.3em] ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
                    {language === 'en' ? "View Work" : language === 'ja' ? "実績を見る" : language === 'ko' ? "실적 보기" : language === 'zh-tw' ? "查看作品" : "कार्य देखें"}
                  </span>
                </div>
              </a>
              <a ref={cta2Ref as any} href="#contact" className="group relative flex items-center justify-center min-w-[200px] md:min-w-[240px] bg-transparent border border-[var(--text-bone)]/30 hover:border-[var(--text-bone)] transition-colors duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-0" />
                <div className="relative z-10 flex items-center px-5 py-3 md:px-7 md:py-5">
                  <span className={`text-[var(--text-bone)] group-hover:text-[var(--bg-ink)] font-black text-base md:text-xl tracking-[0.2em] uppercase transition-all duration-500 group-hover:tracking-[0.3em] ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
                    {language === 'en' ? "Contact" : language === 'ja' ? "連絡する" : language === 'ko' ? "연락하기" : language === 'zh-tw' ? "聯繫方式" : "संपर्क करें"}
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
