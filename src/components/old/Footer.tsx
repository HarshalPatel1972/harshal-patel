"use client";

import { profile } from "@/data/profile";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export function Footer() {
  const { language } = useLanguage();
  const currentProfile = profile[language];

  // KINETIC LOOP TEXT ☕
  const initialText = language === 'hi' ? "काम पसंद आया?" : "Enjoy my designs?";
  const actionText = language === 'hi' ? "कॉफी पिलाएँ" : "Buy me a Coffee";

  return (
    <footer className="relative bg-[#000000] border-t-4 border-[#FFFFFF] px-4 py-4 md:px-12 md:py-6 overflow-hidden">
      {/* Halftone Texture (Pure White/Black) */}
      <div className="absolute inset-0 halftone-bg z-0 opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-center gap-8 md:gap-12 relative z-10">
        <div className="flex flex-col gap-2 text-center md:text-left">
            <div className="text-[12px] md:text-[14px] font-black font-display uppercase tracking-[0.1em] text-[#FFFFFF] opacity-50">
                {currentProfile.name} <span className="text-[#d91111] ml-4 italic">© {new Date().getFullYear()}</span>
            </div>
        </div>

        {/* THE 4-COLOR KINETIC PORTAL (RED/CYAN/BLACK/WHITE) 🏮 */}
        <div className="relative group flex items-center justify-center w-full md:w-auto">

          <a 
            href="https://www.chai4.me/harshalpatel" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative flex items-center justify-center w-full md:w-[260px] h-[50px] md:h-[60px] bg-[#000000] border-2 border-[#FFFFFF] overflow-hidden transition-all duration-300 hover:border-[var(--accent-cursed)] shadow-[4px_4px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            {/* THE LOOPING CONTENT - FIXED HEIGHT ALIGNMENT */}
            <div className="relative z-10 h-full w-full flex flex-col items-center animate-kinetic-loop">
                {/* STATE 1: ENJOY MY DESIGNS? */}
                <div className="h-full w-full flex-shrink-0 flex items-center justify-center text-[#FFFFFF] font-black font-display uppercase tracking-[0.2em] text-xs md:text-lg">
                    {initialText}
                </div>
                {/* STATE 2: BUY ME A COFFEE */}
                <div className="h-full w-full flex-shrink-0 flex items-center justify-center text-[var(--accent-cursed)] font-black font-display uppercase tracking-[0.2em] text-xs md:text-lg italic">
                    {actionText}
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
        @keyframes kinetic-loop {
          0%, 40% { transform: translateY(0); }
          50%, 90% { transform: translateY(-100%); }
          100% { transform: translateY(-0%); }
        }
        .animate-kinetic-loop {
          animation: kinetic-loop 5s cubic-bezier(0.8, 0, 0.2, 1) infinite;
        }
      `}</style>
    </footer>
  );
}
