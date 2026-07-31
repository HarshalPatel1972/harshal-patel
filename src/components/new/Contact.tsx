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
      sub: "CHAPTER 03",
      desc: "Reach out to discuss system architecture, Go/TypeScript optimizations, or collaborative opportunities.",
      watermark: "CONTACT"
    },
    ja: {
      sub: "第三章",
      desc: "システムアーキテクチャ、Go/TypeScriptの最適化、またはコラボレーションの機会についてお気軽にご連絡ください。",
      watermark: "連絡先"
    },
    ko: {
      sub: "제 3 장",
      desc: "시스템 아키텍첲, Go/TypeScript 최적화 또는 협업 기회에 대해 논의하려면 연락하십시오.",
      watermark: "연락처"
    },
    "zh-tw": {
      sub: "第三章",
      desc: "隨時聯繫以討論系統架構、Go/TypeScript 優化或合作機會。",
      watermark: "聯繫方式"
    },
    hi: {
      sub: "अध्याय 03",
      desc: "सिस्टम आर्किटेक्चर, Go/TypeScript अनुकूलन, या सहयोग के अवसरों पर चर्चा करने के लिए संपर्क करें।",
      watermark: "संपर्क"
    },
    eridian: {
      sub: "PART-THREE-THING",
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


          </ScrollReveal>
        </div>

        {/* Option A layout row container */}
        <div className="relative w-full max-w-7xl mt-12 mb-10 border-t border-b border-[var(--sumi-ink)]/10 flex flex-col md:flex-row flex-nowrap">
          {links.map((link, i) => {
            const isLast = i === links.length - 1;
            
            const ContactIcon = ({ id, className }: { id: string, className?: string }) => {
              if (id === 'email') return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="52 42 88 66" className={className}>
                  <path fill="currentColor" className="group-hover:text-[#4285f4] transition-colors duration-500" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
                  <path fill="currentColor" className="group-hover:text-[#34a853] transition-colors duration-500" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
                  <path fill="currentColor" className="group-hover:text-[#fbbc04] transition-colors duration-500" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
                  <path fill="currentColor" className="group-hover:text-[#ea4335] transition-colors duration-500" d="M72 74V48l24 18 24-18v26L96 92" />
                  <path fill="currentColor" className="group-hover:text-[#c5221f] transition-colors duration-500" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
                </svg>
              );
              if (id === 'github') return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
                  <path fill="currentColor" className="group-hover:text-[#181717] transition-colors duration-500" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              );
              if (id === 'linkedin') return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
                  <path fill="currentColor" className="group-hover:text-[#0A66C2] transition-colors duration-500" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              );
              if (id === 'bmc') return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
                  <path fill="currentColor" className="group-hover:text-[#FFDD00] transition-colors duration-500" d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 01-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 00-1.322-.238c-.826 0-1.491.284-2.26.613z"/>
                </svg>
              );
              return null;
            };

            const cellContent = (
              <span className="relative z-10 flex items-center justify-between w-full">
                <span className="flex items-center gap-3 lg:gap-4 transition-all duration-500 ease-[cubic-bezier(0.2,0.9,0.3,1)] md:group-hover:-translate-y-2 pointer-events-auto text-[3rem] sm:text-[4rem] md:text-[1.8rem] lg:text-[2.2rem] xl:text-[3rem]">
                  <ContactIcon id={link.id} className="w-[0.9em] h-[0.9em] shrink-0 text-[var(--sumi-ink)]" />
                  <span className="font-black font-display uppercase tracking-tighter leading-[0.9] text-left break-words overflow-visible text-[var(--sumi-ink)] group-hover:opacity-80 transition-opacity">
                    {copied && link.id === 'email' ? 'COPIED!' : link.label}
                  </span>
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
