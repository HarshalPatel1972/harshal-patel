import { useEffect, useRef, useState } from "react";
import { animate as anime, utils } from "animejs";
import { profile } from "@/data/profile";
import { useMagnetic } from "./AnimationKit";
import { SubliminalKanji } from "./ui/SubliminalKanji";
import { useLanguage } from "@/context/LanguageContext";

function DraggableImage({ src }: { src: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [width, setWidth] = useState(450);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const offset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, w: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    // If we click the resize handle, engage resize mode instead
    if ((e.target as HTMLElement).classList.contains('resize-handle')) {
      e.stopPropagation();
      setIsResizing(true);
      resizeStart.current = { x: e.clientX, w: width };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      return;
    }
    
    setIsDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isResizing) {
      const newWidth = Math.max(100, Math.min(2000, resizeStart.current.w + (e.clientX - resizeStart.current.x)));
      setWidth(newWidth);
      return;
    }
    if (!isDragging) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isResizing) {
      setIsResizing(false);
    } else {
      setIsDragging(false);
    }
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div 
      className={`absolute z-[100] ${isDragging ? 'cursor-grabbing opacity-80 scale-105' : 'cursor-grab'} transition-all duration-75`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        touchAction: 'none',
        left: '10%', 
        top: '10%'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="relative inline-block select-none">
        <img
          src={src}
          alt="Draggable placement test"
          style={{ width: `${width}px` }}
          className="shadow-2xl drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] brutal-shadow pointer-events-none"
          draggable="false"
        />
        
        {/* Resize Handle (Red Box in Corner) */}
        <div 
          className="resize-handle absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize bg-[var(--accent-blood)] border-2 border-black flex items-center justify-center translate-x-[30%] translate-y-[30%] brutal-shadow z-10"
        >
          <span className="resize-handle pointer-events-none block w-3 h-3 bg-white" />
        </div>
      </div>
      
      {/* Small UI helper tag */}
      <div className="absolute -bottom-10 left-0 right-0 text-center font-mono text-[10px] text-[var(--text-bone)]/50 tracking-widest uppercase pointer-events-none">
         Drag To Move • Pull Box To Size • {Math.round(width)}px
      </div>
    </div>
  );
}

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
      {/* ─── DRAGGABLE COMPONENT FOR PLACEMENT TESTING ─── */}
      <DraggableImage src="/Lying Down.png" />

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

      {/* ─── 3D BACKGROUND LAYER (The Far Wall) ─── */}
      <div className="absolute inset-0 pointer-events-none z-[1] [perspective:1000px] flex items-center justify-center overflow-hidden">
        <div 
           className="w-full max-w-6xl text-center opacity-30 select-none"
           style={{ transform: "translateZ(-200px) translateY(calc(-5% + 100px)) rotateX(5deg)" }}
        >
           <h2 className="font-serif italic text-4xl sm:text-6xl md:text-8xl text-[var(--text-bone)] tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
             {language === 'en' ? "Software Engineer" : "ソフトウェアエンジニア"}
           </h2>
        </div>
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
