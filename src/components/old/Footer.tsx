"use client";

import React from "react";
import Image from "next/image";
import { profile } from "@/data/profile";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { language } = useLanguage();
  const currentProfile = profile[language as keyof typeof profile] || profile.en;

  const initialText = language === 'hi' ? "काम पसंद आया?" : "Enjoy my designs?";
  const actionText = language === 'hi' ? "कॉफी पिलाएँ" : "Buy me a Coffee";

  return (
    <footer className="relative bg-[#050505] border-t-4 border-[#E8E8E6] text-[#E8E8E6] px-6 py-12 md:px-16 lg:px-24 overflow-hidden z-10">
      
      {/* Halftone Texture */}
      <div className="absolute inset-0 halftone-bg z-0 opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* LAYER 1 — Top of footer (matching V2 size & layout) */}
        <div className="pt-[60px] flex flex-col md:flex-row items-start justify-between relative min-h-[140px] gap-8">
          {/* Left: Large display text */}
          <div className="flex flex-col select-none">
            <span 
              className="text-[48px] font-black uppercase tracking-tight leading-none text-[#E8E8E6]/40"
              style={{ fontFamily: "var(--font-big-shoulders), sans-serif" }}
            >
              BUILT WITH
            </span>
            <span 
              className="text-[48px] font-black uppercase tracking-tight leading-none text-[#d91111]"
              style={{ fontFamily: "var(--font-big-shoulders), sans-serif" }}
            >
              OBSESSION.
            </span>
          </div>

        </div>

        {/* LAYER 2 — Middle (matching V2 grid and spacing) */}
        <div className="mt-10 pt-6 border-t border-[#E8E8E6]/15 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-4 relative z-10">
          
          {/* Left Column: Author info */}
          <div className="flex flex-col gap-1 items-start justify-start">
            <span className="text-xs font-bold font-mono uppercase tracking-[0.3em] text-[#E8E8E6]">
              {currentProfile.name.toUpperCase()}
            </span>
            <span className="text-[10px] font-mono text-[#E8E8E6]/50">
              © {new Date().getFullYear()} — Varanasi, India
            </span>
          </div>



        </div>

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
