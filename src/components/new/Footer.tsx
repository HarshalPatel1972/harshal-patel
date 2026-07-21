"use client";

import React from "react";
import Image from "next/image";
import { profile } from "@/data/profile";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { language } = useLanguage();
  const currentProfile = profile[language as keyof typeof profile] || profile.en;

  const enjoyText = (() => {
    switch (language) {
      case "ja": return "コーヒーをおごる";
      case "ko": return "커피 한 잔 사주기";
      case "zh-tw": return "請我喝杯咖啡";
      case "hi": return "कॉफी पिलाएँ";
      case "eridian": return "PROVIDE CAFFEINE";
      default: return "BUY ME A COFFEE";
    }
  })();

  return (
    <footer className="relative bg-[#0F0D0A] text-[#F0EDE8] px-6 py-12 md:px-16 lg:px-24 overflow-hidden z-10">
      
      {/* Decorative top border line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* LAYER 1 — Top of footer (padding-top: 60px) */}
        <div className="pt-[60px] flex flex-col md:flex-row items-start justify-between relative min-h-[140px] gap-8">
          {/* Left: Large display text */}
          <div className="flex flex-col select-none">
            <span 
              className="text-[48px] font-black uppercase tracking-tight leading-none text-[#8A7F72]/40"
              style={{ fontFamily: "var(--font-big-shoulders), sans-serif" }}
            >
              BUILT WITH
            </span>
            <span 
              className="text-[48px] font-black uppercase tracking-tight leading-none text-[#E8703A]"
              style={{ fontFamily: "var(--font-big-shoulders), sans-serif" }}
            >
              OBSESSION.
            </span>
          </div>

          {/* Right: The anime character (dim, saturate filter, height 200px, bleeding upward) */}
          <div className="absolute right-0 bottom-0 pointer-events-none z-0 hidden md:block">
            <Image
              src="/TOJI FUSHIGURO.png"
              alt="Toji Fushiguro in the studio"
              width={300}
              height={200}
              className="h-[200px] w-auto object-contain filter brightness-[0.85] transform translate-y-[24px]"
            />
          </div>
        </div>

        {/* LAYER 2 — Middle (margin-top: 40px, padding-top: 24px, border-top: 1px solid rgba(255,255,255,0.06)) */}
        <div className="mt-10 pt-6 border-t border-white/6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-4 relative z-10">
          
          {/* Left Column: Author info */}
          <div className="flex flex-col gap-1 items-start justify-start">
            <span 
              className="text-xs font-bold uppercase tracking-[0.3em] text-[#F0EDE8]"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              {currentProfile.name.toUpperCase()}
            </span>
            <span 
              className="text-[10px] text-[#8A7F72]"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              © {new Date().getFullYear()} — Varanasi, India
            </span>
          </div>

          {/* Right Column: Coffee pill */}
          <div className="flex flex-col gap-6 items-start md:items-end justify-start">
            
            {/* Coffee Pill Button */}
            <a 
              href="https://www.chai4.me/harshalpatel" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-[#E8703A] text-[#0F0D0A] font-semibold text-xs rounded-full px-6 py-2.5 hover:bg-white hover:text-[#0F0D0A] transition-all uppercase tracking-wider text-center"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
              {enjoyText}
            </a>

          </div>

        </div>

      </div>
    </footer>
  );
}
