"use client";

import { useEffect, useRef, useState } from "react";
import { animate as anime, utils } from "animejs";
import { profile } from "@/data/profile";
import { TextReveal, useMagnetic } from "./AnimationKit";

const ROLES = [
  "SOFTWARE ENGINEER",
  "SYSTEM ARCHITECT",
  "FULL-STACK DEVELOPER",
  "CURSE USER (DEVELOPER)"
];

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const bloodSpatterRef = useRef<SVGSVGElement>(null);
  const cta1Ref = useMagnetic(0.3);
  const cta2Ref = useMagnetic(0.3);

  // Aggressive typewriter effect
  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    let timeout: NodeJS.Timeout;
    
    if (!isDeleting && displayText === currentRole) {
      timeout = setTimeout(() => setIsDeleting(true), 1500); // Fast pacing
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    } else {
      timeout = setTimeout(
        () => setDisplayText(isDeleting
          ? currentRole.slice(0, displayText.length - 1)
          : currentRole.slice(0, Math.max(0, displayText.length) + 1)
        ),
        isDeleting ? 20 : 50
      );
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  // Entrance & Interactive Parallax
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initial violent shatter entrance
    const elements = containerRef.current.querySelectorAll(".shatter-in");
    anime(elements as any, {
      opacity: [0, 1],
      scale: [1.2, 1],
      rotateZ: () => utils.random(-5, 5), // Slight off-axis manga text feel
      translateY: [100, 0],
      duration: 800,
      delay: utils.stagger(150, { start: 0 }),
      easing: "easeOutElastic(1, .8)",
    });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = (clientY / window.innerHeight - 0.5) * 2;

      // Move blood spatter slightly
      if (bloodSpatterRef.current) {
         anime(bloodSpatterRef.current, {
           translateX: x * -30,
           translateY: y * -30,
           duration: 500,
           easing: "outQuart"
         });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section 
      id="hero" 
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg-ink)] p-4 md:p-8"
      onClick={() => {
        // Trigger impact frame globally
        document.body.style.animation = "none";
        void document.body.offsetWidth; // trigger reflow
        document.body.style.animation = "impact-flash 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      }}
    >
      {/* Background Halftone Pattern */}
      <div className="absolute inset-0 halftone-bg z-0" />

      {/* SVG Ink/Blood Spatter Background */}
      <svg 
         ref={bloodSpatterRef} 
         className="absolute inset-0 w-full h-full object-cover z-0 opacity-10 pointer-events-none" 
         viewBox="0 0 100 100" 
         preserveAspectRatio="none"
      >
        {/* Raw, jagged shapes mimicking MAPPA ink hits */}
        <polygon points="0,0 30,0 20,40 0,60" fill="var(--accent-blood)" />
        <polygon points="100,100 60,100 80,40 100,20" fill="var(--text-bone)" />
        <polygon points="50,100 40,80 60,60" fill="var(--accent-blood)" />
        <circle cx="20" cy="80" r="1.5" fill="var(--accent-blood)" />
        <circle cx="25" cy="75" r="0.8" fill="var(--accent-blood)" />
        <circle cx="85" cy="15" r="1.2" fill="var(--text-bone)" />
      </svg>

      <div className="manga-panel p-6 md:p-12 z-10 w-full max-w-7xl relative manga-cut-br brutal-shadow flex flex-col items-start min-h-[70vh] justify-center">
        
        {/* Corner Decorator Label */}
        <div className="absolute top-0 right-0 bg-white text-black font-bold font-mono px-4 py-1 text-[10px] tracking-wider border-l-2 border-b-2 border-black z-20">
          VOL. 01 // AWAKENING
        </div>

        {/* Status Seal */}
        <div className="shatter-in inline-flex items-center gap-2 border-2 border-[var(--accent-blood)] px-3 py-1 mb-8 bg-[var(--bg-ink)] chromatic-aberration">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--accent-blood)">
            <path d="M12 2L22 20H2L12 2Z" />
          </svg>
          <span className="text-[10px] font-display font-bold text-[var(--accent-blood)] tracking-[0.3em] uppercase">
            Domain Expanded
          </span>
        </div>

        {/* Aggressive MAPPA Typography */}
        <div className="relative mb-6 z-10 flex flex-col -gap-4 cursor-default w-full">
           <div className="shatter-in text-[6rem] sm:text-[8rem] md:text-[12rem] lg:text-[15rem] leading-[0.7] font-black font-display uppercase tracking-[-0.05em] text-[var(--text-bone)] chromatic-hover select-none">
             HARSHAL
           </div>
           
           <div className="shatter-in relative text-[6rem] sm:text-[8rem] md:text-[12rem] lg:text-[15rem] leading-[0.7] font-black font-display uppercase tracking-[-0.05em] text-transparent select-none ml-0 md:ml-32 mt-4"
                style={{ WebkitTextStroke: "3px var(--text-bone)" }}
           >
             PATEL
             {/* Diagonal Blood Slash overlay over the text */}
             <div className="absolute top-1/2 left-[-10%] right-[-10%] h-[15px] bg-[var(--accent-blood)] -translate-y-1/2 -rotate-2 z-[-1]" />
           </div>
        </div>

        {/* Typewriter Terminal Block */}
        <div className="shatter-in mt-12 border-l-4 border-[var(--accent-cursed)] pl-6 py-2 mb-10 w-full max-w-2xl bg-[var(--bg-ink)]">
           <div className="text-[10px] font-mono text-[var(--text-muted)] tracking-widest uppercase mb-1">
             Current Target // Class
           </div>
           <div className="text-xl md:text-3xl font-display font-bold text-[var(--text-bone)] uppercase flex items-center h-8">
             {displayText}
             <div className="w-4 h-[80%] bg-[var(--accent-cursed)] ml-2 animate-pulse" />
           </div>
        </div>

        {/* Bio Tagline */}
        <p className="shatter-in text-sm md:text-lg text-[var(--text-muted)] max-w-2xl font-mono leading-relaxed uppercase mb-12">
          {profile.tagline}
        </p>

        {/* Brutalist Manga Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mt-auto w-full sm:w-auto">
          <a ref={cta1Ref as any} href="#projects"
            className="shatter-in magnetic-btn px-10 py-5 text-sm md:text-base text-center chromatic-hover"
          >
            Execute Archive
          </a>
          
          <a ref={cta2Ref as any} href="#contact"
             className="shatter-in magnetic-btn px-10 py-5 text-sm md:text-base text-center bg-[var(--accent-blood)] border-[var(--accent-blood)] text-[var(--bg-ink)]"
             style={{ 
                color: 'var(--bg-ink)', 
                '--text-bone': 'var(--bg-ink)' 
             } as React.CSSProperties} // Invert hover logic
          >
            Initiate Contact
          </a>
        </div>

      </div>
      
      {/* Click instruction */}
      <div className="absolute bottom-4 right-6 text-[10px] font-display font-bold text-[var(--text-muted)] tracking-[0.2em] pointer-events-none hidden md:block">
        [ CLICK TO IMPACT ]
      </div>
    </section>
  );
}
