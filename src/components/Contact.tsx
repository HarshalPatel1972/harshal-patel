"use client";

import { useRef, useState, useEffect } from "react";
import { profile } from "@/data/profile";
import { ScrollReveal } from "./ScrollReveal";
import { animate as anime } from "animejs";
import { useLanguage } from "@/context/LanguageContext";
import { KineticLink } from "./ui/KineticLink";
import { useRouter } from "next/navigation";

const LINKS = {
  en: [
    { id: "email", label: "01 // EMAIL", value: "SEND MESSAGE", href: `mailto:${profile.en.email}` },
    { id: "github", label: "02 // GITHUB", value: "VIEW REPOSITORY", href: profile.en.github },
    { id: "linkedin", label: "03 // LINKEDIN", value: "VISIT PROFILE", href: profile.en.linkedin },
    { id: "feedback", label: "04 // FEEDBACK", values: ["SUBMIT REVIEW", "REPORT A BUG", "REQUEST FEATURE"], href: `mailto:${profile.en.email}?subject=Feedback` },
  ],
  ja: [
    { id: "email", label: "01 // メール", value: "メッセージを送信", href: `mailto:${profile.ja.email}` },
    { id: "github", label: "02 // GITHUB", value: "リポジトリを見る", href: profile.ja.github },
    { id: "linkedin", label: "03 // LINKEDIN", value: "プロフィールを見る", href: profile.ja.linkedin },
    { id: "feedback", label: "04 // フィードバック", values: ["感想を送る", "バグを報告", "機能リクエスト"], href: `mailto:${profile.ja.email}?subject=Feedback` },
  ],
  ko: [
    { id: "email", label: "01 // 이메일", value: "메시지 보내기", href: `mailto:${profile.ko.email}` },
    { id: "github", label: "02 // GITHUB", value: "저장소 보기", href: profile.ko.github },
    { id: "linkedin", label: "03 // LINKEDIN", value: "프로필 보기", href: profile.ko.linkedin },
    { id: "feedback", label: "04 // 피드백", values: ["의견 보내기", "버그 신고", "기능 요청"], href: `mailto:${profile.ko.email}?subject=Feedback` },
  ],
  "zh-tw": [
    { id: "email", label: "01 // 電子郵件", value: "發送消息", href: `mailto:${profile["zh-tw"].email}` },
    { id: "github", label: "02 // GITHUB", value: "查看存儲庫", href: profile["zh-tw"].github },
    { id: "linkedin", label: "03 // LINKEDIN", value: "訪問個人資料", href: profile["zh-tw"].linkedin },
    { id: "feedback", label: "04 // 反饋", values: ["提供意見", "報告錯誤", "功能請求"], href: `mailto:${profile["zh-tw"].email}?subject=Feedback` },
  ],
  hi: [
    { id: "email", label: "01 // ईमेल", value: "संदेश भेजें", href: `mailto:${profile.hi.email}` },
    { id: "github", label: "02 // GITHUB", value: "रिपॉजिटरी देखें", href: profile.hi.github },
    { id: "linkedin", label: "03 // LINKEDIN", value: "प्रोफ़ाइल देखें", href: profile.hi.linkedin },
    { id: "feedback", label: "04 // फीडबैक", values: ["प्रतिक्रिया दें", "बग रिपोर्ट करें", "सुविधा का अनुरोध"], href: `mailto:${profile.hi.email}?subject=Feedback` },
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
  ],
  de: [
    { id: "email", label: "01 // E-MAIL", value: "NACHRICHT SENDEN", href: `mailto:${profile.de.email}` },
    { id: "github", label: "02 // GITHUB", value: "REPOSITORIUM ANSEHEN", href: profile.de.github },
    { id: "linkedin", label: "03 // LINKEDIN", value: "PROFIL BESUCHEN", href: profile.de.linkedin },
  ],
  it: [
    { id: "email", label: "01 // E-MAIL", value: "INVIA MESSAGGIO", href: `mailto:${profile.it.email}` },
    { id: "github", label: "02 // GITHUB", value: "VEDI REPOSITORY", href: profile.it.github },
    { id: "linkedin", label: "03 // LINKEDIN", value: "VISITA PROFILO", href: profile.it.linkedin },
  ],
  "pt-br": [
    { id: "email", label: "01 // E-MAIL", value: "ENVIAR MENSAGEM", href: `mailto:${profile["pt-br"].email}` },
    { id: "github", label: "02 // GITHUB", value: "VER REPOSITÓRIO", href: profile["pt-br"].github },
    { id: "linkedin", label: "03 // LINKEDIN", value: "VISITAR PERFIL", href: profile["pt-br"].linkedin },
  ],
  "es-419": [
    { id: "email", label: "01 // E-MAIL", value: "ENVIAR MENSAJE", href: `mailto:${profile["es-419"].email}` },
    { id: "github", label: "02 // GITHUB", value: "VER REPOSITORIO", href: profile["es-419"].github },
    { id: "linkedin", label: "03 // LINKEDIN", value: "VISITAR PERFIL", href: profile["es-419"].linkedin },
  ],
  es: [
    { id: "email", label: "01 // E-MAIL", value: "ENVOJAR UN MENSAJE", href: `mailto:${profile.es.email}` },
    { id: "github", label: "02 // GITHUB", value: "VER REPOSITORIO", href: profile.es.github },
    { id: "linkedin", label: "03 // LINKEDIN", value: "VISITAR PERFIL", href: profile.es.linkedin },
  ],
  eridian: [
    { id: "email", label: "01 // SIGNAL-SEND", value: "MAKE NOISE TO HARSHAL", href: `mailto:${profile.eridian.email}` },
    { id: "github", label: "02 // CODE-PLACE", value: "LOOK AT BUGS", href: profile.eridian.github },
    { id: "linkedin", label: "03 // SUIT-PLACE", value: "SEE HUMAN SUIT", href: profile.eridian.linkedin },
    { id: "feedback", label: "04 // NOISE-REPORT", values: ["SEND VIBRATIONS", "FIX FREQUENCY", "WANT MORE NOISE"], href: `mailto:${profile.eridian.email}?subject=Feedback` },
  ]
};

interface LinkItem {
  id: string;
  label: string;
  value?: string;
  values?: string[];
  href: string;
}

export function Contact() {
  const { language } = useLanguage();
  const currentLinks = LINKS[language as keyof typeof LINKS] || LINKS.en;
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const [loopIdx, setLoopIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIdx(loopIdx);
      setIsGlitching(true);
      setTimeout(() => {
        setLoopIdx((prev) => (prev + 1) % 3);
        setIsGlitching(false);
      }, 400); // 400ms sharp slide
    }, 4000);
    return () => clearInterval(interval);
  }, [loopIdx, language]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (id === "email") {
      // Still prevent default for email to handle copy
      e.preventDefault();
      navigator.clipboard.writeText(profile[language as keyof typeof profile].email);
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
    } else if (id === "feedback") {
      e.preventDefault();
      const feedbackLink = currentLinks.find(l => l.id === "feedback") as LinkItem | undefined;
      const currentCategory = (feedbackLink?.values?.[loopIdx]) || "SUBMIT REVIEW";
      router.push(`/feedback?type=${encodeURIComponent(currentCategory)}`);
    }
  };

  const renderSlideText = (vals: string[]) => (
    <div className="relative group-hover:text-[var(--text-bone)] transition-colors duration-300 flex items-center h-full whitespace-nowrap">
       {isGlitching ? (
         <>
           {/* Old text sliding out left */}
           <div className="absolute inset-y-0 left-0 slide-out-left">
             {vals[prevIdx]}
           </div>
           {/* New text sliding in right */}
           <div className="relative slide-in-right">
             {vals[(prevIdx + 1) % 3]}
           </div>
         </>
       ) : (
         <div className="relative">
           {vals[loopIdx]}
         </div>
       )}
    </div>
  );

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
           <h2 className={`text-4xl md:text-8xl lg:text-9xl font-black text-[var(--bg-ink)] uppercase tracking-[-0.04em] leading-[0.8] mb-16 md:mb-24 border-b-8 border-black pb-8 ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
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
        <div className="flex flex-col gap-8 md:gap-12 pl-0 md:pl-24">
          {currentLinks.map((link: LinkItem, i: number) => {
            const isEmailCopied = copied && link.id === "email";
            const textValue = isEmailCopied ? (() => {
              switch(language) {
                case 'ja': return "コピー完了";
                case 'ko': return "이메일 복사됨";
                case 'zh-tw': return "電子郵件已複製";
                case 'fr': return "E-MAIL COPIÉ";
                case 'id': return "EMAIL DISALIN";
                case 'de': return "E-MAIL KOPIERT";
                case 'it': return "E-MAIL COPIATA";
                case 'pt-br':
                case 'es-419':
                case 'es': return "E-MAIL COPIADO";
                case 'hi': return "ईमेल कॉपी किया गया";
                case 'eridian': return "DATA-STORED-IN-BRAIN";
                default: return "EMAIL COPIED";
              }
            })() : link.value;

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
                        {link.id === "feedback" && link.values ? (
                           renderSlideText(link.values)
                        ) : (
                          textValue
                        )}
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
