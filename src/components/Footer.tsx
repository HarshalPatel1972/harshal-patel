"use client";

import { profile } from "@/data/profile";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { language } = useLanguage();
  const currentProfile = profile[language];

  // LOCALIZED KINETIC NARRATIVES ☕
  const initialText = language === 'hi' ? "काम पसंद आया?" : "Enjoy my work?";
  const hoverText = language === 'hi' ? "कॉफी पिलाएँ ☕" : "Buy me a Coffee ☕";

  return (
    <footer className="relative bg-[#050505] border-t-4 border-[var(--text-bone)] px-4 py-8 md:px-12 md:py-16 overflow-hidden">
      {/* Halftone / Grain Texture Base */}
      <div className="absolute inset-0 halftone-bg z-0 opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(217,17,17,0.05)_0%,transparent_70%)] opacity-60" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        <div className="flex flex-col gap-2">
            <div className="text-[16px] md:text-[24px] font-black font-display uppercase tracking-[-0.04em] text-[var(--text-bone)]">
                {currentProfile.name} <span className="text-[var(--accent-blood)] ml-4 opacity-80 decoration-slice">© {new Date().getFullYear()}</span>
            </div>
        </div>

        {/* KINETIC BRUTALIST COFFEE SUPPORT BUTTON ☕ */}
        <a 
          href="https://www.chai4.me/harshalpatel" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative h-[60px] md:h-[70px] px-8 md:px-12 bg-[var(--accent-blood)] border-4 border-black text-white font-black uppercase text-lg md:text-xl tracking-widest brutal-shadow hover:translate-x-[-4px] hover:translate-y-[-4px] md:hover:-translate-x-[64px] active:translate-x-0 active:translate-y-0 transition-all duration-300 overflow-hidden flex items-center justify-center md:-translate-x-[60px]"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative h-full w-full flex flex-col items-center transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full mobile-kinetic-loop">
            {/* INITIAL STATE 🏮 */}
            <div className={`h-full flex items-center justify-center whitespace-nowrap gap-3 ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4v-2z" />
              </svg>
              {initialText}
            </div>
            
            {/* HOVER REVEAL 📽️ */}
            <div className={`h-full absolute top-full left-0 right-0 flex items-center justify-center whitespace-nowrap gap-3 ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
              {hoverText}
            </div>
          </div>

          <div className="absolute -bottom-2 -right-2 w-full h-full border-4 border-black -z-10 bg-black/20" />
        </a>
      </div>

      {/* Decorative System Label */}
      <div className="absolute -bottom-10 -left-10 text-[10rem] font-black text-white/5 uppercase select-none pointer-events-none mix-blend-overlay">
         CREATOR
      </div>

      <style>{`
        @media (max-width: 768px) {
           .mobile-kinetic-loop {
              animation: mobile-text-slide 6s cubic-bezier(0.19, 1, 0.22, 1) infinite;
           }
        }
        @keyframes mobile-text-slide {
           0%, 40% { transform: translateY(0); }
           50%, 90% { transform: translateY(-100%); }
           100% { transform: translateY(0); }
        }
      `}</style>
    </footer>
  );
}
