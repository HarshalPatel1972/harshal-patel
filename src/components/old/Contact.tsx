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
  ],
  ja: [
    { id: "email", label: "メール", href: `mailto:${profile.ja.email}` },
    { id: "github", label: "GITHUB", href: profile.ja.github },
    { id: "linkedin", label: "LINKEDIN", href: profile.ja.linkedin },
  ],
  ko: [
    { id: "email", label: "이메일", href: `mailto:${profile.ko.email}` },
    { id: "github", label: "GITHUB", href: profile.ko.github },
    { id: "linkedin", label: "LINKEDIN", href: profile.ko.linkedin },
  ],
  "zh-tw": [
    { id: "email", label: "電子郵件", href: `mailto:${profile["zh-tw"].email}` },
    { id: "github", label: "GITHUB", href: profile["zh-tw"].github },
    { id: "linkedin", label: "LINKEDIN", href: profile["zh-tw"].linkedin },
  ],
  hi: [
    { id: "email", label: "ईमेल", href: `mailto:${profile.hi.email}` },
    { id: "github", label: "GITHUB", href: profile.hi.github },
    { id: "linkedin", label: "LINKEDIN", href: profile.hi.linkedin },
  ],
  fr: [
    { id: "email", label: "E-MAIL", href: `mailto:${profile.fr.email}` },
    { id: "github", label: "GITHUB", href: profile.fr.github },
    { id: "linkedin", label: "LINKEDIN", href: profile.fr.linkedin },
  ],
  id: [
    { id: "email", label: "EMAIL", href: `mailto:${profile.id.email}` },
    { id: "github", label: "GITHUB", href: profile.id.github },
    { id: "linkedin", label: "LINKEDIN", href: profile.id.linkedin },
  ],
  de: [
    { id: "email", label: "E-MAIL", href: `mailto:${profile.de.email}` },
    { id: "github", label: "GITHUB", href: profile.de.github },
    { id: "linkedin", label: "LINKEDIN", href: profile.de.linkedin },
  ],
  it: [
    { id: "email", label: "E-MAIL", href: `mailto:${profile.it.email}` },
    { id: "github", label: "GITHUB", href: profile.it.github },
    { id: "linkedin", label: "LINKEDIN", href: profile.it.linkedin },
  ],
  "pt-br": [
    { id: "email", label: "E-MAIL", href: `mailto:${profile["pt-br"].email}` },
    { id: "github", label: "GITHUB", href: profile["pt-br"].github },
    { id: "linkedin", label: "LINKEDIN", href: profile["pt-br"].linkedin },
  ],
  "es-419": [
    { id: "email", label: "E-MAIL", href: `mailto:${profile["es-419"].email}` },
    { id: "github", label: "GITHUB", href: profile["es-419"].github },
    { id: "linkedin", label: "LINKEDIN", href: profile["es-419"].linkedin },
  ],
  es: [
    { id: "email", label: "E-MAIL", href: `mailto:${profile.es.email}` },
    { id: "github", label: "GITHUB", href: profile.es.github },
    { id: "linkedin", label: "LINKEDIN", href: profile.es.linkedin },
  ],
  eridian: [
    { id: "email", label: "SIGNAL-SEND", href: `mailto:${profile.eridian.email}` },
    { id: "github", label: "CODE-PLACE", href: profile.eridian.github },
    { id: "linkedin", label: "SUIT-PLACE", href: profile.eridian.linkedin },
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
        <div className="flex flex-row flex-wrap justify-center gap-8 md:gap-16 w-full mt-12 mb-10">
          {currentLinks.map((link: LinkItem, i: number) => (
            <ScrollReveal key={link.id} duration={1000} delay={i * 150}>
               <ContactLinkItem 
                link={link} 
                language={language} 
                copied={copied} 
                setCopied={setCopied}
               />
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}

/**
 * CONTACT LINK ITEM - Surgical Interaction Logic 🧬
 */
function ContactLinkItem({ link, language, copied, setCopied }: any) {
  const [isHovered, setIsHovered] = useState(false);
  const isEmailCopied = copied && link.id === "email";

  const handleHover = (hovering: boolean) => {
    setIsHovered(hovering);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (id === "email") {
      e.preventDefault();
      navigator.clipboard.writeText(profile[language as keyof typeof profile].email);
      setCopied(true);
      const targetEl = e.currentTarget;
      anime(targetEl, {
        translateX: [{ value: 10, duration: 50 }, { value: -10, duration: 50 }, { value: 10, duration: 50 }, { value: 0, duration: 50 }],
        easing: 'easeInOutSine'
      });
      setTimeout(() => setCopied(false), 2000);
    }
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
    <KineticLink
      href={link.href}
      target={link.id !== "email" ? "_blank" : undefined}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleLinkClick(e, link.id)}
      className="relative block outline-none pointer-events-none group px-6 py-4 transition-transform duration-300 hover:scale-105"
    >
      {/* Hover Slash Background - Only reacts to isHovered */}
      <div 
        className="absolute top-0 bottom-0 left-0 right-0 bg-[var(--accent-blood)] origin-center transition-transform duration-500 ease-[cubic-bezier(0.86,0,0.07,1)] z-0 brutal-shadow manga-cut-tr" 
        style={{ transform: isHovered ? 'scaleY(1)' : 'scaleY(0)' }}
      />

      <div className="relative z-10 flex flex-row items-center justify-center transition-colors">
        
        {/* TEXT TRIGGER ZONE */}
        <div 
          className="pointer-events-auto cursor-pointer"
          onMouseEnter={() => handleHover(true)}
          onMouseLeave={() => handleHover(false)}
        >
          <div className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[6rem] font-black font-display uppercase tracking-tighter leading-none transition-colors duration-300 whitespace-nowrap" style={{ color: isHovered ? 'var(--text-bone)' : 'var(--bg-ink)' }}>
             {textValue}
          </div>
        </div>

      </div>
    </KineticLink>
  );
}
