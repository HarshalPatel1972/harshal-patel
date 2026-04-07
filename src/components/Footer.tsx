"use client";

import { profile } from "@/data/profile";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { language } = useLanguage();
  const currentProfile = profile[language];

  // CLEAN & DIRECT NARRATIVES ☕
  const supportText = language === 'hi' ? "कॉफी पिलाएँ" : language === 'eridian' ? "BUY-COFFEE" : "Buy Me a Coffee";

  return (
    <footer className="relative bg-[#050505] border-t-4 border-[var(--text-bone)] px-4 py-8 md:px-12 md:py-16 overflow-hidden">
      {/* Halftone / Grain Texture Base */}
      <div className="absolute inset-0 halftone-bg z-0 opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,var(--accent-blood-alpha)_0%,transparent_70%)] opacity-60" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        <div className="flex flex-col gap-2">
            <div className="text-[16px] md:text-[24px] font-black font-display uppercase tracking-[-0.04em] text-[var(--text-bone)]">
                {currentProfile.name} <span className="text-[var(--accent-blood)] ml-4 opacity-80 decoration-slice">© {new Date().getFullYear()}</span>
            </div>
        </div>

        {/* BRUTALIST & RELIABLE SUPPORT BUTTON ☕ */}
        <div className="relative group md:-translate-x-[100px] transition-transform duration-500 w-full md:w-auto">
          <a 
            href="https://www.chai4.me/harshalpatel" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative flex items-center justify-center w-full md:w-[280px] h-[60px] md:h-[70px] bg-[var(--accent-blood)] border-2 border-black overflow-hidden brutal-shadow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10 text-white font-black uppercase tracking-[0.2em] text-sm md:text-base">
                {supportText}
            </span>
            
            {/* SUBTLE SCAN LINE (REFINED) */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
          </a>
        </div>
      </div>

      {/* Decorative System Label */}
      <div className="absolute -bottom-10 -left-10 text-[10rem] font-black text-white/5 uppercase select-none pointer-events-none mix-blend-overlay">
         CREATOR
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .group:hover .group-hover\\:animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </footer>
  );
}
