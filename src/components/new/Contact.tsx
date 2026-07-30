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

  // Localized contact options inside window panes
  const links = [
    {
      id: "email",
      label: (() => {
        switch (language) {
          case "ja": return "01 · メール";
          case "ko": return "01 · 이메일";
          case "zh-tw": return "01 · 電子郵件";
          case "hi": return "01 · ईमेल";
          case "eridian": return "01 · SIGNAL-SEND";
          default: return "01 · EMAIL";
        }
      })(),
      value: currentProfile.email,
      desc: (() => {
        switch (language) {
          case "ja": return copied ? "コピー完了" : "クリックしてアドレスをコピー";
          case "hi": return copied ? "कॉपी हो गया!" : "क्लिक करके ईमेल कॉपी करें";
          case "eridian": return copied ? "DATA-STORED-IN-BRAIN" : "TAP TO BROADCAST SIGNAL";
          default: return copied ? "EMAIL COPIED" : "Click to Copy Address";
        }
      })(),
      onClick: handleCopyEmail
    },
    {
      id: "github",
      label: (() => {
        switch (language) {
          case "ja": return "02 · GITHUB";
          case "ko": return "02 · GITHUB";
          case "zh-tw": return "02 · GITHUB";
          case "hi": return "02 · GITHUB";
          case "eridian": return "02 · CODE-PLACE";
          default: return "02 · GITHUB";
        }
      })(),
      value: "github.com/HarshalPatel1972",
      desc: (() => {
        switch (language) {
          case "ja": return "リポジトリを見る";
          case "hi": return "कोड बेस देखें";
          case "eridian": return "LOOK AT BUGS";
          default: return "Explore Source Repositories";
        }
      })(),
      href: currentProfile.github
    },
    {
      id: "linkedin",
      label: (() => {
        switch (language) {
          case "ja": return "03 · LINKEDIN";
          case "ko": return "03 · LINKEDIN";
          case "zh-tw": return "03 · LINKEDIN";
          case "hi": return "03 · LINKEDIN";
          case "eridian": return "03 · SUIT-PLACE";
          default: return "03 · LINKEDIN";
        }
      })(),
      value: "linkedin.com/in/harshal-patel",
      desc: (() => {
        switch (language) {
          case "ja": return "プロフィールを見る";
          case "hi": return "नेटवर्क से जुड़ें";
          case "eridian": return "SEE HUMAN SUIT";
          default: return "Connect Professionally";
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
        <div className="relative w-full max-w-7xl mt-12 flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left: Contact rows */}
          <div className="w-full z-10">
            <ScrollReveal duration={1000} direction="left">
              <div className="flex flex-col w-full border-b border-[#8A7F72]/20 pr-12 md:pr-20">
                {links.map((link, idx) => {
                  const separator = link.label.includes(" · ") ? " · " : " — ";
                  const displayLabel = link.label.split(separator)[0];
                  const labelSuffix = link.label.split(separator)[1];

                  const cellContent = (
                    <div
                      className="relative py-7 flex flex-row items-center justify-between group cursor-pointer border-t border-[#8A7F72]/20 transition-all select-none text-left w-full gap-4"
                    >
                      {/* Left: Text Content Area */}
                      <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-2 md:gap-6 -translate-x-[20px]">
                        {/* Index & Label */}
                        <div className="flex items-center gap-2 shrink-0 md:w-44">
                          <span 
                            className="text-[11px] font-bold font-mono uppercase tracking-wider"
                            style={{ color: "var(--blueprint-blue)", fontFamily: "var(--font-jetbrains-mono), monospace" }}
                          >
                            {displayLabel}
                          </span>
                          <span className="text-[#8A7F72]/40 font-mono text-[11px] font-bold">·</span>
                          <span 
                            className="text-[11px] font-bold font-mono uppercase tracking-wider text-[var(--muted-label)]"
                            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                          >
                            {labelSuffix}
                          </span>
                        </div>

                        {/* Main Address / Value */}
                        <div className="flex-1 min-w-0">
                          <h4 
                            className="text-xl sm:text-2xl md:text-3xl font-black font-display uppercase tracking-tight text-[var(--sumi-ink)] group-hover:text-[var(--forge-orange)] transition-colors whitespace-nowrap"
                            style={{ fontFamily: "var(--font-big-shoulders), sans-serif" }}
                          >
                            <span>{link.value}</span>
                          </h4>
                        </div>

                        {/* Description */}
                        <div className="md:px-4 shrink-0">
                          <span 
                            className="text-[13px] font-medium transition-colors text-[var(--muted-label)] group-hover:text-[var(--sumi-ink)]"
                            style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                          >
                            {link.desc}
                          </span>
                        </div>
                      </div>

                      {/* Right: Square Arrow Button */}
                      <div className="shrink-0 flex items-center justify-center">
                        <div
                          className="w-10 h-10 bg-[var(--forge-orange)] text-white flex items-center justify-center transition-transform duration-300 group-hover:-rotate-45"
                          style={{ borderRadius: "0px" }}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );

                  if (link.href) {
                    return (
                      <a 
                        key={link.id}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                      >
                        {cellContent}
                      </a>
                    );
                  }

                  return (
                    <div key={link.id} onClick={link.onClick} className="block w-full">
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
