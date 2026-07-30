"use client";

import { useRef, useState, useEffect } from "react";
import { profile } from "@/data/profile";
import { ScrollReveal } from "./ScrollReveal";
import { animate as anime } from "animejs";
import { useLanguage } from "@/context/LanguageContext";
import { KineticLink } from "../ui/KineticLink";
import { useRouter } from "next/navigation";

const LINKS = {
  en: [
    { id: "email", label: "EMAIL", href: `mailto:${profile.en.email}` },
    { id: "github", label: "GITHUB", href: profile.en.github },
    { id: "linkedin", label: "LINKEDIN", href: profile.en.linkedin },
    { id: "bmc", label: "COFFEE", href: "https://www.buymeacoffee.com/harshalpatel" },
  ],
  ja: [
    { id: "email", label: "メール", href: `mailto:${profile.ja.email}` },
    { id: "github", label: "GITHUB", href: profile.ja.github },
    { id: "linkedin", label: "LINKEDIN", href: profile.ja.linkedin },
    { id: "bmc", label: "コーヒー", href: "https://www.buymeacoffee.com/harshalpatel" },
  ],
  ko: [
    { id: "email", label: "이메일", href: `mailto:${profile.ko.email}` },
    { id: "github", label: "GITHUB", href: profile.ko.github },
    { id: "linkedin", label: "LINKEDIN", href: profile.ko.linkedin },
    { id: "bmc", label: "커피", href: "https://www.buymeacoffee.com/harshalpatel" },
  ],
  "zh-tw": [
    { id: "email", label: "電子郵件", href: `mailto:${profile["zh-tw"].email}` },
    { id: "github", label: "GITHUB", href: profile["zh-tw"].github },
    { id: "linkedin", label: "LINKEDIN", href: profile["zh-tw"].linkedin },
    { id: "bmc", label: "咖啡", href: "https://www.buymeacoffee.com/harshalpatel" },
  ],
  hi: [
    { id: "email", label: "ईमेल", href: `mailto:${profile.hi.email}` },
    { id: "github", label: "GITHUB", href: profile.hi.github },
    { id: "linkedin", label: "LINKEDIN", href: profile.hi.linkedin },
    { id: "bmc", label: "कॉफ़ी", href: "https://www.buymeacoffee.com/harshalpatel" },
  ],
  fr: [
    { id: "email", label: "E-MAIL", href: `mailto:${profile.fr.email}` },
    { id: "github", label: "GITHUB", href: profile.fr.github },
    { id: "linkedin", label: "LINKEDIN", href: profile.fr.linkedin },
    { id: "bmc", label: "CAFÉ", href: "https://www.buymeacoffee.com/harshalpatel" },
  ],
  id: [
    { id: "email", label: "EMAIL", href: `mailto:${profile.id.email}` },
    { id: "github", label: "GITHUB", href: profile.id.github },
    { id: "linkedin", label: "LINKEDIN", href: profile.id.linkedin },
    { id: "bmc", label: "KOPI", href: "https://www.buymeacoffee.com/harshalpatel" },
  ],
  de: [
    { id: "email", label: "E-MAIL", href: `mailto:${profile.de.email}` },
    { id: "github", label: "GITHUB", href: profile.de.github },
    { id: "linkedin", label: "LINKEDIN", href: profile.de.linkedin },
    { id: "bmc", label: "KAFFEE", href: "https://www.buymeacoffee.com/harshalpatel" },
  ],
  it: [
    { id: "email", label: "E-MAIL", href: `mailto:${profile.it.email}` },
    { id: "github", label: "GITHUB", href: profile.it.github },
    { id: "linkedin", label: "LINKEDIN", href: profile.it.linkedin },
    { id: "bmc", label: "CAFFÈ", href: "https://www.buymeacoffee.com/harshalpatel" },
  ],
  "pt-br": [
    { id: "email", label: "E-MAIL", href: `mailto:${profile["pt-br"].email}` },
    { id: "github", label: "GITHUB", href: profile["pt-br"].github },
    { id: "linkedin", label: "LINKEDIN", href: profile["pt-br"].linkedin },
    { id: "bmc", label: "CAFÉ", href: "https://www.buymeacoffee.com/harshalpatel" },
  ],
  "es-419": [
    { id: "email", label: "E-MAIL", href: `mailto:${profile["es-419"].email}` },
    { id: "github", label: "GITHUB", href: profile["es-419"].github },
    { id: "linkedin", label: "LINKEDIN", href: profile["es-419"].linkedin },
    { id: "bmc", label: "CAFÉ", href: "https://www.buymeacoffee.com/harshalpatel" },
  ],
  es: [
    { id: "email", label: "E-MAIL", href: `mailto:${profile.es.email}` },
    { id: "github", label: "GITHUB", href: profile.es.github },
    { id: "linkedin", label: "LINKEDIN", href: profile.es.linkedin },
    { id: "bmc", label: "CAFÉ", href: "https://www.buymeacoffee.com/harshalpatel" },
  ],
  eridian: [
    { id: "email", label: "SIGNAL-SEND", href: `mailto:${profile.eridian.email}` },
    { id: "github", label: "CODE-PLACE", href: profile.eridian.github },
    { id: "linkedin", label: "SUIT-PLACE", href: profile.eridian.linkedin },
    { id: "bmc", label: "COFFEE-PLACE", href: "https://www.buymeacoffee.com/harshalpatel" },
  ]
};

interface LinkItem {
  id: string;
  label: string;
  href: string;
}

export function Contact() {
  const { language } = useLanguage();
  const currentLinks = LINKS[language as keyof typeof LINKS] || LINKS.en;
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  return (
    <section 
      id="contact" 
      ref={containerRef}
      className="relative pt-8 md:pt-12 pb-[34px] md:pb-12 px-4 md:px-8 bg-white flex flex-col items-center overflow-hidden z-30 isolate transform-gpu"
    >
      {/* Halftone / Grain Texture Base */}
      <div className="absolute inset-0 halftone-bg z-0 opacity-[0.05] pointer-events-none invert mix-blend-multiply" />

      {/* Massive Background Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none overflow-hidden z-0 opacity-5 select-none rotate-[-5deg]">
         <h2 className={`text-[6rem] md:text-[25rem] font-black whitespace-nowrap leading-none tracking-tighter ${language === 'hi' ? 'font-hindi' : 'font-display'} text-[var(--bg-ink)]`}>
            {(() => {
              switch(language) {
                case 'ja': return "連絡先";
                case 'ko': return "연락처";
                case 'zh-tw': return "聯繫方式";
                case 'fr': return "CONTACT";
                case 'id': return "KONTAK";
                case 'de': return "KONTAKT";
                case 'it': return "CONTATTO";
                case 'pt-br': return "CONTATO";
                case 'es-419':
                case 'es': return "CONTACTO";
                case 'hi': return "संपर्क";
                case 'eridian': return "SEND-SIGNAL";
                default: return "CONTACT";
              }
            })()}
         </h2>
      </div>

      <div className="w-full max-w-7xl relative flex flex-col mt-[20px]">
        
        {/* Header Block */}
        <ScrollReveal duration={1000}>
           <div className={`bg-black text-white font-black text-xs tracking-widest px-3 py-1 inline-block mb-4 ${language === 'hi' ? 'font-hindi' : 'font-mono'}`}>
              {(() => {
                switch(language) {
                  case 'ja':
                  case 'zh-tw': return '第三章';
                  case 'ko': return '제 3 장';
                  case 'fr': return 'CHAPITRE 03';
                  case 'id': return 'BAB 03';
                  case 'de': return 'KAPITEL 03';
                  case 'it': return 'CAPITOLO 03';
                  case 'pt-br':
                  case 'es-419':
                  case 'es': return 'CAPÍTULO 03';
                  case 'hi': return 'अध्याय 03';
                  case 'eridian': return 'PART-THREE-THING';
                  default: return 'CHAPTER 03';
                }
              })()}
           </div>
           <h2 className={`text-[2rem] md:text-[6.8rem] lg:text-[7.65rem] font-black text-[var(--bg-ink)] uppercase tracking-[-0.04em] leading-[0.8] mb-8 md:mb-12 border-b-8 border-black pb-4 ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
             {(() => {
                switch(language) {
                  case 'ja': return <>通信を<br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--bg-ink)" }}>開始する</span></>;
                  case 'ko': return <>통신을<br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--bg-ink)" }}>시작하기</span></>;
                  case 'zh-tw': return <>發起<br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--bg-ink)" }}>通信</span></>;
                  case 'fr': return <>INITIER LA <br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--bg-ink)" }}>COMMUNICATION</span></>;
                  case 'id': return <>MULAI <br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--bg-ink)" }}>KOMUNIKASI</span></>;
                  case 'de': return <>KOMMUNIKATION <br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--bg-ink)" }}>EINLEITEN</span></>;
                  case 'it': return <>AVVIARE LA <br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--bg-ink)" }}>COMUNICAZIONE</span></>;
                  case 'pt-br': return <>INICIAR <br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--bg-ink)" }}>COMUNICÇÃO</span></>;
                  case 'es-419':
                  case 'es': return <>INICIAR <br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--bg-ink)" }}>COMUNICACIÓN</span></>;
                  case 'hi': return <>संपर्क <br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--bg-ink)" }}>शुरू करें</span></>;
                  case 'eridian': return <>MAKE NOISE <br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--bg-ink)" }}>TO HARSHAL NOW</span></>;
                  default: return <>INITIATE <br/> <span className="text-transparent" style={{ WebkitTextStroke: "2px var(--bg-ink)" }}>COMMUNICATION</span></>;
                }
             })()}
           </h2>
        </ScrollReveal>

        {/* Links Container */}
        <div className="flex flex-col md:flex-row flex-nowrap w-full mt-12 mb-10 border-t border-b border-[#e5e5e5]">
          {currentLinks.map((link: LinkItem, i: number) => (
             <ContactLinkItem 
              key={link.id}
              link={link} 
              language={language} 
              copied={copied} 
              setCopied={setCopied}
              isLast={i === currentLinks.length - 1}
             />
          ))}
        </div>

      </div>
    </section>
  );
}

function ContactLinkItem({ link, language, copied, setCopied, isLast }: any) {
  const isEmailCopied = copied && link.id === "email";

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (id === "email") {
      e.preventDefault();
      navigator.clipboard.writeText(profile[language as keyof typeof profile].email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getBgImage = (id: string) => {
    if (id === 'email') return 'linear-gradient(90deg, #4285f4 0%, #ea4335 33%, #fbbc04 66%, #34a853 100%)';
    if (id === 'github') return 'linear-gradient(90deg, #181717, #181717)';
    if (id === 'linkedin') return 'linear-gradient(90deg, #0A66C2, #0A66C2)';
    if (id === 'bmc') return 'linear-gradient(90deg, #FFDD00, #FFDD00)';
    return '';
  };

  const textValue = isEmailCopied ? (() => {
    switch(language) {
      case 'ja': return "コピー完了";
      case 'ko': return "이메일 복사됨";
      case 'zh-tw': return "電子郵件已複製";
      case 'fr': return "E-MAIL COPIÉ";
      case 'id': return "EMAIL DISALIN";
      case 'de': return "E-MAIL KOPIERT";
      case 'it': return "E-MAIL COPIATA";
      case 'hi': return "ईमेल कॉपी किया गया";
      case 'eridian': return "DATA-STORED-IN-BRAIN";
      default: return "COPIED!";
    }
  })() : link.label;

  return (
    <a
      href={link.href}
      target={link.id !== "email" ? "_blank" : undefined}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleLinkClick(e, link.id)}
      className={`relative flex-1 flex flex-col items-start justify-center p-6 md:p-6 lg:p-8 xl:p-12 overflow-hidden cursor-pointer group outline-none ${isLast ? '' : 'border-b md:border-b-0 md:border-r border-[#e5e5e5]'}`}
    >
      <span className="relative z-10 flex items-center justify-between w-full">
        <span 
          className="text-[4rem] sm:text-[5rem] md:text-[2.5rem] lg:text-[3.5rem] xl:text-[4.5rem] font-black font-display uppercase tracking-tighter transition-all duration-500 ease-[cubic-bezier(0.2,0.9,0.3,1)] md:group-hover:-translate-y-2 pointer-events-auto leading-[0.9] text-left break-words overflow-visible text-transparent md:text-[var(--bg-ink)] md:group-hover:text-transparent bg-clip-text [-webkit-background-clip:text] bg-cover bg-center"
          style={{ backgroundImage: getBgImage(link.id) }}
        >
          {textValue}
        </span>
        <svg className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 hidden md:block shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 text-[var(--accent-blood)] ml-2 lg:ml-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
          <path d="M7 17l9.2-9.2M17 17V7H7"/>
        </svg>
        <svg className="w-8 h-8 md:hidden shrink-0 opacity-100 transition-all duration-500 text-[var(--bg-ink)] ml-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
          <path d="M7 17l9.2-9.2M17 17V7H7"/>
        </svg>
      </span>
    </a>
  );
}
