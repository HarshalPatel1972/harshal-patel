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
            
            const getLogo = (id: string) => {
              if (id === 'email') return <svg preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full object-cover opacity-25 md:opacity-40" viewBox="0 0 24 24" fill="none" stroke="#D44638" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" /><rect x="3" y="5" width="18" height="14" rx="2" /></svg>;
              if (id === 'github') return <svg preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full object-cover opacity-25 md:opacity-40" viewBox="0 0 24 24" fill="#181717"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>;
              if (id === 'linkedin') return <svg preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full object-cover opacity-25 md:opacity-40" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
              return null;
            };

            const cellContent = (
              <>
                <div className="absolute left-0 w-full h-full top-0 md:top-[100%] md:group-hover:top-0 transition-all duration-500 ease-[cubic-bezier(0.2,0.9,0.3,1)] z-0 flex items-center justify-center pointer-events-none">
                  {getLogo(link.id)}
                </div>
                <span className="relative z-10 text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] font-black font-display uppercase tracking-tighter text-[var(--sumi-ink)] transition-all duration-500 ease-[cubic-bezier(0.2,0.9,0.3,1)] md:group-hover:text-[var(--forge-orange)] md:group-hover:-translate-y-2 pointer-events-auto leading-none">
                  {copied && link.id === 'email' ? 'COPIED!' : link.label}
                </span>
              </>
            );

            const className = `relative flex-1 flex items-center justify-center py-12 md:py-20 overflow-hidden cursor-pointer group outline-none ${isLast ? '' : 'border-b md:border-b-0 md:border-r border-[var(--sumi-ink)]/10'}`;

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
