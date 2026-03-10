"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

const NAV_ITEMS = {
  en: [
    { id: "hero", label: "HOME", percent: 5 },
    { id: "projects", label: "WORK", percent: 33 },
    { id: "about", label: "ORIGIN", percent: 65 },
    { id: "contact", label: "CONTACT", percent: 95 },
  ],
  ja: [
    { id: "hero", label: "始", percent: 5 },
    { id: "projects", label: "作", percent: 33 },
    { id: "about", label: "源", percent: 65 },
    { id: "contact", label: "連絡", percent: 95 },
  ]
};

export function Navbar() {
  const { language } = useLanguage();
  const currentNavItems = NAV_ITEMS[language];
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
          const sections = currentNavItems.map((item) => ({
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
  }, [pathname, currentNavItems]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className="fixed right-0 top-0 bottom-0 z-50 w-12 md:w-16 bg-[var(--text-bone)]/90 backdrop-blur-xl border-l border-[var(--bg-ink)]/10 flex flex-col justify-between items-center py-4 md:py-8 overflow-hidden">
        
        {/* TOP BRAND INDICATOR - Unified Global Logo */}
        <div className="flex flex-col items-center gap-4 z-20">
          <a href="#" className="w-9 h-9 md:w-11 md:h-11 bg-black flex items-center justify-center shrink-0 cursor-pointer brutal-shadow-sm border border-white/5 group overflow-hidden -translate-x-[4px]">
            <img 
              src="/icon.png" 
              alt="HP Logo" 
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
            />
          </a>
        </div>

        {/* THE TIMELINE TRACK */}
        <div className="relative flex-1 w-full my-6 flex flex-col items-center justify-between">
          {/* Faint static track line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-[var(--bg-ink)]/10" />
          
          {/* Tick marks representing the track (pointing inwards) */}
          <div className="absolute inset-0 flex flex-col justify-between py-[10%] opacity-20 pointer-events-none">
             {Array.from({ length: 20 }).map((_, i) => (
               <div key={i} className={`w-full flex ${i % 5 === 0 ? "justify-center" : "justify-start pl-2"}`}>
                 <div className={`h-[1px] bg-[var(--bg-ink)] ${i % 5 === 0 ? "w-4" : "w-1.5"}`} />
               </div>
             ))}
          </div>

          {/* ACTIVE SCROLL SCANNED CROSSHAIR (Dynamic physics dot) */}
          <div 
            className="absolute left-0 right-0 flex items-center justify-center z-10 pointer-events-none"
            style={{ 
              top: `${scrollProgress}%`, 
              transform: `translateY(-50%)`,
              // The transition gives it that smooth, springy physics feeling as top updates
              transition: "top 0.1s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
              // Dynamically scale/stretch the height based on scroll speed. Base height is 8px.
              height: `${8 + (scrollSpeed * 0.5)}px` 
            }}
          >
            {/* The actual dot/shape */}
            <div 
              className="bg-[var(--accent-blood)] shadow-[0_0_15px_rgba(217,17,17,0.8)] rounded-full transition-all duration-200"
              style={{
                width: `${ Math.max(4, 8 - (scrollSpeed * 0.05)) }px`, // Compress width slightly when moving fast
                height: '100%' // Fill the dynamically stretching parent
              }}
            />
          </div>

          <div className="flex flex-col justify-between w-full h-full relative z-20 pointer-events-none">
            {currentNavItems.map((item) => {
              const isActive = active === item.id;

              return (
                <a
                  key={item.id}
                  href={item.id === 'hero' ? '#' : `#${item.id}`}
                  className="pointer-events-auto absolute w-full group py-4 flex flex-col items-center transition-all duration-300"
                  style={{ top: `${item.percent}%`, transform: `translateY(-50%)` }}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <span 
                    className={`font-display font-bold ${language === 'ja' ? 'text-xl md:text-2xl' : 'text-sm md:text-base'} uppercase tracking-widest transition-all duration-300 ${isActive ? "text-[var(--bg-ink)] drop-shadow-[0_0_8px_rgba(5,5,5,0.4)] scale-110" : "text-[var(--bg-ink)]/40 group-hover:text-[var(--bg-ink)]/80"}`} 
                    style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                  >
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* BOTTOM SPACER */}
        <div className="flex flex-col items-center gap-2 opacity-40 z-20 h-8" />

      </nav>
    </>
  );
}
