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
    <footer className="relative bg-[#000000] border-t-4 border-[#FFFFFF] px-4 py-8 md:px-12 md:py-24 overflow-hidden">
      {/* Halftone Texture (Pure White/Black) */}
      <div className="absolute inset-0 halftone-bg z-0 opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
        <div className="flex flex-col gap-2">
            <div className="text-[14px] md:text-[20px] font-black font-display uppercase tracking-[0.1em] text-[#FFFFFF]">
                {currentProfile.name} <span className="text-[#d91111] ml-4 italic">© {new Date().getFullYear()}</span>
            </div>
        </div>

        {/* THE 4-COLOR KINETIC PORTAL (RED/CYAN/BLACK/WHITE) 🏮 */}
        <div className="relative group flex items-center justify-center w-full md:w-auto">
          
          {/* THE PURE RADIATION (CYAN/RED PULSE) */}
          <motion.div 
            animate={{ 
              boxShadow: [
                "0 0 20px #d91111",
                "0 0 40px #0ee0c3",
                "0 0 20px #d91111"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-none pointer-events-none" 
          />

          <a 
            href="https://www.chai4.me/harshalpatel" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative flex items-center justify-center w-full md:w-[320px] h-[60px] md:h-[75px] bg-[#000000] border-2 border-[#d91111] overflow-hidden transition-all duration-300 hover:border-[#0ee0c3] brutal-shadow"
          >
            {/* THE LOOPING CONTENT */}
            <div className="relative z-10 h-full w-full flex flex-col items-center animate-kinetic-loop">
                {/* STATE 1: ENJOY MY DESIGNS? */}
                <div className="h-full min-h-[60px] md:min-h-[75px] flex items-center justify-center text-[#FFFFFF] font-black font-display uppercase tracking-[0.2em] text-[10px] md:text-xs">
                    {initialText}
                </div>
                {/* STATE 2: BUY ME A COFFEE */}
                <div className="h-full min-h-[60px] md:min-h-[75px] flex items-center justify-center text-[#0ee0c3] font-black font-display uppercase tracking-[0.2em] text-[10px] md:text-xs italic">
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
          0%, 45% { transform: translateY(0); }
          50%, 95% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .animate-kinetic-loop {
          animation: kinetic-loop 6s cubic-bezier(0.87, 0, 0.13, 1) infinite;
        }
      `}</style>
    </footer>
  );
}
