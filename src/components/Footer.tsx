"use client";

import { profile } from "@/data/profile";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { language } = useLanguage();
  const currentProfile = profile[language];

  return (
    <footer className="relative bg-[#050505] border-t-8 border-[var(--text-bone)] px-4 py-[2px] md:px-8">
      {/* Halftone / Grain Texture Base */}
      <div className="absolute inset-0 halftone-bg z-0 opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="text-xl md:text-3xl font-black font-display uppercase tracking-widest text-[var(--text-bone)]">
          {currentProfile.name} <span className="text-[var(--accent-blood)]">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
