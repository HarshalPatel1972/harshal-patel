"use client";

import { profile } from "@/data/profile";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { language } = useLanguage();
  const currentProfile = profile[language];

  return (
    <footer className="relative bg-[#050505] border-t border-[var(--text-bone)]/10 px-4 py-3 md:px-8">
      {/* Halftone / Grain Texture Base */}
      <div className="absolute inset-0 halftone-bg z-0 opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="text-xs md:text-xs font-bold font-mono uppercase tracking-[0.4em] text-[var(--text-bone)]/50">
          {currentProfile.name} <span className="text-[var(--accent-blood)] ml-4 opacity-80">© {new Date().getFullYear()}</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
           <div className="text-[9px] font-mono text-[var(--text-bone)]/30 tracking-widest uppercase">
              REDACTED ACCESS GATEWAY 06.01.2024
           </div>
        </div>
      </div>
    </footer>
  );
}
