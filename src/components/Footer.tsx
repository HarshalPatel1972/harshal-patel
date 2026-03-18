"use client";

import { profile } from "@/data/profile";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { language } = useLanguage();
  const currentProfile = profile[language];

  return (
    <footer className="relative bg-[#050505] border-t border-[var(--text-bone)]/10 px-4 py-6 md:px-8">
      {/* Halftone / Grain Texture Base */}
      <div className="absolute inset-0 halftone-bg z-0 opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        <div className="text-[16px] md:text-[19px] font-bold font-mono uppercase tracking-[0.4em] text-[var(--text-bone)]/40">
          {currentProfile.name} <span className="text-[var(--accent-blood)] ml-4 opacity-80">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
