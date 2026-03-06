"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { id: "hero", label: "HOME", kanji: "始", percent: 0 },
  { id: "projects", label: "WORK", kanji: "作", percent: 33 }, // Approximate scroll percentages
  { id: "about", label: "ORIGIN", kanji: "源", percent: 66 },
  { id: "contact", label: "SIGNAL", kanji: "信", percent: 100 },
];

export function Navbar() {
  const [active, setActive] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const progress = maxScroll > 0 ? (currentScrollY / maxScroll) * 100 : 0;
          
          setScrollProgress(progress);
          
          // Calculate scrolling speed/intensity (abstract data for HUD)
          const speed = Math.abs(currentScrollY - lastScrollY);
          setScrollSpeed(Math.min(speed, 99)); // Cap at 99 for aesthetic
          lastScrollY = currentScrollY;

          // Determine active section
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
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial evaluation
    handleScroll();

    // Reset speed slowly when scrolling stops
    const speedInterval = setInterval(() => {
      setScrollSpeed(prev => (prev > 0 ? Math.floor(prev * 0.8) : 0));
    }, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(speedInterval);
    };
  }, [pathname]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className="fixed right-0 top-0 bottom-0 z-50 w-12 md:w-16 bg-[var(--bg-ink)] border-l border-[var(--text-bone)]/10 flex flex-col justify-between items-center py-4 md:py-8 overflow-hidden">
        
        {/* TOP BRAND INDICATOR */}
        <div className="flex flex-col items-center gap-4 z-20">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-[var(--accent-blood)] flex items-center justify-center shrink-0 cursor-pointer" onClick={() => handleClick("hero")}>
            <span className="text-white font-black font-display text-sm md:text-base tracking-tighter shadow-md">HP</span>
          </div>
          
          <div className="flex flex-col items-center gap-1 opacity-40">
            <span className="font-mono text-[8px] md:text-[10px] tracking-widest" style={{ writingMode: "vertical-rl" }}>SYSTEM: ONLINE</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-[var(--text-bone)] to-transparent" />
          </div>
        </div>

        {/* THE TIMELINE TRACK */}
        <div className="relative flex-1 w-full my-6 flex flex-col items-center justify-between">
          {/* Faint static track line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-[var(--text-bone)]/5" />
          
          {/* Tick marks representing the track (pointing inwards) */}
          <div className="absolute inset-0 flex flex-col justify-between py-[10%] opacity-20 pointer-events-none">
             {Array.from({ length: 20 }).map((_, i) => (
               <div key={i} className={`w-full flex ${i % 5 === 0 ? "justify-center" : "justify-start pl-2"}`}>
                 <div className={`h-[1px] bg-[var(--text-bone)] ${i % 5 === 0 ? "w-4" : "w-1.5"}`} />
               </div>
             ))}
          </div>

          {/* ACTIVE SCROLL SCANNED CROSSHAIR (The sleeker thumb) */}
          <div 
            className="absolute left-0 right-0 flex items-center z-10 transition-all duration-75 ease-out pointer-events-none"
            style={{ top: `${scrollProgress}%`, transform: `translateY(-50%)` }}
          >
            {/* Horizontal precision line across the timeline */}
            <div className="w-full h-[1px] bg-[var(--accent-blood)] shadow-[0_0_10px_rgba(217,17,17,0.8)] relative flex items-center justify-between px-[2px]">
              {/* Target bracket left */}
              <div className="w-[3px] h-[3px] border-t border-r border-[var(--accent-blood)] rotate-45" />
              {/* Target square right */}
              <div className="w-[3px] h-[3px] bg-[var(--accent-blood)]" />
            </div>
            {/* Dynamic abstract trailing line based on speed */}
            <div 
               className="absolute right-[3px] w-[1px] bg-[var(--accent-blood)] opacity-50 transition-all duration-100 origin-bottom" 
               style={{ height: `${Math.min(scrollSpeed * 1.5, 80)}px`, bottom: "0" }} 
            />
          </div>

          {/* CHAPTER MARKERS / NAV LINKS */}
          <div className="flex flex-col justify-between w-full h-full relative z-20 pointer-events-none">
            {NAV_ITEMS.map((item, index) => {
              const isActive = active === item.id;
              // Add proper spacing to match standard page height distributions
              const topOffset = index === 0 ? "0%" : index === 1 ? "30%" : index === 2 ? "65%" : "100%";

              return (
                <button
                  key={item.id}
                  onClick={() => handleClick(item.id)}
                  className="pointer-events-auto absolute w-full group py-4 flex flex-col items-center transition-all duration-300"
                  style={{ top: topOffset, transform: `translateY(-50%)` }}
                  aria-label={`Navigate to ${item.label}`}
                >
                  {/* Vertical English labels instead of Kanji */}
                  <span 
                    className={`font-display font-bold text-[10px] md:text-[12px] uppercase tracking-widest transition-all duration-300 ${isActive ? "text-[var(--text-bone)] drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] scale-110" : "text-[var(--text-bone)]/30 group-hover:text-[var(--text-bone)]/80"}`} 
                    style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* BOTTOM HUD INDICATOR */}
        <div className="flex flex-col items-center gap-2 opacity-40 z-20">
          <span className="font-mono text-[8px] md:text-[10px] tracking-widest text-center">
            {Math.round(scrollProgress)}%
          </span>
          <div className="w-8 h-8 rounded-full border border-dashed border-[var(--text-bone)] flex items-center justify-center animate-[spin_10s_linear_infinite]">
            <div className="w-1.5 h-1.5 bg-[var(--text-bone)]/50" />
          </div>
        </div>

      </nav>
    </>
  );
}
