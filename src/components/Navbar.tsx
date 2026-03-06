"use client";

import { useState, useEffect } from "react";
import { animate as anime } from "animejs";

const NAV_ITEMS = [
  { id: "hero", label: "Home", num: "01" },
  { id: "projects", label: "Work", num: "02" },
  { id: "about", label: "About", num: "03" },
  { id: "contact", label: "Contact", num: "04" },
];

export function Navbar() {
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Determine active section
      const sections = NAV_ITEMS.map((item) => ({
        id: item.id,
        el: document.getElementById(item.id),
      }));

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i].el;
        if (el && el.getBoundingClientRect().top <= 200) {
          setActive(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#050505]/95 backdrop-blur-sm border-b border-[var(--text-bone)]/10"
          : "bg-transparent"
      }`}
    >
      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-14 md:h-16">
        
        {/* Brand Mark — Left */}
        <div className="hidden md:flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--accent-blood)] flex items-center justify-center">
            <span className="text-white font-black font-display text-sm tracking-tighter">HP</span>
          </div>
          <div className="h-6 w-[1px] bg-[var(--text-bone)]/20" />
          <span className="text-[10px] font-mono text-[var(--text-bone)]/40 uppercase tracking-[0.3em]">Portfolio</span>
        </div>

        {/* Mobile Brand — Left */}
        <div className="flex md:hidden items-center">
          <div className="w-7 h-7 bg-[var(--accent-blood)] flex items-center justify-center">
            <span className="text-white font-black font-display text-xs tracking-tighter">HP</span>
          </div>
        </div>

        {/* Nav Items — Right */}
        <div className="flex items-center gap-0 md:gap-1">
          {NAV_ITEMS.map((item, i) => {
            const isActive = active === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    anime(e.currentTarget, {
                      scale: 1.05,
                      duration: 300,
                      easing: "outQuart",
                    });
                  }
                }}
                onMouseLeave={(e) => {
                  anime(e.currentTarget, {
                    scale: 1,
                    duration: 300,
                    easing: "outQuart",
                  });
                }}
                className={`group relative px-3 py-3.5 md:px-5 md:py-4 transition-all duration-300 ${
                  isActive
                    ? "text-[var(--text-bone)]"
                    : "text-[var(--text-bone)]/40 hover:text-[var(--text-bone)]"
                }`}
              >
                {/* Number + Label */}
                <div className="flex items-baseline gap-1.5 md:gap-2 relative z-10">
                  <span className={`text-[8px] md:text-[10px] font-mono transition-colors duration-300 ${
                    isActive ? "text-[var(--accent-blood)]" : "text-[var(--text-bone)]/20 group-hover:text-[var(--accent-blood)]/60"
                  }`}>
                    {item.num}
                  </span>
                  <span className="text-[10px] md:text-xs font-black font-display uppercase tracking-[0.15em] md:tracking-[0.2em]">
                    {item.label}
                  </span>
                </div>

                {/* Active Indicator — Red bottom line */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[var(--accent-blood)] transition-all duration-500 ease-[cubic-bezier(0.86,0,0.07,1)] ${
                  isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-40"
                }`} />

                {/* Active red dot — top right corner */}
                <div className={`absolute top-2 right-2 w-1 h-1 rounded-full bg-[var(--accent-blood)] transition-all duration-300 ${
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`} />
              </button>
            );
          })}

          {/* Separator + Status indicator (desktop only) */}
          <div className="hidden md:flex items-center gap-3 ml-4 pl-4 border-l border-[var(--text-bone)]/10">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[var(--accent-blood)] animate-pulse" />
              <span className="text-[9px] font-mono text-[var(--text-bone)]/30 uppercase tracking-widest">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic thin line at the very bottom when scrolled */}
      <div className={`absolute bottom-0 left-0 right-0 h-[1px] transition-opacity duration-500 ${
        scrolled ? "opacity-100" : "opacity-0"
      }`} style={{ background: "linear-gradient(90deg, transparent, var(--accent-blood), transparent)" }} />
    </nav>
  );
}
