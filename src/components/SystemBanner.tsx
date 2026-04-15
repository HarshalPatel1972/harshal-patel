"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export function SystemBanner({ isVisible, onDismiss }: { isVisible: boolean, onDismiss: () => void }) {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  const getNoticeText = () => {
    switch(language) {
      case 'ja': return "このポートフォリオは現在再設計中です。一部の機能が利用できない場合があります。ご不便をおかけしますが、ご了承ください。";
      case 'ko': return "이 포트폴리오는 현재 실시간 재설계 중입니다. 일부 기능을 일시적으로 사용할 수 없을 수 있습니다. 양해해 주셔서 감사합니다.";
      case 'zh-tw': return "此作品集目前正在進行實時重新設計。部分功能可能暫時無法使用。感謝您的耐心配合。";
      case 'fr': return "Ce portfolio fait actuellement l'objet d'une refonte en direct. Certaines fonctionnalités peuvent être temporairement indisponibles. Merci de votre patience.";
      case 'id': return "Portofolio ini sedang menjalani desain ulang secara langsung. Beberapa fitur mungkin tidak tersedia untuk sementara. Terima kasih atas kesabaran Anda.";
      case 'hi': return "यह पोर्टफोलियो वर्तमान में लाइव पुन: डिज़ाइन से गुजर रहा है। कुछ सुविधाएँ अस्थायी रूप से अनुपलब्ध हो सकती हैं। आपके धैर्य के लिए धन्यवाद।";
      case 'de': return "Dieses Portfolio wird derzeit einer umfassenden Neugestaltung unterzogen. Einige Funktionen können vorübergehend nicht verfügbar sein. Vielen Dank für Ihre Geduld.";
      case 'it': return "Questo portfolio è attualmente in fase di restyling dal vivo. Alcune funzioni potrebbero essere temporaneamente non disponibili. Grazie per la vostra pazienza.";
      case 'pt-br': return "Este portfólio está passando por uma reformulação ao vivo. Algumas funcionalidades podem estar temporariamente indisponíveis. Obrigado pela sua paciência.";
      case 'es-419': return "Este portafolio está pasando por un rediseño en vivo. Algunas funciones podrían no estar disponibles temporalmente. Gracias por su paciencia.";
      case 'es': return "Este portafolio está experimentando un rediseño en vivo. Algunas funciones podrían no estar disponibles temporalmente. Gracias por su paciencia.";
      case 'eridian': return "♩ HUMANS! WE MAKE REPAIRS. SOME DATA-STREAMS ARE RED. SORRY!";
      default: return "This portfolio is currently undergoing a live redesign. Some features may be temporarily unavailable. Thank you for your patience.";
    }
  };

  const getLabelText = () => {
    switch(language) {
      case 'ja': return "お知らせ";
      case 'ko': return "공지사항";
      case 'zh-tw': return "公告";
      case 'fr': return "AVIS";
      case 'id': return "PEMBERITAHUAN";
      case 'de': return "HINWEIS";
      case 'it': return "AVVISO";
      case 'pt-br': case 'es-419': case 'es': return "AVISO";
      case 'hi': return "सूचना";
      case 'eridian': return "SIGNAL-LOG";
      default: return "NOTICE";
    }
  };

  const getCloseText = () => {
    switch(language) {
      case 'ja': return "閉じる";
      case 'ko': return "닫기";
      case 'zh-tw': return "關閉";
      case 'fr': return "FERMER";
      case 'hi': return "बंद करें";
      case 'eridian': return "STOP-SIGNAL";
      default: return "CLOSE";
    }
  };

  const notice = getNoticeText();
  const label = getLabelText();

  // GLOBAL SLEEP MODE SIGNALING 💤
  useEffect(() => {
    if (isExpanded) {
      document.documentElement.classList.add('is-overlay-active');
    } else {
      document.documentElement.classList.remove('is-overlay-active');
    }
    return () => document.documentElement.classList.remove('is-overlay-active');
  }, [isExpanded]);

  return (
    <>
      <div className="fixed top-0 left-0 right-12 md:right-16 z-[200] bg-[var(--accent-blood)] border-b border-black/20 flex items-center h-9 md:h-10 px-4 shadow-[0_4px_12px_rgba(var(--accent-blood-rgb),0.3)] overflow-hidden">
        <div className="flex items-center gap-3 md:gap-4 flex-1 overflow-hidden h-full">
           {/* Brutalist Warning Label */}
           <div 
             onClick={() => setIsExpanded(true)}
             className="bg-white text-[var(--accent-blood)] text-[9px] md:text-[10px] font-black font-display tracking-widest px-2 py-0.5 uppercase shrink-0 flex items-center gap-1.5 z-10 shadow-lg cursor-pointer hover:bg-[var(--accent-blood)] hover:text-white transition-colors duration-300"
            >
             <span className="w-1.5 h-1.5 bg-[var(--accent-blood)] animate-pulse" />
              {label}
           </div>
           
           {/* Ticker Container - Trigger Overlay */}
           <div 
             onClick={() => setIsExpanded(true)}
             className="relative flex-1 overflow-hidden h-full flex items-center cursor-pointer group"
            >
             <div className="animate-marquee flex items-center gap-12 group-hover:[animation-play-state:paused]">
               <span className="font-mono text-[9px] md:text-[11px] text-white font-bold tracking-wide uppercase whitespace-nowrap drop-shadow-sm">
                  {notice}
               </span>
               <span className="font-mono text-[9px] md:text-[11px] text-white font-bold tracking-wide uppercase whitespace-nowrap drop-shadow-sm">
                  {notice}
               </span>
               <span className="font-mono text-[9px] md:text-[11px] text-white font-bold tracking-wide uppercase whitespace-nowrap drop-shadow-sm">
                  {notice}
               </span>
             </div>
           </div>
        </div>

        <div className="flex items-center pl-4 shrink-0 bg-[var(--accent-blood)] z-10">
          <button 
            onClick={onDismiss} 
            className="text-white/60 hover:text-white transition-colors font-mono text-xs md:text-sm px-2 shrink-0 font-black"
            aria-label="Dismiss system notice"
          >
            ✕
          </button>
        </div>
      </div>

      {/* THE CINEMATIC OVERLAY 🎬 */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 md:p-12 overflow-hidden">
            {/* Glass Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-lg"
            />

            {/* Brutalist Notice Card */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white border-8 border-black brutal-shadow-lg p-8 md:p-16 flex flex-col gap-8 md:gap-12 manga-cut-tr"
            >
               {/* Label Header */}
               <div className="flex items-center border-b-4 border-black pb-6 md:pb-8">
                  <div className="bg-[var(--accent-blood)] text-white font-black font-display text-xl md:text-3xl px-6 py-2 tracking-widest uppercase">
                    {label}
                  </div>
               </div>

               {/* Notice Body */}
               <div className="flex flex-col gap-6 md:gap-8">
                  <p className="text-2xl sm:text-4xl md:text-5xl font-black font-display uppercase leading-tight tracking-tight text-black">
                    {notice}
                  </p>
                  <div className="h-[2px] w-full bg-black/10" />
               </div>

               {/* Close Action */}
               <button 
                  onClick={() => setIsExpanded(false)}
                  className="group relative self-end mt-4 px-12 py-5 bg-black border-4 border-black hover:bg-[var(--accent-blood)] hover:border-[var(--accent-blood)] transition-all duration-300 manga-cut-bl"
               >
                  <span className="relative z-10 text-white font-black font-display text-xl md:text-2xl tracking-[0.2em] group-hover:tracking-[0.4em] transition-all">
                    {getCloseText()}
                  </span>
               </button>

               {/* Decorative Halftone Overlay */}
               <div className="absolute inset-0 halftone-bg opacity-5 pointer-events-none" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
