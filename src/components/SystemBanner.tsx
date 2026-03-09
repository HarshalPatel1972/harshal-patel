"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export function SystemBanner() {
  const [visible, setVisible] = useState(true);
  const { language, setLanguage } = useLanguage();

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-12 md:right-16 z-[60] bg-[var(--accent-blood)] border-b border-black/20 flex items-center justify-between px-4 py-2 shadow-[0_4px_30px_rgba(217,17,17,0.4)]">
      <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
         {/* Brutalist Warning Label */}
         <div className="bg-white text-[var(--accent-blood)] text-[9px] md:text-[10px] font-black font-display tracking-widest px-2 py-0.5 uppercase shrink-0 flex items-center gap-1.5">
           <span className="w-1.5 h-1.5 bg-[var(--accent-blood)] animate-pulse" />
           {language === 'en' ? "NOTICE" : "お知らせ"}
         </div>
         
         {/* Technical Context - High Visibility White */}
         <span className="font-mono text-[9px] md:text-[11px] text-white font-bold tracking-wide uppercase truncate drop-shadow-sm">
           {language === 'en' 
             ? "This portfolio is currently undergoing a live redesign. Some features may be temporarily unavailable. Thank you for your patience."
             : "このポートフォリオは現在再設計中です。一部の機能が利用できない場合があります。ご不便をおかけしますが、ご了承ください。"}
         </span>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {/* Language Toggle - Redesigned for red BG */}
        <div className="flex items-center gap-2 border border-white/40 px-2 py-1 bg-black/20 backdrop-blur-sm">
          <button 
            onClick={() => setLanguage('en')}
            className={`font-mono text-[9px] md:text-[10px] uppercase tracking-wider transition-colors duration-300 ${language === 'en' ? "text-white font-black" : "text-white/40 hover:text-white"}`}
          >
            [EN]
          </button>
          <span className="text-white/30 text-[10px]">/</span>
          <button 
            onClick={() => setLanguage('ja')}
            className={`font-mono text-[9px] md:text-[10px] uppercase tracking-wider transition-colors duration-300 ${language === 'ja' ? "text-white font-black" : "text-white/40 hover:text-white"}`}
          >
            [JA]
          </button>
        </div>

        {/* Dismiss Button */}
        <button 
          onClick={() => setVisible(false)} 
          className="text-white/60 hover:text-white transition-colors font-mono text-sm px-2 shrink-0 font-black"
          aria-label="Dismiss system notice"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
