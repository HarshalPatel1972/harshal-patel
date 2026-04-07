"use client";

import { profile } from "@/data/profile";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { language } = useLanguage();
  const currentProfile = profile[language];

  // LOCALIZED KINETIC NARRATIVES ☕
  const initialText = language === 'hi' ? "काम पसंद आया?" : language === 'eridian' ? "LIKE THIS?" : "Enjoy my work?";
  const hoverText = language === 'hi' ? "कॉफी पिलाएँ ☕" : language === 'eridian' ? "BUY ME COFFEE ☕" : "Buy me a Coffee ☕";

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

        {/* INNOVATIVE "VOID-FRAGMENT" COFFEE PORTAL ☕ */}
        <div className="relative group">
          {/* THE AURA GLOW (trigger on hover) */}
          <div className="absolute inset-[-40px] bg-[var(--accent-blood)] opacity-0 group-hover:opacity-10 blur-[60px] transition-opacity duration-700 pointer-events-none" />
          
          <a 
            href="https://www.chai4.me/harshalpatel" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative flex items-center justify-center w-[280px] h-[70px] bg-black border-2 border-white/10 overflow-hidden brutal-shadow transition-all duration-500 hover:border-[var(--accent-blood)]"
          >
            {/* THE FREQUENCY SCAN LINE 📡 */}
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
               <div className="w-full h-[2px] bg-[var(--accent-blood)] shadow-[0_0_15px_var(--accent-blood)] absolute top-0 left-0 animate-frequency-scan opacity-0 group-hover:opacity-100" />
            </div>

            {/* DIGITAL SHUTTER BACKGROUND 🎞️ */}
            <div className="absolute inset-0 flex flex-col z-0">
               <div className="flex-1 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] mobile-shutter-loop-left" />
               <div className="flex-1 bg-white translate-x-[100%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] delay-75 mobile-shutter-loop-right" />
            </div>

            {/* CONTENT LAYER */}
            <div className="relative z-20 flex items-center justify-center w-full h-full px-6 overflow-hidden">
                <div className="flex flex-col items-center justify-center h-full transition-transform duration-500 group-hover:-translate-y-full mobile-content-loop">
                   {/* IDLE STATE */}
                   <div className="h-full flex items-center gap-3 text-white font-black uppercase tracking-[0.2em] text-sm">
                      <span className="w-2 h-2 bg-[var(--accent-blood)] rounded-full animate-pulse" />
                      {initialText}
                   </div>
                   {/* ACTION STATE */}
                   <div className="h-full absolute top-full flex items-center gap-3 text-black font-black uppercase tracking-[0.2em] text-sm italic">
                      {hoverText}
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4v-2z" />
                      </svg>
                   </div>
                </div>
            </div>

          </a>
        </div>
      </div>

      {/* Decorative System Label */}
      <div className="absolute -bottom-10 -left-10 text-[10rem] font-black text-white/5 uppercase select-none pointer-events-none mix-blend-overlay">
         CREATOR
      </div>

      <style>{`
        @keyframes frequency-scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        .animate-frequency-scan {
          animation: frequency-scan 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @media (max-width: 768px) {
           /* AUTO-ANIMATE ON MOBILE TO SHOWCASE INNOVATION WITHOUT HOVER */
           .animate-frequency-scan {
              opacity: 0.5 !important;
              animation-duration: 3s;
           }
           
           @keyframes shutter-left-loop {
              0%, 45% { transform: translateX(-100%); }
              50%, 95% { transform: translateX(0); }
           }
           @keyframes shutter-right-loop {
              0%, 50% { transform: translateX(100%); }
              55%, 95% { transform: translateX(0); }
           }
           @keyframes content-slide-loop {
              0%, 50% { transform: translateY(0); }
              55%, 95% { transform: translateY(-100%); }
           }

           .mobile-shutter-loop-left { animation: shutter-left-loop 8s infinite ease-in-out; }
           .mobile-shutter-loop-right { animation: shutter-left-loop 8s infinite ease-in-out; animation-delay: 0.1s; }
           .mobile-content-loop { animation: content-slide-loop 8s infinite ease-in-out; }
        }
      `}</style>
    </footer>
  );
}
