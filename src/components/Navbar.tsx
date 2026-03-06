"use client";

import { useState, useEffect } from "react";
import { animate as anime } from "animejs";

const NAV_ITEMS = [
  { 
    id: "hero", label: "HOME", num: "01", kanji: "始", 
    pos: "top-4 left-4 md:top-8 md:left-8", 
    align: "items-start text-left", 
    flexDir: "flex-col",
    bracket: "top-left"
  },
  { 
    id: "projects", label: "WORK", num: "02", kanji: "作", 
    pos: "top-4 right-4 md:top-8 md:right-8", 
    align: "items-end text-right", 
    flexDir: "flex-col",
    bracket: "top-right"
  },
  { 
    id: "about", label: "ORIGIN", num: "03", kanji: "源", 
    pos: "bottom-4 left-4 md:bottom-8 md:left-8", 
    align: "items-start text-left", 
    flexDir: "flex-col-reverse",
    bracket: "bottom-left"
  },
  { 
    id: "contact", label: "SIGNAL", num: "04", kanji: "信", 
    pos: "bottom-4 right-4 md:bottom-8 md:right-8", 
    align: "items-end text-right", 
    flexDir: "flex-col-reverse",
    bracket: "bottom-right"
  },
];

const Bracket = ({ type, isActive }: { type: string, isActive: boolean }) => {
  const baseColors = isActive ? "border-[var(--accent-blood)]" : "border-[var(--text-bone)]/30 group-hover:border-[var(--text-bone)]/80";
  const size = "w-6 h-6 md:w-10 md:h-10 border-[3px] transition-colors duration-500 absolute pointer-events-none";
  
  if (type === "top-left") return <div className={`${size} top-0 left-0 border-r-0 border-b-0 ${baseColors}`} />
  if (type === "top-right") return <div className={`${size} top-0 right-0 border-l-0 border-b-0 ${baseColors}`} />
  if (type === "bottom-left") return <div className={`${size} bottom-0 left-0 border-r-0 border-t-0 ${baseColors}`} />
  if (type === "bottom-right") return <div className={`${size} bottom-0 right-0 border-l-0 border-t-0 ${baseColors}`} />
  return null;
}

export function Navbar() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map((item) => ({
        id: item.id,
        el: document.getElementById(item.id),
      }));

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i].el;
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) {
          setActive(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run initially to set correct state
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    // Cyberpunk/MAPPA glitch effect on click
    const target = e.currentTarget.querySelector('.nav-label');
    if (target) {
      anime(target, {
        translateX: 4,
        duration: 150,
        easing: 'outElastic(1, .5)'
      });
      setTimeout(() => {
        anime(target, { translateX: 0, duration: 150 });
      }, 150);
    }

    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className="fixed inset-0 pointer-events-none z-50">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          
          return (
            <button
              key={item.id}
              onClick={(e) => handleClick(item.id, e)}
              className={`pointer-events-auto absolute ${item.pos} p-2 md:p-4 group flex ${item.flexDir} ${item.align} gap-0 md:gap-1 transition-all duration-500`}
              aria-label={`Navigate to ${item.label}`}
            >
              {/* Brackets stay original color */}
              <Bracket type={item.bracket} isActive={isActive} />
              
              {item.id === "hero" && (
                 <div className="hidden md:flex absolute top-5 left-5 w-3 h-3 bg-[var(--accent-blood)] items-center justify-center z-20">
                   <span className="text-white font-black font-display text-[6px] tracking-tighter">HP</span>
                 </div>
              )}

              {/* Text uses mix-blend-difference to invert on light/dark backgrounds */}
              <div className={`flex flex-col ${item.align} mix-blend-difference text-white z-10 relative px-2 py-1 mt-1 mb-1 ${item.id === 'hero' ? 'md:ml-5' : ''}`}>
                <span className={`font-mono text-[8px] md:text-[10px] tracking-widest transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-80'}`}>
                  {item.num} // {item.kanji}
                </span>
                
                <span 
                  className={`nav-label font-display font-black text-xl md:text-3xl uppercase tracking-tighter transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-30 group-hover:opacity-90'}`}
                >
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Cinematic HUD Reticle in the exact center */}
      <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center mix-blend-difference opacity-20 md:opacity-[0.1]">
        <div className="relative flex items-center justify-center">
          <div className="w-[1px] h-8 md:h-16 bg-[var(--text-bone)]" />
          <div className="absolute h-[1px] w-8 md:w-16 bg-[var(--text-bone)]" />
          <div className="absolute w-[200px] h-[200px] md:w-[600px] md:h-[600px] border border-[var(--text-bone)] rounded-full border-dashed opacity-50 flex items-center justify-center animate-[spin_60s_linear_infinite]">
             <div className="absolute w-[180px] h-[180px] md:w-[560px] md:h-[560px] border border-[var(--accent-blood)] rounded-full opacity-30" />
          </div>
        </div>
      </div>
    </>
  );
}
