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

  const firstWord = currentProfile.name.split(" ")[0] || "Harshal";
  const remainingWords = currentProfile.name.split(" ").slice(1).join(" ") || "Patel";

  const availableText = (() => {
    switch (language) {
      case "ja": return "AVAILABLE FOR OPPORTUNITIES // 仕事受付中";
      case "ko": return "AVAILABLE FOR OPPORTUNITIES // 의뢰 가능";
      case "zh-tw": return "AVAILABLE FOR OPPORTUNITIES // 合作開放";
      case "hi": return "AVAILABLE FOR OPPORTUNITIES // उपलब्ध";
      case "eridian": return "MISSION STATUS // READY";
      default: return "AVAILABLE FOR OPPORTUNITIES // ACTIVE";
    }
  })();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-20 px-6 md:px-16 lg:px-24 blueprint-grid-warm text-[var(--sumi-ink)] z-10"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Name and Tagline */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6 md:space-y-8">
          
          {/* Amber Folder Tag Shape */}
          <div
            className="inline-block px-5 py-2 text-white font-bold select-none relative animate-pulse shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
            style={{
              background: "var(--forge-orange)",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              clipPath: "polygon(0 0, 88% 0, 100% 100%, 0 100%)",
            }}
          >
            {availableText}
          </div>

          {/* Title - Split Typography */}
          <div className="space-y-1">
            <h1
              className="uppercase leading-[0.85] font-black"
              style={{
                fontSize: "clamp(3.5rem, 11vw, 7.8rem)",
                fontFamily: "var(--font-big-shoulders), sans-serif",
                letterSpacing: "-0.04em",
                color: "var(--sumi-ink)",
              }}
            >
              {firstWord}
            </h1>
            <h1
              className="uppercase leading-[0.85] font-black"
              style={{
                fontSize: "clamp(3.5rem, 11vw, 7.8rem)",
                fontFamily: "var(--font-big-shoulders), sans-serif",
                letterSpacing: "-0.04em",
                color: "transparent",
                WebkitTextStroke: "2px var(--forge-orange)",
              }}
            >
              {remainingWords}
            </h1>
          </div>

          {/* Studio open since annotation */}
          <div
            className="text-[10px] uppercase tracking-[0.25em]"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--blueprint-blue)",
              fontWeight: 700,
            }}
          >
            {"// STUDIO_OPEN_SINCE 2022"}
          </div>

          {/* Tagline */}
          <p
            className="text-lg md:text-xl leading-relaxed max-w-xl font-light"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "var(--sumi-ink)",
              opacity: 0.9,
            }}
          >
            {currentProfile.tagline}
          </p>



          {/* CTAs styled for a drafting board feel */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4 pointer-events-auto">
            <a
              ref={cta1Ref}
              href="#projects"
              className="group relative flex items-center justify-center min-w-[180px] md:min-w-[200px] select-none transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
              style={{
                background: "var(--forge-orange)",
                border: "1px solid var(--forge-orange)",
              }}
            >
              <div className="relative z-10 px-5 py-3.5 md:px-7 md:py-4.5">
                <span
                  className="text-white font-bold text-xs uppercase tracking-[0.2em]"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  {language === 'en' ? "View Work" : language === 'ja' ? "実績を見る" : language === 'eridian' ? "VIEW-WORKS" : "कार्य देखें"}
                </span>
              </div>
            </a>
            
            <a
              ref={cta2Ref}
              href="#contact"
              className="group relative flex items-center justify-center min-w-[180px] md:min-w-[200px] select-none transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                border: "1px dashed var(--sumi-ink)",
                background: "transparent",
              }}
            >
              <div className="relative z-10 px-5 py-3.5 md:px-7 md:py-4.5">
                <span
                  className="font-bold text-xs uppercase tracking-[0.2em] transition-colors group-hover:text-[var(--forge-orange)]"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    color: "var(--sumi-ink)",
                  }}
                >
                  {language === 'en' ? "Contact" : language === 'ja' ? "連絡する" : language === 'eridian' ? "SEND-SIGNAL" : "संपर्क करें"}
                </span>
              </div>
            </a>
          </div>

        </div>

        {/* Right Side: Tactile Dossier & Sketch Plan */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div
            className="w-full max-w-sm rounded-lg p-8 relative overflow-hidden flex flex-col justify-between aspect-[3/4]"
            style={{
              background: "var(--aged-paper)",
              boxShadow: "0 10px 40px rgba(15,13,10,0.12), inset 0 0 0 1px rgba(138,127,114,0.15)",
            }}
          >
            {/* Accent color top-strip */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--forge-orange)]" />

            {/* Folder tab indicator */}
            <div
              className="absolute top-0 right-8 h-4 w-24"
              style={{
                background: "var(--muted-label)",
                opacity: 0.15,
                clipPath: "polygon(10px 0, 80px 0, 90px 100%, 0 100%)",
              }}
            />

            {/* Corner paper pins */}
            {["top-2 left-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos) => (
              <div
                key={pos}
                className={`absolute w-2 h-2 rounded-full ${pos}`}
                style={{ background: "rgba(138,127,114,0.4)" }}
              />
            ))}

            <div className="space-y-6">
              {/* Card Header */}
              <div className="flex justify-between items-center border-b border-[var(--muted-label)]/20 pb-4">
                <span
                  className="text-[9px] font-bold tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace", color: "var(--blueprint-blue)" }}
                >
                  SYSTEM_DRAFT_NO_04
                </span>
                <span className="h-2 w-2 rounded-full bg-[var(--forge-orange)] animate-ping" />
              </div>

              {/* Blueprint Schematic Traces */}
              <div className="relative h-28 w-full border border-dashed border-[var(--muted-label)]/30 rounded flex items-center justify-center overflow-hidden bg-white/20">
                <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="card-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="var(--blueprint-blue)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#card-grid)" />
                  {/* Schematic circles and vectors */}
                  <circle cx="50" cy="56" r="30" fill="none" stroke="var(--forge-orange)" strokeWidth="1.5" />
                  <circle cx="150" cy="56" r="18" fill="none" stroke="var(--blueprint-blue)" strokeWidth="1" />
                  <path d="M 80 56 L 132 56" stroke="var(--forge-orange)" strokeWidth="1.2" strokeDasharray="3,3" />
                  <path d="M 50 15 L 50 40" stroke="var(--blueprint-blue)" strokeWidth="1" />
                  <path d="M 150 15 L 150 38" stroke="var(--blueprint-blue)" strokeWidth="1" />
                </svg>
                <div
                  className="text-[12px] uppercase tracking-wider font-bold z-10"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace", color: "var(--sumi-ink)" }}
                >
                  // LATENCY_MAP_OK
                </div>
              </div>

              {/* Data specifications */}
              <div className="space-y-4 font-mono text-[11px] text-[var(--sumi-ink)] opacity-85">
                <div className="flex justify-between items-center py-1.5 border-b border-dashed border-[var(--muted-label)]/15">
                  <span className="font-bold">ENGINEER:</span>
                  <span style={{ color: "var(--forge-orange)" }}>{currentProfile.name.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-dashed border-[var(--muted-label)]/15">
                  <span className="font-bold">LATENCY:</span>
                  <span style={{ color: "var(--blueprint-blue)" }}>SUB_200MS_TARGET</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="font-bold">ORIGIN:</span>
                  <span>CU_ALUMNI_NET</span>
                </div>
              </div>
            </div>

            {/* Stamp indicator */}
            <div className="mt-8 pt-4 border-t border-[var(--muted-label)]/25 flex justify-between items-center">
              <div
                className="text-[9px] tracking-wider uppercase font-bold"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace", color: "var(--muted-label)" }}
              >
                STATUS_VERIFIED
              </div>
              {/* Circular Stamp */}
              <div
                className="relative border-2 border-dashed border-[#E8703A]/80 text-[#E8703A] rounded-full w-[72px] h-[72px] flex flex-col items-center justify-center transform -rotate-8 select-none p-1 shrink-0"
                style={{ fontFamily: "var(--font-dm-serif), serif" }}
              >
                <div className="border border-[#E8703A]/40 rounded-full w-full h-full flex flex-col items-center justify-center">
                  <span className="text-[6px] uppercase tracking-tighter leading-none mb-0.5" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>VERIFIED</span>
                  <span className="text-[8px] font-black leading-none tracking-tight uppercase">STUDIO</span>
                  <span className="text-[8px] font-black leading-none tracking-tight uppercase mt-0.5">APPROVED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Tactile Workbench Measuring Tape Bottom Edge */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 flex items-center justify-between border-t border-[var(--muted-label)]/30 pointer-events-none"
        style={{
          background: "var(--aged-paper)",
        }}
      >
        <div
          className="w-full h-full opacity-40"
          style={{
            backgroundImage: `
              repeating-linear-gradient(90deg, var(--sumi-ink) 0px, var(--sumi-ink) 1px, transparent 1px, transparent 8px),
              repeating-linear-gradient(90deg, var(--sumi-ink) 0px, var(--sumi-ink) 2px, transparent 2px, transparent 40px)
            `,
            backgroundPosition: "0 0, 0 0",
            backgroundSize: "100% 8px, 100% 16px",
            backgroundRepeat: "repeat-x",
          }}
        />
      </div>

    </section>
  );
}
