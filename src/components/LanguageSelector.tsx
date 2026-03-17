"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'ja', label: 'JA' },
    { code: 'ko', label: 'KO' },
    { code: 'zh-tw', label: 'ZH' },
    { code: 'hi', label: 'HI' }
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
      className="fixed left-4 top-14 z-[70] flex items-center group"
    >
      {/* Trigger Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-9 h-9 bg-black border border-white/10 flex items-center justify-center transition-all duration-500 hover:border-[var(--accent-blood)] ${isOpen ? 'rotate-90 border-[var(--accent-blood)]' : ''}`}
        aria-label="Selection Language"
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-5 h-5 fill-white transition-colors group-hover:fill-[var(--accent-blood)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Universal Language Icon (文 + A inspired) */}
          <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17c-.77 2.07-1.86 4-3.27 5.76-1.02-1.13-1.92-2.39-2.61-3.69-.32-.61-.59-1.24-.81-1.84l-.08-.23H3.25l.13.43c.27.87.64 1.76 1.09 2.65.86 1.63 2 3.2 3.33 4.62l-4.7 4.65 1.41 1.41 4.7-4.65 3.1 3.1 1.06-1.07zm5.23-2.57L17 12l-5 12h2l1.25-3h5.5l1.25 3h2l-5-12zm-3.85 7l2.1-5 2.1 5h-4.2z"/>
        </svg>
      </button>

      {/* Expanded Container */}
      <div 
        className={`flex items-center gap-1 bg-black/90 backdrop-blur-md border-y border-r border-white/10 h-9 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden ${isOpen ? 'max-w-[400px] opacity-100 pl-4 pr-3 ml-0' : 'max-w-0 opacity-0 ml-[-10px]'}`}
      >
        {languages.map((lang, idx) => (
          <div key={lang.code} className="flex items-center">
            <button
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`font-mono text-[11px] font-bold tracking-widest px-2 py-1 transition-all duration-300 hover:text-white ${language === lang.code ? 'text-[var(--accent-blood)]' : 'text-white/40'}`}
            >
              {lang.label}
            </button>
            {idx < languages.length - 1 && (
              <span className="w-[1px] h-3 bg-white/10" />
            )}
          </div>
        ))}
      </div>

      {/* Tooltip hint when closed */}
      {!isOpen && (
        <span className="ml-3 font-mono text-[9px] text-white/20 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity uppercase pointer-events-none">
          Language Selector
        </span>
      )}
    </div>
  );
}
