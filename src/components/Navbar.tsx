"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { animate as anime } from "animejs";

const NAV_ITEMS = [
  { id: "hero", label: "Home", kanji: "始" },
  { id: "projects", label: "Work", kanji: "作" },
  { id: "about", label: "Origin", kanji: "源" },
  { id: "contact", label: "Signal", kanji: "信" },
];

export function Navbar() {
  const [active, setActive] = useState("hero");
  const [expanded, setExpanded] = useState(false); // Desktop sidebar hover
  const [mobileOpen, setMobileOpen] = useState(false); // Mobile full-screen overlay
  const [scrolled, setScrolled] = useState(false);
  const overlayItemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

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

  const handleClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  }, []);

  // Animate mobile overlay items on open
  useEffect(() => {
    if (mobileOpen) {
      overlayItemsRef.current.forEach((el, i) => {
        if (el) {
          anime(el, {
            opacity: [0, 1],
            translateX: [-60, 0],
            duration: 600,
            delay: 100 + i * 100,
            easing: "outExpo",
          });
        }
      });
    }
  }, [mobileOpen]);

  return (
    <>
      {/* ═══════════════════════════════════════════════
          DESKTOP: Vertical Film Strip Sidebar (left edge)
          ═══════════════════════════════════════════════ */}
      <nav
        ref={sidebarRef}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className={`fixed left-0 top-0 bottom-0 z-50 hidden md:flex flex-col items-start transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          expanded ? "w-[200px]" : "w-[52px]"
        }`}
      >
        {/* Film strip background */}
        <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md border-r border-[var(--text-bone)]/8" />

        {/* Sprocket holes — top */}
        <div className="relative z-10 flex flex-col items-center w-[52px] pt-6 pb-4 gap-2">
          <div className="w-3 h-1.5 rounded-[1px] bg-[var(--text-bone)]/10" />
          <div className="w-3 h-1.5 rounded-[1px] bg-[var(--text-bone)]/10" />
        </div>

        {/* HP Brand Frame */}
        <div className="relative z-10 flex items-center w-full px-3 mb-8">
          <div className="w-[28px] h-[28px] bg-[var(--accent-blood)] flex items-center justify-center shrink-0">
            <span className="text-white font-black font-display text-[10px] tracking-tighter">HP</span>
          </div>
          <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${expanded ? "w-[120px] opacity-100 ml-3" : "w-0 opacity-0 ml-0"}`}>
            <span className="text-[9px] font-mono text-[var(--text-bone)]/40 uppercase tracking-[0.3em] whitespace-nowrap">Portfolio</span>
          </div>
        </div>

        {/* Divider line */}
        <div className="relative z-10 w-[52px] flex justify-center mb-4">
          <div className="w-6 h-[1px] bg-[var(--accent-blood)]/30" />
        </div>

        {/* Nav Film Frames */}
        <div className="relative z-10 flex flex-col gap-1 w-full flex-1 px-3">
          {NAV_ITEMS.map((item, i) => {
            const isActive = active === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className="group relative w-full flex items-center gap-3 transition-all duration-300"
              >
                {/* Frame square */}
                <div className={`relative w-[28px] h-[28px] shrink-0 flex items-center justify-center border transition-all duration-500 ${
                  isActive
                    ? "bg-[var(--accent-blood)] border-[var(--accent-blood)]"
                    : "bg-transparent border-[var(--text-bone)]/15 group-hover:border-[var(--text-bone)]/40"
                }`}>
                  {/* Kanji inside frame */}
                  <span className={`text-[11px] font-bold transition-all duration-300 ${
                    isActive ? "text-white" : "text-[var(--text-bone)]/25 group-hover:text-[var(--text-bone)]/60"
                  }`}>
                    {item.kanji}
                  </span>

                  {/* Active corner mark */}
                  {isActive && (
                    <div className="absolute -top-[2px] -right-[2px] w-1.5 h-1.5 bg-white" />
                  )}
                </div>

                {/* Label (slides in on expand) */}
                <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${expanded ? "w-[120px] opacity-100" : "w-0 opacity-0"}`}>
                  <div className="flex items-baseline gap-2 whitespace-nowrap">
                    <span className={`text-[9px] font-mono transition-colors duration-300 ${
                      isActive ? "text-[var(--accent-blood)]" : "text-[var(--text-bone)]/20"
                    }`}>
                      0{i + 1}
                    </span>
                    <span className={`text-[11px] font-black font-display uppercase tracking-[0.2em] transition-colors duration-300 ${
                      isActive ? "text-[var(--text-bone)]" : "text-[var(--text-bone)]/40 group-hover:text-[var(--text-bone)]/80"
                    }`}>
                      {item.label}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sprocket holes — bottom */}
        <div className="relative z-10 flex flex-col items-center w-[52px] pb-6 pt-4 gap-2">
          <div className="w-3 h-1.5 rounded-[1px] bg-[var(--text-bone)]/10" />
          <div className="w-3 h-1.5 rounded-[1px] bg-[var(--text-bone)]/10" />
        </div>

        {/* Active section indicator line (vertical red line on the right edge) */}
        <div
          className="absolute right-0 w-[2px] bg-[var(--accent-blood)] transition-all duration-700 ease-[cubic-bezier(0.86,0,0.07,1)]"
          style={{
            top: `${(NAV_ITEMS.findIndex(n => n.id === active) / NAV_ITEMS.length) * 60 + 20}%`,
            height: `${100 / NAV_ITEMS.length * 0.5}%`,
          }}
        />
      </nav>

      {/* ═══════════════════════════════════════════════
          MOBILE: Floating Trigger + Full-Screen Overlay
          ═══════════════════════════════════════════════ */}

      {/* Floating trigger button — top left */}
      <button
        onClick={() => setMobileOpen(true)}
        className={`fixed top-4 left-4 z-50 md:hidden w-10 h-10 flex items-center justify-center transition-all duration-300 ${
          mobileOpen ? "opacity-0 pointer-events-none scale-75" : "opacity-100 scale-100"
        }`}
        aria-label="Open navigation"
      >
        <div className="w-10 h-10 bg-[var(--accent-blood)] flex items-center justify-center">
          <span className="text-white font-black font-display text-xs tracking-tighter">HP</span>
        </div>
        {/* Pulsing ring */}
        <div className="absolute inset-0 border border-[var(--accent-blood)] animate-ping opacity-20" />
      </button>

      {/* Full-screen cinematic overlay */}
      <div className={`fixed inset-0 z-[999] md:hidden transition-all duration-500 ${
        mobileOpen ? "visible" : "invisible pointer-events-none"
      }`}>
        {/* Black backdrop with film grain */}
        <div className={`absolute inset-0 bg-[#050505] transition-opacity duration-500 ${
          mobileOpen ? "opacity-100" : "opacity-0"
        }`} />
        <div className="absolute inset-0 halftone-bg opacity-[0.03] pointer-events-none" />

        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className={`absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center border border-[var(--text-bone)]/20 transition-all duration-300 ${
            mobileOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
          }`}
          aria-label="Close navigation"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-bone)" strokeWidth="2" strokeLinecap="square">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* HP mark — top left */}
        <div className={`absolute top-4 left-4 z-10 w-10 h-10 bg-[var(--accent-blood)] flex items-center justify-center transition-all duration-500 ${
          mobileOpen ? "opacity-100" : "opacity-0"
        }`}>
          <span className="text-white font-black font-display text-xs tracking-tighter">HP</span>
        </div>

        {/* Navigation items — cinematic title card style */}
        <div className="relative z-10 flex flex-col justify-center h-full px-8 py-20">
          {NAV_ITEMS.map((item, i) => {
            const isActive = active === item.id;

            return (
              <button
                key={item.id}
                ref={(el) => { overlayItemsRef.current[i] = el; }}
                onClick={() => handleClick(item.id)}
                className="group relative text-left py-5 opacity-0"
              >
                {/* Red accent line for active */}
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] transition-all duration-500 ${
                  isActive ? "h-full bg-[var(--accent-blood)]" : "h-0 bg-transparent group-active:h-full group-active:bg-[var(--accent-blood)]/50"
                }`} />

                <div className="flex items-baseline gap-4 pl-5">
                  {/* Chapter number */}
                  <span className={`text-xs font-mono transition-colors duration-300 ${
                    isActive ? "text-[var(--accent-blood)]" : "text-[var(--text-bone)]/20"
                  }`}>
                    0{i + 1}
                  </span>

                  {/* Massive section name */}
                  <span className={`text-4xl font-black font-display uppercase tracking-[0.1em] transition-colors duration-300 ${
                    isActive ? "text-[var(--text-bone)]" : "text-[var(--text-bone)]/30 group-hover:text-[var(--text-bone)]/70"
                  }`}>
                    {item.label}
                  </span>

                  {/* Kanji */}
                  <span className={`text-lg transition-colors duration-300 ${
                    isActive ? "text-[var(--accent-blood)]/60" : "text-[var(--text-bone)]/10"
                  }`}>
                    {item.kanji}
                  </span>
                </div>

                {/* Bottom divider */}
                <div className="absolute bottom-0 left-5 right-0 h-[1px] bg-[var(--text-bone)]/8" />
              </button>
            );
          })}

          {/* Status footer */}
          <div className="mt-12 pl-5 flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-[var(--accent-blood)] animate-pulse" />
            <span className="text-[9px] font-mono text-[var(--text-bone)]/20 uppercase tracking-[0.4em]">
              Navigate // Select Chapter
            </span>
          </div>
        </div>

        {/* Decorative vertical line */}
        <div className={`absolute left-[42px] top-20 bottom-20 w-[1px] bg-[var(--text-bone)]/5 transition-opacity duration-700 ${
          mobileOpen ? "opacity-100" : "opacity-0"
        }`} />
      </div>
    </>
  );
}
