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
        <span className="flex items-center gap-3 lg:gap-4 transition-all duration-500 ease-[cubic-bezier(0.2,0.9,0.3,1)] md:group-hover:-translate-y-2 pointer-events-auto">
          <ContactIcon id={link.id} className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 shrink-0 text-[var(--bg-ink)]" />
          <span className="text-[3rem] sm:text-[4rem] md:text-[1.8rem] lg:text-[2.2rem] xl:text-[3rem] font-black font-display uppercase tracking-tighter leading-[0.9] text-left break-words overflow-visible text-[var(--bg-ink)] group-hover:opacity-80 transition-opacity">
            {textValue}
          </span>
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
