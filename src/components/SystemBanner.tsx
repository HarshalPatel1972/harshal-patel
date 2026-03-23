"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export function SystemBanner({ isVisible, onDismiss }: { isVisible: boolean, onDismiss: () => void }) {
  const { language } = useLanguage();

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
      default: return "This portfolio is currently undergoing a live redesign. Some features may be temporarily unavailable. Thank you for your patience.";
    }
  };

  const notice = getNoticeText();

  return (
    <div className="fixed top-0 left-0 right-12 md:right-16 z-[200] bg-[#9e1b1b] border-b border-black/20 flex items-center h-9 md:h-10 px-4 shadow-[0_4px_12px_rgba(158,27,27,0.3)] overflow-hidden">
      <div className="flex items-center gap-3 md:gap-4 flex-1 overflow-hidden h-full">
         {/* Brutalist Warning Label */}
         <div className="bg-white text-[#9e1b1b] text-[9px] md:text-[10px] font-black font-display tracking-widest px-2 py-0.5 uppercase shrink-0 flex items-center gap-1.5 z-10 shadow-lg">
           <span className="w-1.5 h-1.5 bg-[#9e1b1b] animate-pulse" />
            {language === 'en' ? "NOTICE" : language === 'ja' ? "お知らせ" : language === 'ko' ? "공지사항" : language === 'zh-tw' ? "公告" : language === 'fr' ? "AVIS" : language === 'id' ? "PEMBERITAHUAN" : language === 'de' ? "HINWEIS" : (language === 'pt-br' || language === 'es-419' || language === 'es') ? "AVISO" : language === 'it' ? "AVVISO" : "सूचना"}
         </div>
         
         {/* Ticker Container */}
         <div className="relative flex-1 overflow-hidden h-full flex items-center">
           <div className="animate-marquee flex items-center gap-12 hover:[animation-play-state:paused] cursor-help">
             <span className="font-mono text-[9px] md:text-[11px] text-white font-bold tracking-wide uppercase whitespace-nowrap drop-shadow-sm">
                {notice}
             </span>
             {/* Duplicate for seamless loop */}
             <span className="font-mono text-[9px] md:text-[11px] text-white font-bold tracking-wide uppercase whitespace-nowrap drop-shadow-sm">
                {notice}
             </span>
             <span className="font-mono text-[9px] md:text-[11px] text-white font-bold tracking-wide uppercase whitespace-nowrap drop-shadow-sm">
                {notice}
             </span>
           </div>
         </div>
      </div>

      <div className="flex items-center pl-4 shrink-0 bg-[#9e1b1b] z-10">
        {/* Dismiss Button */}
        <button 
          onClick={onDismiss} 
          className="text-white/60 hover:text-white transition-colors font-mono text-xs md:text-sm px-2 shrink-0 font-black"
          aria-label="Dismiss system notice"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
