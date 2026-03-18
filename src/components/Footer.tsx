"use client";

import { profile } from "@/data/profile";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { language } = useLanguage();
  const currentProfile = profile[language];

  return (
    <footer className="relative bg-[#050505] border-t-4 border-[var(--text-bone)] px-4 py-6 md:px-8">
      {/* Halftone / Grain Texture Base */}
      <div className="absolute inset-0 halftone-bg z-0 opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="text-sm md:text-base font-bold font-mono uppercase tracking-[0.3em] text-[var(--text-bone)]/60">
          {currentProfile.name} <span className="text-[var(--accent-blood)] ml-4">© {new Date().getFullYear()}</span>
        </div>
        {/* Empty space for layout balance */}
        <div className="hidden md:block" />
      </div>
    </footer>
  );
}
