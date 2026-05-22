"use client";

import { useState, useEffect } from "react";
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

  return (
    <>
      {/* Top Glass Ticker Strip */}
      <div className="fixed top-0 left-0 right-12 md:right-16 z-[95] bg-[var(--aged-paper)] border-b border-[var(--sumi-ink)]/15 flex items-center h-9 px-4">
        <div className="flex items-center gap-3 flex-1 overflow-hidden h-full">
          
          {/* Tag / Badge */}
          <div 
            onClick={() => setIsExpanded(true)}
            className="bg-[var(--forge-orange)] text-[var(--sumi-ink)] text-[9px] font-mono tracking-widest font-black px-2.5 py-0.5 rounded-sm cursor-pointer transition-transform duration-300 hover:scale-105 animate-pulse shadow-sm shadow-[var(--forge-orange)]/10"
          >
            {label}
          </div>
          
          {/* Horizontal Scrolling Warning Info */}
          <div 
            onClick={() => setIsExpanded(true)}
            className="relative flex-1 overflow-hidden h-full flex items-center cursor-pointer group"
          >
            <div className="animate-marquee flex items-center gap-12 group-hover:[animation-play-state:paused]">
              <span className="font-mono text-[10px] text-[var(--sumi-ink)]/90 font-semibold tracking-wider uppercase whitespace-nowrap">
                {notice}
              </span>
              <span className="font-mono text-[10px] text-[var(--sumi-ink)]/90 font-semibold tracking-wider uppercase whitespace-nowrap">
                {notice}
              </span>
            </div>
          </div>

        </div>

        <div className="flex items-center pl-4">
          <button 
            onClick={onDismiss} 
            className="text-[var(--sumi-ink)]/50 hover:text-[var(--forge-orange)] transition-colors font-mono text-xs px-2 shrink-0 font-bold"
            aria-label="Dismiss system notice"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Futuristic Expansion Dialog */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 overflow-hidden">
            {/* Dark glass cover */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Glowing info panel */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[var(--aged-paper)] border-[6px] border-[var(--sumi-ink)] shadow-[8px_8px_0px_0px_rgba(26,23,20,1)] p-8 md:p-12 manga-cut-tr flex flex-col gap-6 text-[var(--sumi-ink)] overflow-hidden"
            >
              {/* Decorative Halftone Overlay */}
              <div className="absolute inset-0 halftone-bg opacity-5 pointer-events-none" />

              <div className="flex items-center gap-3 border-b border-[var(--sumi-ink)]/15 pb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--forge-orange)] animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-widest text-[var(--forge-orange)] uppercase">
                  {label}
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-black font-display text-[var(--sumi-ink)] uppercase tracking-tight leading-snug">
                {notice}
              </h3>

              <div className="flex justify-end pt-4 border-t border-[var(--sumi-ink)]/15">
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="px-8 py-3 bg-[var(--sumi-ink)] hover:bg-[var(--forge-orange)] text-[var(--chalk)] hover:text-[var(--dark-walnut)] font-black font-display text-lg uppercase tracking-wider transition-all duration-300 border-2 border-[var(--sumi-ink)] manga-cut-bl shadow-[4px_4px_0px_0px_var(--sumi-ink)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                >
                  {getCloseText()}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
