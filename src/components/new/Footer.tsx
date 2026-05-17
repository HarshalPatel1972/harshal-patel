"use client";

import { profile } from "@/data/profile";
import { useLanguage } from "@/context/LanguageContext";
import { useDesignVersion } from "../shared/DesignVersionContext";

export function Footer() {
  const { language } = useLanguage();
  const currentProfile = profile[language as keyof typeof profile] || profile.en;
  const { setDesignVersion } = useDesignVersion();

  // Translations for loop text
  const initialText = language === 'hi' ? "काम पसंद आया?" : "Enjoy my designs?";
  const actionText = language === 'hi' ? "कॉफी पिलाएँ" : "Buy me a Coffee";

  return (
    <footer className="relative bg-neutral-950 border-t border-white/[0.08] px-6 py-12 md:px-16 lg:px-24 overflow-hidden z-10">
      
      {/* Visual neon lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Brand Copyright */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-sm font-semibold tracking-wide text-white uppercase">
            {currentProfile.name}
          </span>
          <span className="text-xs text-neutral-500 font-mono">
            © {new Date().getFullYear()} — Varanasi, India
          </span>
        </div>

        {/* Dynamic design version toggle in footer */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setDesignVersion("old")}
            className="text-neutral-500 hover:text-cyan-400 text-xs font-mono tracking-widest uppercase transition-colors"
          >
            {language === 'hi' ? "क्लासिक व्यू पर जाएँ" : "SWITCH TO CLASSIC DESIGN"}
          </button>
        </div>

        {/* Looping Coffee Button */}
        <div className="relative group flex items-center justify-center w-full md:w-auto">
          <a 
            href="https://www.chai4.me/harshalpatel" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative flex items-center justify-center w-full md:w-[260px] h-[54px] bg-neutral-900 border border-white/10 hover:border-cyan-500/30 rounded-full overflow-hidden transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(6,182,212,0.2)] active:scale-95"
          >
            {/* The kinetic sliding container */}
            <div className="relative z-10 h-full w-full flex flex-col items-center animate-kinetic-loop">
              {/* STATE 1 */}
              <div className="h-full w-full flex-shrink-0 flex items-center justify-center text-white font-semibold font-sans uppercase tracking-wider text-xs md:text-sm">
                {initialText}
              </div>
              {/* STATE 2 */}
              <div className="h-full w-full flex-shrink-0 flex items-center justify-center text-cyan-400 font-semibold font-sans uppercase tracking-wider text-xs md:text-sm italic">
                {actionText}
              </div>
            </div>
          </a>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes kinetic-loop {
          0%, 40% { transform: translateY(0); }
          50%, 90% { transform: translateY(-100%); }
          100% { transform: translateY(-0%); }
        }
        .animate-kinetic-loop {
          animation: kinetic-loop 4.5s cubic-bezier(0.8, 0, 0.2, 1) infinite;
        }
      `}} />
    </footer>
  );
}
