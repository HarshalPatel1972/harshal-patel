"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { animate as anime, utils } from "animejs";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLButtonElement>(null);

  // Secret Eridian Trigger: Track rapid clicks on the globe icon
  const clickTimesRef = useRef<number[]>([]);

  const languages = [
    { code: 'de', label: 'Deutsch' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español (España)' },
    { code: 'es-419', label: 'Español (Latinoamérica)' },
    { code: 'fr', label: 'Français' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'id', label: 'Indonesia' },
    { code: 'it', label: 'Italiano' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'pt-br', label: 'Português' },
    { code: 'zh-tw', label: '繁體中文' }
  ] as const;

  // Click-outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pure Top-to-Bottom Staggered Reveal 🎞️
  useEffect(() => {
    if (!menuRef.current) return;
    
    const menuItems = menuRef.current.querySelectorAll('.lang-item');
    
    if (isOpen) {
      // 1. Items Stagger (The only animation)
      const itemsAnim = anime(menuItems as any, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 450,
        delay: utils.stagger(40), // (13 items * 40) + 450 = ~970ms total.
        easing: 'easeOutCubic'
      });

      return () => { itemsAnim.pause(); };
    } else {
      // Instant clear on close
      anime(menuItems as any, { opacity: 0, translateY: 20, duration: 0 });
    }
  }, [isOpen]);

  // Amber pulse when Eridian is active ♫
  useEffect(() => {
    if (!globeRef.current) return;
    let pulse: any = null;
    if (language === 'eridian') {
      pulse = anime(globeRef.current, {
        borderColor: ['#FFB300', '#FF8C00', '#FFB300'],
        duration: 1400,
        easing: 'easeInOutSine',
        loop: true
      });
    }
    return () => {
      if (pulse) pulse.pause();
    };
  }, [language]);

  // Secret 5-click Eridian activation
  const handleGlobeClick = () => {
    const now = Date.now();
    const recentClicks = [...clickTimesRef.current.filter(t => now - t < 2000), now];
    clickTimesRef.current = recentClicks;

    if (recentClicks.length >= 5) {
      clickTimesRef.current = [];
      if (language !== 'eridian') {
        setLanguage('eridian');
        setIsOpen(false);
        return;
      }
    }

    setIsOpen(prev => !prev);
  };

  const isEridian = language === 'eridian';

  return (
    <div ref={containerRef} className="relative flex flex-col group">
      <button
        ref={globeRef}
        onClick={handleGlobeClick}
        style={isEridian ? { borderColor: '#FFB300' } : {}}
        className={`w-9 h-9 bg-black border-2 flex items-center justify-center transition-all duration-500 hover:border-[var(--accent-blood)] ${isOpen ? 'rotate-90 border-[var(--accent-blood)]' : 'border-white'}`}
        aria-label="Select Language"
      >
        {isEridian ? (
          <span className="text-[#FFB300] text-base leading-none font-bold select-none" aria-hidden="true">♩</span>
        ) : (
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white transition-colors group-hover:fill-[var(--accent-blood)]" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17c-.77 2.07-1.86 4-3.27 5.76-1.02-1.13-1.92-2.39-2.61-3.69-.32-.61-.59-1.24-.81-1.84l-.08-.23H3.25l.13.43c.27.87.64 1.76 1.09 2.65.86 1.63 2 3.2 3.33 4.62l-4.7 4.65 1.41 1.41 4.7-4.65 3.1 3.1 1.06-1.07zm5.23-2.57L17 12l-5 12h2l1.25-3h5.5l1.25 3h2l-5-12zm-3.85 7l2.1-5 2.1 5h-4.2z"/>
          </svg>
        )}
      </button>

      {/* Expanded Container - Instant Pop-in without transitions 🎞️ */}
      <div
        ref={menuRef}
        className={`absolute top-0 left-11 flex flex-col bg-black/95 backdrop-blur-md border overflow-hidden ${isEridian ? 'border-[#FFB300]/40' : 'border-white/20'} ${isOpen ? 'opacity-100 pointer-events-auto shadow-[0_30px_60px_rgba(0,0,0,0.8)]' : 'opacity-0 pointer-events-none'}`}
        style={{ width: '220px', zIndex: 100 }}
      >
        <div className="flex flex-col w-full overflow-y-auto max-h-[70vh]">

          {/* ♩ Eridian entry — only surfaces when Rocky's language is active */}
          {isEridian && (
            <button
              onClick={() => { setLanguage('en'); setIsOpen(false); }}
              className="lang-item opacity-0 relative font-mono text-sm font-bold tracking-widest h-12 flex items-center justify-start px-6 border-b transition-all duration-300 hover:bg-[#FFB300]/10 text-[#FFB300] bg-[#FFB300]/5 border-[#FFB300]/30"
            >
              <span className="shrink-0">♩ ERIDIAN</span>
              <div className="ml-auto w-1.5 h-1.5 bg-[#FFB300]" />
            </button>
          )}

          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setIsOpen(false); }}
              className={`lang-item opacity-0 relative font-mono text-sm font-bold tracking-widest h-12 flex items-center justify-start px-6 border-b border-white/5 transition-colors duration-300 hover:bg-white/10 hover:text-white ${!isEridian && language === lang.code ? 'text-[var(--accent-blood)] bg-white/5' : 'text-white/80'}`}
            >
              <span className="shrink-0">{lang.label}</span>
              {!isEridian && language === lang.code && <div className="ml-auto w-1.5 h-1.5 bg-[var(--accent-blood)]" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
