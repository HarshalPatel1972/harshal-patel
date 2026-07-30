"use client";

import React, { useState, useEffect, useRef } from "react";
import { profile } from "@/data/profile";
import { useLanguage } from "@/context/LanguageContext";
import { ScrollReveal } from "../ScrollReveal";

export function Contact() {
  const { language } = useLanguage();
  const currentProfile = profile[language as keyof typeof profile] || profile.en;
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(currentProfile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
    },
    {
      id: "bmc",
      label: (() => {
        switch (language) {
          case "ja": return "コーヒー";
          case "ko": return "커피";
          case "zh-tw": return "咖啡";
          case "hi": return "कॉफ़ी";
          case "fr": return "CAFÉ";
          case "id": return "KOPI";
          case "de": return "KAFFEE";
          case "it": return "CAFFÈ";
          case "pt-br": return "CAFÉ";
          case "es-419": return "CAFÉ";
          case "es": return "CAFÉ";
          case "eridian": return "COFFEE-PLACE";
          default: return "COFFEE";
        }
      })(),
      href: "https://www.buymeacoffee.com/harshalpatel"
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
        <div className="relative w-full max-w-7xl mt-12 mb-10 border-t border-b border-[var(--sumi-ink)]/10 flex flex-col md:flex-row flex-nowrap">
          {links.map((link, i) => {
            const isLast = i === links.length - 1;
            
            const getBgImage = (id: string) => {
              if (id === 'email') return 'linear-gradient(90deg, #4285f4 0%, #ea4335 33%, #fbbc04 66%, #34a853 100%)';
              if (id === 'github') return 'linear-gradient(90deg, #181717, #181717)';
              if (id === 'linkedin') return 'linear-gradient(90deg, #0A66C2, #0A66C2)';
              if (id === 'bmc') return 'linear-gradient(90deg, #FFDD00, #FFDD00)';
              return '';
            };

            const cellContent = (
              <span className="relative z-10 flex items-center justify-between w-full">
                <span 
                  className="text-[4rem] sm:text-[5rem] md:text-[2.5rem] lg:text-[3.5rem] xl:text-[4.5rem] font-black font-display uppercase tracking-tighter transition-all duration-500 ease-[cubic-bezier(0.2,0.9,0.3,1)] md:group-hover:-translate-y-2 pointer-events-auto leading-[0.9] text-left break-words overflow-visible text-transparent md:text-[var(--sumi-ink)] md:group-hover:text-transparent bg-clip-text [-webkit-background-clip:text] bg-cover bg-center"
                  style={{ backgroundImage: getBgImage(link.id) }}
                >
                  {copied && link.id === 'email' ? 'COPIED!' : link.label}
                </span>
                <svg className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 hidden md:block shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 text-[var(--forge-orange)] ml-2 lg:ml-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M7 17l9.2-9.2M17 17V7H7"/>
                </svg>
                <svg className="w-8 h-8 md:hidden shrink-0 opacity-100 transition-all duration-500 text-[var(--sumi-ink)] ml-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M7 17l9.2-9.2M17 17V7H7"/>
                </svg>
              </span>
            );

            const className = `relative flex-1 flex flex-col items-start justify-center p-6 md:p-6 lg:p-8 xl:p-12 overflow-hidden cursor-pointer group outline-none ${isLast ? '' : 'border-b md:border-b-0 md:border-r border-[var(--sumi-ink)]/10'}`;

            if (link.href) {
              return (
                <a 
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {cellContent}
                </a>
              );
            }

            return (
              <div key={link.id} onClick={link.onClick} className={className}>
                {cellContent}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
