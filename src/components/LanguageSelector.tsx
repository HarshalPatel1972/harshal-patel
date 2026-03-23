"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'zh-tw', label: '繁體中文' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'fr', label: 'Français' },
    { code: 'id', label: 'Indonesia' },
    { code: 'de', label: 'Deutsch' },
    { code: 'it', label: 'Italiano' },
    { code: 'pt-br', label: 'Português' },
    { code: 'es-419', label: 'Español (Latinoamérica)' },
    { code: 'es', label: 'Español (España)' }
  ] as const;

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full border-b border-white/10 group flex flex-col items-center justify-center p-0"
    >
      {/* Structural Trigger Square */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full aspect-square bg-black flex items-center justify-center transition-all duration-500 hover:bg-white/5 ${isOpen ? 'rotate-90 opacity-100' : 'opacity-60 hover:opacity-100'}`}
        aria-label="Selection Language"
      >
        <svg 
          viewBox="0 0 24 24" 
          className={`w-4 h-4 transition-colors ${isOpen ? 'fill-[var(--accent-blood)]' : 'fill-white'}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17c-.77 2.07-1.86 4-3.27 5.76-1.02-1.13-1.92-2.39-2.61-3.69-.32-.61-.59-1.24-.81-1.84l-.08-.23H3.25l.13.43c.27.87.64 1.76 1.09 2.65.86 1.63 2 3.2 3.33 4.62l-4.7 4.65 1.41 1.41 4.7-4.65 3.1 3.1 1.06-1.07zm5.23-2.57L17 12l-5 12h2l1.25-3h5.5l1.25 3h2l-5-12zm-3.85 7l2.1-5 2.1 5h-4.2z"/>
        </svg>
      </button>

      {/* Slide-out Menu (Opens Left) */}
      <div 
        className={`absolute top-0 right-full grid grid-cols-3 gap-0 bg-black/95 backdrop-blur-md border border-white/20 border-r-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden ${isOpen ? 'max-w-[400px] opacity-100 p-[1px]' : 'max-w-0 opacity-0 pointer-events-none'}`}
        style={{ width: '300px' }}
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => {
              setLanguage(lang.code);
              setIsOpen(false);
            }}
            className={`
              relative font-mono text-[9px] font-bold tracking-widest h-9 flex items-center justify-center border border-[var(--text-bone)]/5 transition-all duration-300 hover:bg-white/10 hover:text-white
              ${language === lang.code ? 'text-[var(--accent-blood)] bg-white/5' : 'text-white/80'}
            `}
          >
            {lang.label}
          </button>
        ))}
        {/* Fill empty cells to maintain 3 items per row layout */}
        {languages.length % 3 !== 0 && Array.from({ length: 3 - (languages.length % 3) }).map((_, i) => (
          <div key={`empty-${i}`} className="border border-[var(--text-bone)]/5 h-9" />
        ))}
      </div>

      {/* Tooltip hint when closed */}
      {!isOpen && (
        <span className="absolute right-12 md:right-16 top-1/2 -translate-y-1/2 font-mono text-[9px] text-[var(--text-bone)]/40 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity uppercase pointer-events-none whitespace-nowrap">
          LANGUAGE_CORE
        </span>
      )}
    </div>
  );
}
