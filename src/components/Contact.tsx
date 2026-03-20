"use client";

import { useRef, useState } from "react";
import { profile } from "@/data/profile";
import { ScrollReveal } from "./ScrollReveal";
import { animate as anime } from "animejs";
import { SubliminalKanji } from "./ui/SubliminalKanji";
import { useLanguage } from "@/context/LanguageContext";
import { KineticLink } from "./ui/KineticLink";

const LINKS = {
  en: [
    { id: "email", label: "01 // EMAIL", value: "SEND MESSAGE", href: `mailto:${profile.en.email}` },
    { id: "github", label: "02 // GITHUB", value: "VIEW REPOSITORY", href: profile.en.github },
    { id: "linkedin", label: "03 // LINKEDIN", value: "VISIT PROFILE", href: profile.en.linkedin },
  ],
  ja: [
    { id: "email", label: "01 // メール", value: "メッセージを送信", href: `mailto:${profile.ja.email}` },
    { id: "github", label: "02 // GITHUB", value: "リポジトリを見る", href: profile.ja.github },
    { id: "linkedin", label: "03 // LINKEDIN", value: "プロフィールを見る", href: profile.ja.linkedin },
  ],
  ko: [
    { id: "email", label: "01 // 이메일", value: "메시지 보내기", href: `mailto:${profile.ko.email}` },
    { id: "github", label: "02 // GITHUB", value: "저장소 보기", href: profile.ko.github },
    { id: "linkedin", label: "03 // LINKEDIN", value: "프로필 보기", href: profile.ko.linkedin },
  ],
  "zh-tw": [
    { id: "email", label: "01 // 電子郵件", value: "發送消息", href: `mailto:${profile["zh-tw"].email}` },
    { id: "github", label: "02 // GITHUB", value: "查看存儲庫", href: profile["zh-tw"].github },
    { id: "linkedin", label: "03 // LINKEDIN", value: "訪問個人資料", href: profile["zh-tw"].linkedin },
  ],
  hi: [
    { id: "email", label: "01 // ईमेल", value: "संदेश भेजें", href: `mailto:${profile.hi.email}` },
    { id: "github", label: "02 // GITHUB", value: "रिपॉजिटरी देखें", href: profile.hi.github },
    { id: "linkedin", label: "03 // LINKEDIN", value: "प्रोफ़ाइल देखें", href: profile.hi.linkedin },
  ],
  fr: [
    { id: "email", label: "01 // E-MAIL", value: "ENVOYER UN MESSAGE", href: `mailto:${profile.fr.email}` },
    { id: "github", label: "02 // GITHUB", value: "VOIR LE RÉPOSITORY", href: profile.fr.github },
    { id: "linkedin", label: "03 // LINKEDIN", value: "VISITER LE PROFIL", href: profile.fr.linkedin },
  ],
  id: [
    { id: "email", label: "01 // EMAIL", value: "KIRIM PESAN", href: `mailto:${profile.id.email}` },
    { id: "github", label: "02 // GITHUB", value: "LIHAT REPOSITORI", href: profile.id.github },
    { id: "linkedin", label: "03 // LINKEDIN", value: "KUNJUNGI PROFIL", href: profile.id.linkedin },
  ]
};

interface LinkItem {
  id: string;
  label: string;
  value: string;
  href: string;
}

export function Contact() {
  const { language } = useLanguage();
  const currentLinks = LINKS[language];
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (id === "email") {
      // Still prevent default for email to handle copy
      e.preventDefault();
      navigator.clipboard.writeText(profile[language].email);
      setCopied(true);

      const targetEl = e.currentTarget;
      
      // Brutalist shatter shake on copy
      anime(targetEl, {
        translateX: [
           { value: 10, duration: 50 },
           { value: -10, duration: 50 },
           { value: 10, duration: 50 },
           { value: 0, duration: 50 }
        ],
        easing: 'easeInOutSine'
      });

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <section 
      id="contact" 
      ref={containerRef}
      className="relative pt-[14px] md:pt-[78px] pb-[34px] md:pb-12 px-4 md:px-8 bg-white flex flex-col items-center overflow-hidden z-30 isolate transform-gpu
                 before:absolute before:-top-[150px] before:left-0 before:right-0 before:h-[150px] before:bg-white before:pointer-events-none"
    >
      {/* Halftone / Grain Texture Base */}
      <div className="absolute inset-0 halftone-bg z-0 opacity-[0.05] pointer-events-none invert mix-blend-multiply" />

      {/* Vertical Kanji Watermark */}
      <SubliminalKanji kanji="連絡" position="left" />

      {/* Massive Background Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none overflow-hidden z-0 opacity-5 select-none rotate-[-5deg]">
         <h2 className={`text-[6rem] md:text-[25rem] font-black whitespace-nowrap leading-none tracking-tighter ${language === 'hi' ? 'font-hindi' : 'font-display'} text-[var(--bg-ink)]`}>
            {language === 'en' ? "CONTACT" : language === 'ja' ? "連絡先" : language === 'ko' ? "연락처" : language === 'zh-tw' ? "聯繫方式" : language === 'fr' ? "CONTACT" : language === 'id' ? "KONTAK" : "संपर्क"}
         </h2>
      </div>

      <div className="w-full max-w-7xl relative flex flex-col pt-4 md:pt-12">
        
        {/* Header Block */}
        <ScrollReveal duration={1000}>
           <div className={`bg-black text-white font-black text-xs tracking-widest px-3 py-1 inline-block mb-4 ${language === 'hi' ? 'font-hindi' : 'font-mono'}`}>
             {language === 'en' ? 'CHAPTER 03' : language === 'ja' ? '第三章' : language === 'ko' ? '제 3 장' : language === 'zh-tw' ? '第三章' : language === 'fr' ? 'CHAPITRE 03' : language === 'id' ? 'BAB 03' : 'अध्याय 03'}
           </div>
           <h2 className={`text-4xl md:text-8xl lg:text-9xl font-black text-[var(--bg-ink)] uppercase tracking-[-0.04em] leading-[0.8] mb-16 md:mb-24 border-b-8 border-black pb-8 ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
             {language === 'en' ? <>INITIATE <br/> <span className="text-transparent" style={{ WebkitTextStroke: "2px var(--bg-ink)" }}>COMMUNICATION</span></> : language === 'ja' ? <>通信を<br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--bg-ink)" }}>開始する</span></> : language === 'ko' ? <>통신을<br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--bg-ink)" }}>시작하기</span></> : language === 'zh-tw' ? <>發起<br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--bg-ink)" }}>通信</span></> : language === 'fr' ? <>INITIER LA <br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--bg-ink)" }}>COMMUNICATION</span></> : language === 'id' ? <>MULAI <br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--bg-ink)" }}>KOMUNIKASI</span></> : <>संपर्क <br/><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--bg-ink)" }}>शुरू करें</span></>}
           </h2>
        </ScrollReveal>

        {/* Links Container */}
        <div className="flex flex-col gap-8 md:gap-12 pl-0 md:pl-24">
          {currentLinks.map((link: LinkItem, i: number) => {
            const isEmailCopied = copied && link.id === "email";
            const textValue = isEmailCopied ? (language === 'en' ? "EMAIL COPIED" : language === 'ja' ? "コピー完了" : language === 'ko' ? "이메일 복사됨" : language === 'zh-tw' ? "電子郵件已複製" : language === 'fr' ? "E-MAIL COPIÉ" : language === 'id' ? "EMAIL DISALIN" : "ईमेल कॉपी किया गया") : link.value;

            return (
              <ScrollReveal key={link.id} duration={1000} delay={i * 150} direction="left">
                <KineticLink
                  href={link.href}
                  target={link.id !== "email" ? "_blank" : undefined}
                  onClick={(e) => handleLinkClick(e, link.id)}
                  className="group relative block w-full outline-none"
                >
                  {/* Hover Slash Background */}
                  <div className="absolute top-0 bottom-0 left-[-20px] right-[-20%] bg-[var(--accent-blood)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.86,0,0.07,1)] z-0 brutal-shadow manga-cut-tr" />

                  <div className="relative z-10 flex flex-row items-center md:items-end justify-between border-b-4 border-black group-hover:border-transparent pb-4 transition-colors">
                    
                    <div>
                      <div className="text-xs sm:text-sm font-bold font-mono text-black/50 tracking-widest mb-2 group-hover:text-black/80 transition-colors">
                        {link.label}
                      </div>

                      <div className="text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-black font-display uppercase tracking-tighter text-[var(--bg-ink)] group-hover:text-[var(--text-bone)] transition-colors duration-300 pointer-events-none">
                        {textValue}
                      </div>
                    </div>

                    {/* Brutalist Arrow/CTA */}
                    <div className="flex shrink-0 w-[30px] h-[30px] md:w-16 md:h-16 bg-black text-white items-center justify-center brutal-shadow group-hover:bg-[var(--bg-ink)] group-hover:-rotate-45 transition-transform duration-300 origin-center self-end mb-0 md:mb-4 mr-[55px] md:mr-0">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
                         <path d="M5 12h14M12 5l7 7-7 7"/>
                       </svg>
                    </div>

                  </div>
                </KineticLink>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
