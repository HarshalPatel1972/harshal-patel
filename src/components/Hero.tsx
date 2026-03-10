import { useEffect, useRef, useState } from "react";
import { animate, stagger, utils } from "animejs";
import { profile } from "@/data/profile";
import { useMagnetic } from "./AnimationKit";
import { SubliminalKanji } from "./ui/SubliminalKanji";
import { useLanguage } from "@/context/LanguageContext";

// Identity Data (Two-word roles for the ink slash curves)
const curvedIdentities = {
  en: [
    ["Front-End", "Developer"],
    ["Software", "Engineer"],
    ["Data", "Scientist"],
    ["Systems", "Architect"]
  ],
  ja: [
    ["フロントエンド", "開発者"],
    ["ソフトウェア", "エンジニア"],
    ["データ", "サイエンティスト"],
    ["システム", "設計者"]
  ]
};

export function Hero() {
  const { language } = useLanguage();
  const currentProfile = profile[language];
  const containerRef = useRef<HTMLDivElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);
  const cta1Ref = useMagnetic(0.2);
  const cta2Ref = useMagnetic(0.2);
  
  const [roleIndex, setRoleIndex] = useState(0);

  // Word-based lightning strike (Strike In -> Hard Stop -> Strike Out)
  useEffect(() => {
    const topPath = containerRef.current?.querySelector(".char-top");
    const bottomPath = containerRef.current?.querySelector(".char-bottom");

    if (!topPath || !bottomPath) return;

    // Total Timing: 300ms (In) + 3000ms (Hold) + 300ms (Out) = 3600ms
    const entranceSpeed = 300;
    const holdTime = 3000;
    const exitSpeed = 300;

    // Reset paths IMMEDIATELY before starting new sequence
    topPath.setAttribute("startOffset", "0%");
    topPath.setAttribute("opacity", "0");
    bottomPath.setAttribute("startOffset", "100%");
    bottomPath.setAttribute("opacity", "0");

    // TOP WORD SEQUENCE
    animate(topPath, { 
      startOffset: "42%", 
      opacity: 1, 
      duration: entranceSpeed, 
      easing: "easeOutExpo" 
    }).then(() => animate(topPath, { 
      startOffset: "42%", // ABSOLUTE STOP
      duration: holdTime, 
      easing: "linear" 
    })).then(() => animate(topPath, { 
      startOffset: "110%", 
      opacity: 0, 
      duration: exitSpeed, 
      easing: "easeInExpo" 
    }));

    // BOTTOM WORD SEQUENCE
    animate(bottomPath, { 
      startOffset: "43%", 
      opacity: 1, 
      duration: entranceSpeed, 
      easing: "easeOutExpo" 
    }).then(() => animate(bottomPath, { 
      startOffset: "43%", // ABSOLUTE STOP
      duration: holdTime, 
      easing: "linear" 
    })).then(() => animate(bottomPath, { 
      startOffset: "-10%", 
      opacity: 0, 
      duration: exitSpeed, 
      easing: "easeInExpo" 
    }));

  }, [roleIndex]);

  // Cycle roles every 3.6 seconds (Matching 300 + 3000 + 300 exactly)
  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % curvedIdentities.en.length);
    }, 3600);
    return () => clearInterval(timer);
  }, []);

  // Cinematic opening animations (MAPPA Style: slow continuous drift + sharp impacts)
  useEffect(() => {
    if (!containerRef.current) return; // Ensure containerRef.current is available for inkSlash

    if (titlesRef.current) {
      animate(titlesRef.current, {
        translateX: [-100, 0],
        opacity: [0, 1],
        duration: 1200,
        easing: "easeOutQuart"
      });
    }

    const inkSlash = containerRef.current.querySelector(".ink-slash");
    if (inkSlash) {
      animate(inkSlash, {
        scale: [0.8, 1.1],
        opacity: [0, 1],
        duration: 3000,
        easing: "easeOutSine",
      });
    }

    // Continuous ultra-slow parallax drift for the main title (Natural Breathing)
    if (titlesRef.current) {
      animate(titlesRef.current, {
        scale: [1, 1.05],
        duration: 12000,
        alternate: true,
        loop: true,
        easing: "linear"
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

      {/* ─── MAPPA INK-PATH ROLES (Text following the curves) ─── */}
      <div className="ink-slash absolute left-[-10%] sm:left-[5%] top-[10%] w-[120%] sm:w-[90%] h-[70%] z-0 pointer-events-none opacity-0 select-none flex items-center justify-center">
         <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full drop-shadow-2xl">
            {/* DEFINE THE HIDDEN PATHS (Restored to Original Wide Curves) */}
            <defs>
              <path id="curve-top" d="M10,80 Q30,50 60,60 T90,20" fill="transparent" />
              <path id="curve-bottom" d="M5,90 Q40,40 70,70 T95,10" fill="transparent" />
            </defs>

            {/* VISUAL RED SLASHES - Restored as requested */}
            <path d="M10,80 Q30,50 60,60 T90,20 Q80,10 50,40 T10,80 Z" fill="var(--accent-blood)" opacity="0.15" />
            <path d="M5,90 Q40,40 70,70 T95,10 Q70,30 30,80 T5,90 Z" fill="var(--accent-blood)" opacity="0.1" />

            {/* CURVED TEXT ON TOP PATH (Glide-In: Left to Right) - Brutalist Bold */}
            <text className="font-display uppercase text-[8px] tracking-[0.1em] font-black fill-[var(--text-bone)] opacity-95 drop-shadow-md">
              <textPath 
                href="#curve-top" 
                className="char-top"
                startOffset="0%"
              >
                {curvedIdentities[language as 'en' | 'ja'][roleIndex][0]}
              </textPath>
            </text>

            {/* CURVED TEXT ON BOTTOM PATH (Glide-In: Right to Left) - Matching Bold */}
            <text className="font-display uppercase text-[7px] tracking-[0.15em] font-black fill-[var(--text-bone)] opacity-80">
              <textPath 
                href="#curve-bottom" 
                className="char-bottom"
                startOffset="100%"
              >
                {curvedIdentities[language as 'en' | 'ja'][roleIndex][1]}
              </textPath>
            </text>
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
