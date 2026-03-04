"use client";

import { useEffect, useRef, useState } from "react";
import { animate as anime, utils } from "animejs";
import { profile } from "@/data/profile";
import { TextReveal, useMagnetic } from "./AnimationKit";

const ROLES = [
  "SOFTWARE ENGINEER",
  "SYSTEMS ARCHITECT",
  "FULL-STACK DEVELOPER",
  "INNOVATION SPECIALIST",
];

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cursorFlareRef = useRef<HTMLDivElement>(null);
  const cta1Ref = useMagnetic(0.3);
  const cta2Ref = useMagnetic(0.3);

  // Typewriter effect for roles
  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    let timeout: NodeJS.Timeout;
    
    if (!isDeleting && displayText === currentRole) {
      timeout = setTimeout(() => setIsDeleting(true), 3000);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    } else {
      timeout = setTimeout(
        () => setDisplayText(isDeleting
          ? currentRole.slice(0, displayText.length - 1)
          : currentRole.slice(0, Math.max(0, displayText.length) + 1)
        ),
        isDeleting ? 30 : 70
      );
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  // Mouse Tracking & 3D Tilt Parallax on the entire container
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (clientY / window.innerHeight - 0.5) * 2; // -1 to 1

      // Move cursor flare (lantern)
      if (cursorFlareRef.current) {
        anime(cursorFlareRef.current, {
          translateX: clientX,
          translateY: clientY,
          duration: 1000,
          easing: "outExpo"
        });
      }

      // Parallax Grid
      if (gridRef.current) {
        anime(gridRef.current, {
          rotateX: -y * 15 + 45, // Tilt the grid back
          rotateY: x * 10,
          rotateZ: x * 5,
          duration: 1000,
          easing: "outQuart"
        });
      }
      
      // Floating spheres / decorators
      const decorators = containerRef.current.querySelectorAll(".float-el");
      decorators.forEach((el, index) => {
        const factor = (index + 1) * 20;
        anime(el as HTMLElement, {
          translateX: -x * factor,
          translateY: -y * factor,
          duration: 1500,
          easing: "outQuart"
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Entrance animations for UI elements
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!contentRef.current) return;
    const elements = contentRef.current.querySelectorAll(".stagger-in");
    anime(elements as any, {
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 1200,
      delay: utils.stagger(150, { start: 1000 }),
      easing: "outExpo",
    });

    // Animate the background grid lines drawing in
    const gridLines = gridRef.current?.querySelectorAll(".grid-line");
    if (gridLines) {
      anime(gridLines as any, {
        scaleY: [0, 1],
        scaleX: [0, 1],
        opacity: [0, 0.5],
        duration: 2000,
        delay: utils.stagger(50),
        easing: "outExpo"
      });
    }
  }, []);

  return (
    <section 
      id="hero" 
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#030305] perspective-[1200px]"
    >
      {/* Dynamic Cursor Flare */}
      <div 
        ref={cursorFlareRef} 
        className="absolute top-0 left-0 w-0 h-0 pointer-events-none z-0"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full opacity-30 transition-transform"
             style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, rgba(59,130,246,0.1) 40%, transparent 70%)' }} />
      </div>

      {/* Extreme 3D Grid Engine Background */}
      <div className="absolute inset-[-50%] z-0 pointer-events-none flex items-center justify-center perspective-[1000px] opacity-40">
        <div 
          ref={gridRef} 
          className="w-[200%] h-[200%] relative origin-center"
          style={{ transform: "rotateX(45deg)", transformStyle: "preserve-3d" }}
        >
          {/* Vertical Grid Lines */}
          {Array.from({ length: 41 }).map((_, i) => (
             <div 
               key={`v-${i}`} 
               className="grid-line absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-violet-500/50 to-transparent"
               style={{ left: `${(i / 40) * 100}%`, transformOrigin: "top" }} 
             />
          ))}
          {/* Horizontal Grid Lines */}
          {Array.from({ length: 41 }).map((_, i) => (
             <div 
               key={`h-${i}`} 
               className="grid-line absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
               style={{ top: `${(i / 40) * 100}%`, transformOrigin: "left" }} 
             />
          ))}
        </div>
      </div>

      {/* Floating Geometric Orbs (Parallax Elements) */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <div className="float-el absolute top-[20%] left-[15%] w-64 h-64 rounded-full border border-violet-500/20 shadow-[0_0_50px_rgba(139,92,246,0.1)] blur-[2px]" />
        <div className="float-el absolute bottom-[15%] right-[10%] w-96 h-96 rounded-full border border-emerald-500/10 shadow-[0_0_80px_rgba(16,185,129,0.05)] blur-[4px]" />
        
        {/* Abstract code/data fragments */}
        <div className="float-el absolute top-[30%] right-[20%] font-mono text-[8px] text-white/20 whitespace-pre">
{`0x8F9A -> PTR
INIT SYSTEM...
[OK]`}
        </div>
        <div className="float-el absolute bottom-[25%] left-[10%] font-mono text-[8px] text-white/20 whitespace-pre">
{`MEM_ALLOC: 4096
SYNC_SIG: TRUE
ID: ${profile.name.toUpperCase()}`}
        </div>
      </div>

      {/* Main Content Node */}
      <div ref={contentRef} className="relative z-20 w-full max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center mt-12">
        
        {/* Status Chip */}
        <div className="stagger-in inline-flex items-center gap-2 px-4 py-2 border border-emerald-500/30 bg-emerald-500/10 rounded-full mb-10 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase">System Online</span>
        </div>

        {/* Cinematic Names Revealing */}
        <div className="mb-6 pointer-events-none">
          <TextReveal
            text={profile.name.split(" ")[0] || "HARSHAL"}
            as="div"
            className="text-7xl sm:text-8xl md:text-[8rem] lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.85]"
            stagger={60}
            delay={200}
            charStyle={{
              background: "linear-gradient(to bottom, #ffffff 0%, #a1a1aa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          />
          <TextReveal
            text={profile.name.split(" ")[1] || "PATEL"}
            as="div"
            className="text-7xl sm:text-8xl md:text-[8rem] lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] ml-0 md:ml-32"
            stagger={60}
            delay={600}
            charStyle={{
              background: "linear-gradient(135deg, #a78bfa 0%, #3b82f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          />
        </div>

        {/* Dynamic Typewriter Terminal Box */}
        <div className="stagger-in mt-10 mb-8 border border-white/10 bg-black/40 backdrop-blur-md px-6 py-4 rounded-lg flex items-center gap-4 min-w-[280px] max-w-[600px]">
           <div className="text-violet-400 text-lg font-mono">{">"}</div>
           <div className="text-sm md:text-lg font-mono text-white/80 h-6 flex items-center">
             {displayText}
             <span className="w-2 h-5 bg-violet-400 animate-pulse ml-1" />
           </div>
        </div>

        {/* Bio Tagline */}
        <p className="stagger-in text-base md:text-lg text-white/40 max-w-2xl mx-auto mb-14 leading-relaxed font-mono">
          {profile.tagline.toUpperCase()}
        </p>

        {/* Magnetic CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
          <a ref={cta1Ref as any} href="#projects"
            className="stagger-in group relative magnetic-btn px-10 py-4 rounded-none border border-violet-500/50 bg-violet-500/10 text-white font-mono text-xs tracking-[0.2em] uppercase overflow-hidden w-full sm:w-auto text-center"
          >
            {/* Hover Scanning Glint */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="relative z-10 flex items-center justify-center gap-3">
              [ ACCESS ARCHIVE ]
            </span>
          </a>
          
          <a ref={cta2Ref as any} href="#contact"
             className="stagger-in group relative magnetic-btn px-10 py-4 rounded-none border border-white/20 bg-transparent text-white/70 hover:text-white font-mono text-xs tracking-[0.2em] uppercase overflow-hidden w-full sm:w-auto text-center transition-colors"
          >
            <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10">
              INITIATE SECURE COMMS
            </span>
          </a>
        </div>

      </div>
      
      {/* Scroll Down Decoder indicator */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none hidden md:block">
         <div className="text-[10px] font-mono text-white/30 tracking-widest">
            AXIS // Z<br/>
            STATUS // SECURE<br/>
            <span className="text-violet-400 animate-pulse">AWAITING INPUT...</span>
         </div>
      </div>
      
      {/* CSS Keyframe for the glint */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </section>
  );
}
