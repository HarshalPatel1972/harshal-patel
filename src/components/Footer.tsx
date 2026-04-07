"use client";

import { profile } from "@/data/profile";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export function Footer() {
  const { language } = useLanguage();
  const currentProfile = profile[language];

  // RECOGNIZABLE BRANDING ☕
  const supportText = language === 'hi' ? "कॉफी पिलाएँ" : language === 'eridian' ? "BUY-COFFEE" : "Buy me a Coffee";

  return (
    <footer className="relative bg-[#050505] border-t-4 border-[var(--text-bone)] px-4 py-8 md:px-12 md:py-24 overflow-hidden">
      {/* Halftone / Grain Texture Base */}
      <div className="absolute inset-0 halftone-bg z-0 opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,var(--accent-blood-alpha)_0%,transparent_80%)] opacity-40" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
        <div className="flex flex-col gap-2">
            <div className="text-[14px] md:text-[20px] font-black font-display uppercase tracking-[0.1em] text-[var(--text-bone)]/80">
                {currentProfile.name} <span className="text-[var(--accent-blood)] ml-4 opacity-100 italic">© {new Date().getFullYear()}</span>
            </div>
        </div>

        {/* THE SOFT AURA PORTAL 🕯️ */}
        <div className="relative group flex items-center justify-center w-full md:w-auto">
          
          {/* THE BREATHING AURA (CALMING EFFECT) */}
          <motion.div 
            initial={{ opacity: 0.3, scale: 1 }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1] 
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 bg-[var(--accent-blood)] blur-[100px] rounded-full pointer-events-none group-hover:bg-[var(--accent-blood)] transition-colors duration-1000" 
          />

          <a 
            href="https://www.chai4.me/harshalpatel" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative flex items-center justify-center w-full md:w-[320px] h-[60px] md:h-[75px] bg-[var(--text-bone)] border border-black/5 overflow-hidden transition-all duration-1000 ease-in-out group-hover:shadow-[0_0_50px_rgba(var(--accent-blood-rgb),0.2)]"
          >
            <span className="relative z-10 text-[var(--bg-ink)] font-black font-display uppercase tracking-[0.4em] text-[10px] md:text-xs">
                {supportText}
            </span>

            {/* A GENTLE LIGHT SWEEP (NON-TERMINAL) */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms] pointer-events-none" />
          </a>
        </div>
      </div>

      {/* Decorative System Label */}
      <div className="absolute -bottom-10 -left-10 text-[10rem] font-black text-white/5 uppercase select-none pointer-events-none mix-blend-overlay">
         CREATOR
      </div>
    </footer>
  );
}
