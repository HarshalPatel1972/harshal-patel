"use client";

import React, { useState, useEffect, useRef } from "react";
import { profile } from "@/data/profile";
import { useLanguage } from "@/context/LanguageContext";
import { ScrollReveal } from "../ScrollReveal";

export function Contact() {
  const { language } = useLanguage();
  const currentProfile = profile[language as keyof typeof profile] || profile.en;
  const [copied, setCopied] = useState(false);

  // Mouse tracking state for window-pane radial glows
  const [mouseCoords, setMouseCoords] = useState<{ x: number; y: number } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(currentProfile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMouseCoords({ x, y });
  };

  // Localized Titles
  const titleData = {
    en: {
      sub: "CHAPTER 03 · INITIATE TRANSMISSION",
      desc: "Reach out to discuss system architecture, Go/TypeScript optimizations, or collaborative opportunities.",
      watermark: "CONTACT"
    },
    ja: {
      sub: "第三章 · 通信を開始する",
      desc: "システムアーキテクチャ、Go/TypeScriptの最適化、またはコラボレーションの機会についてお気軽にご連絡ください。",
      watermark: "連絡先"
    },
    ko: {
      sub: "제 3 장 · 통신을 시작하기",
      desc: "시스템 아키텍첲, Go/TypeScript 최적화 또는 협업 기회에 대해 논의하려면 연락하십시오.",
      watermark: "연락처"
    },
    "zh-tw": {
      sub: "第三章 · 發起通信",
      desc: "隨時聯繫以討論系統架構、Go/TypeScript 優化或合作機會。",
      watermark: "聯繫方式"
    },
    hi: {
      sub: "अध्याय 03 · संपर्क शुरू करें",
      desc: "सिस्टम आर्किटेक्चर, Go/TypeScript अनुकूलन, या सहयोग के अवसरों पर चर्चा करने के लिए संपर्क करें।",
      watermark: "संपर्क"
    },
    eridian: {
      sub: "PART-THREE-THING — MAKE NOISE TO HARSHAL NOW",
      desc: "MAKE WAVES. DO NOT SILENCE.",
      watermark: "SEND-SIGNAL"
    }
  };

  const t = titleData[language as keyof typeof titleData] || titleData.en;

  // Localized contact options
  const links = [
    {
      id: "email",
      label: (() => {
        switch (language) {
          case "ja": return "メール";
          case "ko": return "이메일";
          case "zh-tw": return "電子郵件";
          case "hi": return "ईमेल";
          case "eridian": return "SIGNAL-SEND";
          default: return "EMAIL";
        }
      })(),
      onClick: handleCopyEmail
    },
    {
      id: "github",
      label: (() => {
        switch (language) {
          case "ja": return "GITHUB";
          case "ko": return "GITHUB";
          case "zh-tw": return "GITHUB";
          case "hi": return "GITHUB";
          case "eridian": return "CODE-PLACE";
          default: return "GITHUB";
        }
      })(),
      href: currentProfile.github
    },
    {
      id: "linkedin",
      label: (() => {
        switch (language) {
          case "ja": return "LINKEDIN";
          case "ko": return "LINKEDIN";
          case "zh-tw": return "LINKEDIN";
          case "hi": return "LINKEDIN";
          case "eridian": return "SUIT-PLACE";
          default: return "LINKEDIN";
        }
      })(),
      href: currentProfile.linkedin
    }
  ];

  return (
    <section
      id="contact"
      className="relative py-24 px-6 md:px-16 lg:px-24 blueprint-grid-warm text-[var(--sumi-ink)] z-10 overflow-hidden"
    >
      {/* Embossed Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none overflow-hidden z-0 select-none rotate-[-4deg]">
        <h2
          className="text-[6rem] sm:text-[12rem] md:text-[20rem] font-black tracking-tighter uppercase font-display text-transparent"
          style={{
            WebkitTextStroke: "1px rgba(138, 127, 114, 0.08)",
            textShadow: "1px 1px 1px rgba(255, 255, 255, 0.4), -1px -1px 1px rgba(0, 0, 0, 0.15)",
          }}
        >
          {t.watermark}
        </h2>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-16 space-y-4">
          <ScrollReveal duration={800}>
            <div
              className="inline-block mb-4 bg-[var(--sumi-ink)] text-[var(--studio-warm)] font-bold text-xs tracking-widest px-3 py-1 font-mono uppercase"
            >
              {t.sub}
            </div>
            
            <h2
              className="text-[2.2rem] sm:text-[4rem] md:text-[6rem] lg:text-[7rem] font-black uppercase tracking-[-0.04em] leading-[0.9] font-display text-[var(--sumi-ink)]"
            >
              {(() => {
                switch (language) {
                  case "ja": return <>通信を<br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--forge-orange)" }}>開始する</span></>;
                  case "ko": return <>통신을<br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--forge-orange)" }}>시작하기</span></>;
                  case "zh-tw": return <>發起<br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--forge-orange)" }}>通信</span></>;
                  case "hi": return <>संपर्क<br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--forge-orange)" }}>शुरू करें</span></>;
                  case "eridian": return <>MAKE NOISE<br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--forge-orange)" }}>TO HARSHAL NOW</span></>;
                  default: return <>INITIATE<br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--forge-orange)" }}>COMMUNICATION</span></>;
                }
              })()}
            </h2>

            <p className="text-[var(--muted-label)] text-sm md:text-base font-light leading-relaxed max-w-xl mt-4">
              {t.desc}
            </p>
          </ScrollReveal>
        </div>

        {/* Option A layout row container */}
        <div className="relative w-full max-w-7xl mt-12 flex flex-col items-start">
          
          <div className="w-full z-10">
            <ScrollReveal duration={1000} direction="left">
              <div className="flex flex-row flex-wrap items-center gap-8 md:gap-16 w-full">
                {links.map((link, idx) => {
                  const cellContent = (
                    <div
                      className="group cursor-pointer flex items-center transition-all select-none"
                    >
                      <h4 
                        className="text-4xl sm:text-5xl md:text-7xl font-black font-display uppercase tracking-tight text-[var(--sumi-ink)] group-hover:text-[var(--forge-orange)] transition-colors whitespace-nowrap"
                        style={{ fontFamily: "var(--font-big-shoulders), sans-serif" }}
                      >
                        {copied && link.id === 'email' ? 'COPIED!' : link.label}
                      </h4>
                    </div>
                  );

                  if (link.href) {
                    return (
                      <a 
                        key={link.id}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        {cellContent}
                      </a>
                    );
                  }

                  return (
                    <div key={link.id} onClick={link.onClick} className="inline-block">
                      {cellContent}
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
}
