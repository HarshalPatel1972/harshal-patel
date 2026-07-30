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
        <div className="flex flex-row flex-nowrap w-full mt-12 mb-10 border-t border-b border-[#e5e5e5]">
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

  const getLogo = (id: string, color: string) => {
    if (id === 'email') return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" color={color}><path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" /><rect x="3" y="5" width="18" height="14" rx="2" /></svg>;
    if (id === 'github') return <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor" color={color}><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>;
    if (id === 'linkedin') return <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor" color={color}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
    return null;
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
      className={`relative flex-1 flex items-center justify-center py-10 md:py-16 overflow-hidden cursor-pointer group outline-none ${isLast ? '' : 'border-r border-[#e5e5e5]'}`}
    >
      <div className="absolute left-0 w-full h-full top-[100%] group-hover:top-0 transition-all duration-500 ease-[cubic-bezier(0.2,0.9,0.3,1)] z-0 flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center p-4 opacity-15 scale-125">
           {getLogo(link.id, 'var(--accent-blood)')}
        </div>
      </div>
      <span className="relative z-10 text-[2rem] md:text-[3rem] lg:text-[4rem] font-black font-display uppercase tracking-tighter text-[var(--bg-ink)] transition-all duration-500 ease-[cubic-bezier(0.2,0.9,0.3,1)] group-hover:text-[var(--accent-blood)] group-hover:-translate-y-2 pointer-events-auto">
        {textValue}
      </span>
    </a>
  );
}
