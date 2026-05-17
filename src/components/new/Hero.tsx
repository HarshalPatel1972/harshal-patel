"use client";

import React, { useMemo } from "react";
import { profile } from "@/data/profile";
import { useLanguage } from "@/context/LanguageContext";
import { useMagnetic } from "../AnimationKit";

export function Hero() {
  const { language } = useLanguage();
  const currentProfile = profile[language as keyof typeof profile] || profile.en;
  
  const cta1Ref = useMagnetic<HTMLAnchorElement>(0.15);
  const cta2Ref = useMagnetic<HTMLAnchorElement>(0.15);

  const introStages = {
    en: "I find what's broken and build what's missing.",
    ja: "壊れたものを見つけ、足りないものを創る。",
    ko: "망가진 것을 찾아내어 부족한 것을 채웁니다.",
    "zh-tw": "找出破碎之處，構築公理與缺失之事。",
    hi: "मैं ढूंढता हूँ जो टूटा है, और बनाता हूँ जो गायब है।",
    fr: "Je trouve ce qui est brisé et je construis ce qui manque.",
    id: "Saya menemukan apa yang rusak dan membangun apa yang hilang.",
    de: "Ich finde, was kaputt ist, und baue, was fehlt.",
    it: "Trovo ciò che è rotto e costruisco ciò che manca.",
    "pt-br": "Eu encontro o que está quebrado e construo o que falta.",
    "es-419": "Encuentro lo que está roto y construyo lo que falta.",
    es: "Encuentro lo que está roto y construyo lo que falta.",
    eridian: "♩ FIND BROKE-THING. BUILD NEW-THING. AMAZE! ♩"
  };

  const introText = introStages[language as keyof typeof introStages] || introStages.en;

  // Split name for high-end styling
  const nameParts = useMemo(() => {
    const fullName = currentProfile.name || "Harshal Patel";
    const parts = fullName.split(" ");
    return {
      first: parts[0] || "Harshal",
      last: parts.slice(1).join(" ") || "Patel"
    };
  }, [currentProfile.name]);

  return (
    <section 
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-6 md:px-16 lg:px-24 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white z-10"
    >
      {/* Premium Atmospheric Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.07)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.05)_0%,transparent_50%)] pointer-events-none" />
      
      {/* Floating Animated Ambient Dust/Grid */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] pointer-events-none" />
      
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Text and Core Info */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6 md:space-y-8">
          
          {/* Available Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-wider uppercase animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            {language === 'en' ? "Available for Opportunities" 
             : language === 'ja' ? "仕事の依頼を受付中" 
             : language === 'ko' ? "업무 의뢰 가능" 
             : language === 'zh-tw' ? "開放合作機會" 
             : language === 'eridian' ? "READY FOR NEW MISSION" 
             : "अवसरों के लिए उपलब्ध"}
          </div>

          {/* Interactive Glowing Name */}
          <div className="space-y-1">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
              {nameParts.first}
            </h1>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500">
              {nameParts.last}
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-neutral-400 font-sans font-light tracking-wide max-w-xl">
            {currentProfile.tagline}
          </p>

          {/* Divider with subtle design */}
          <div className="w-20 h-[2px] bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full" />

          {/* Intro quote statement */}
          <blockquote className="text-base md:text-lg text-neutral-300 italic border-l-2 border-cyan-500/50 pl-4 py-1 max-w-lg font-light leading-relaxed">
            "{introText}"
          </blockquote>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
            <a 
              ref={cta1Ref}
              href="#projects" 
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 rounded-xl text-black font-semibold text-center tracking-wider uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(6,182,212,0.25)] hover:shadow-[0_8px_30px_rgba(6,182,212,0.4)] active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10">
                {language === 'en' ? "View Projects" : language === 'ja' ? "実績を見る" : language === 'eridian' ? "VIEW-WORKS" : "प्रोजेक्ट्स देखें"}
              </span>
            </a>
            <a 
              ref={cta2Ref}
              href="#contact" 
              className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-xl text-neutral-300 hover:text-white font-semibold text-center tracking-wider uppercase transition-all duration-300 active:scale-95"
            >
              {language === 'en' ? "Get in Touch" : language === 'ja' ? "連絡する" : language === 'eridian' ? "SEND-SIGNAL" : "संपर्क करें"}
            </a>
          </div>

        </div>

        {/* Right Side: Futuristic Telemetry & Glassmorphic Data Panel */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="w-full max-w-md aspect-square rounded-3xl p-8 bg-neutral-900/40 border border-white/[0.06] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden group">
            
            {/* Corner glowing vector */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-cyan-500/30 transition-colors duration-500" />
            
            <div className="space-y-6">
              
              {/* Telemetry Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">System Telemetry</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
              </div>

              {/* Stack items */}
              <div className="space-y-4 font-mono text-xs text-neutral-400">
                <div className="p-3.5 bg-white/[0.02] border border-white/[0.04] rounded-xl flex justify-between items-center hover:border-cyan-500/20 hover:bg-white/[0.04] transition-all duration-300">
                  <span className="text-white">🎓 EDUCATION</span>
                  <span className="text-right text-[10px] text-cyan-400">Chandigarh Univ.</span>
                </div>
                
                <div className="p-3.5 bg-white/[0.02] border border-white/[0.04] rounded-xl space-y-2 hover:border-cyan-500/20 hover:bg-white/[0.04] transition-all duration-300">
                  <div className="flex justify-between items-center text-white">
                    <span>⚡ CORE COMPETENCY</span>
                    <span className="text-[10px] text-violet-400">OPTIMIZED</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 flex justify-between">
                    <span>Latency Constraint:</span>
                    <span className="text-cyan-400 font-bold">&lt; 200ms</span>
                  </div>
                </div>

                <div className="p-3.5 bg-white/[0.02] border border-white/[0.04] rounded-xl space-y-3 hover:border-cyan-500/20 hover:bg-white/[0.04] transition-all duration-300">
                  <span className="text-white">🚀 SKILL ENGINE POWER</span>
                  <div className="space-y-2.5">
                    {[
                      { name: "Go / Systems", pct: 92 },
                      { name: "TypeScript / React", pct: 90 },
                      { name: "WASM / Optimization", pct: 85 }
                    ].map((sk, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[9px] text-neutral-500">
                          <span>{sk.name}</span>
                          <span>{sk.pct}%</span>
                        </div>
                        <div className="w-full h-1 bg-neutral-950 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full" 
                            style={{ width: `${sk.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Down arrow scroll helper */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none opacity-60">
        <span className="text-[9px] font-mono tracking-widest uppercase">Scroll Down</span>
        <svg className="w-4 h-4 animate-bounce text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

    </section>
  );
}
