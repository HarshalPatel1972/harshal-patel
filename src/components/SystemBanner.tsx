"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export function SystemBanner() {
  const [visible, setVisible] = useState(true);
  const { language, setLanguage } = useLanguage();

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-12 md:right-16 z-[60] bg-[var(--accent-blood)] border-b border-black/20 flex items-center justify-between px-4 py-2 shadow-[0_4px_30px_rgba(217,17,17,0.4)]">
      <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
         {/* Brutalist Warning Label */}
         <div className="bg-white text-[var(--accent-blood)] text-[9px] md:text-[10px] font-black font-display tracking-widest px-2 py-0.5 uppercase shrink-0 flex items-center gap-1.5">
           <span className="w-1.5 h-1.5 bg-[var(--accent-blood)] animate-pulse" />
            {language === 'en' ? "NOTICE" : language === 'ja' ? "お知らせ" : language === 'ko' ? "공지사항" : language === 'zh-tw' ? "公告" : "सूचना"}
         </div>
         
         {/* Technical Context - High Visibility White */}
         <span className="font-mono text-[9px] md:text-[11px] text-white font-bold tracking-wide uppercase truncate drop-shadow-sm">
            {language === 'en' 
              ? "This portfolio is currently undergoing a live redesign. Some features may be temporarily unavailable. Thank you for your patience."
              : language === 'ja'
              ? "このポートフォリオは現在再設計中です。一部の機能が利用できない場合があります。ご不便をおかけしますが、ご了承ください。"
              : language === 'ko'
              ? "이 포트폴리오는 현재 실시간 재설계 중입니다. 일부 기능을 일시적으로 사용할 수 없을 수 있습니다. 양해해 주셔서 감사합니다."
              : language === 'zh-tw'
              ? "此作品集目前正在進行實時重新設計。部分功能可能暫時無法使用。感謝您的耐心配合。"
              : "यह पोर्टफोलियो वर्तमान में लाइव पुन: डिज़ाइन से गुजर रहा है। कुछ सुविधाएँ अस्थायी रूप से अनुपलब्ध हो सकती हैं। आपके धैर्य के लिए धन्यवाद।"}
         </span>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {/* Language Toggle - Redesigned for red BG */}
        <div className="flex items-center gap-2 border border-white/40 px-2 py-1 bg-black/20 backdrop-blur-sm">
          <button 
            onClick={() => setLanguage('en')}
            className={`font-mono text-[9px] md:text-[10px] uppercase tracking-wider transition-colors duration-300 ${language === 'en' ? "text-white font-black" : "text-white/40 hover:text-white"}`}
          >
            [EN]
          </button>
          <span className="text-white/30 text-[10px]">/</span>
          <button 
            onClick={() => setLanguage('ja')}
            className={`font-mono text-[9px] md:text-[10px] uppercase tracking-wider transition-colors duration-300 ${language === 'ja' ? "text-white font-black" : "text-white/40 hover:text-white"}`}
          >
            [JA]
          </button>
          <span className="text-white/30 text-[10px]">/</span>
          <button 
            onClick={() => setLanguage('ko')}
            className={`font-mono text-[9px] md:text-[10px] uppercase tracking-wider transition-colors duration-300 ${language === 'ko' ? "text-white font-black" : "text-white/40 hover:text-white"}`}
          >
            [KO]
          </button>
          <span className="text-white/30 text-[10px]">/</span>
          <button 
            onClick={() => setLanguage('zh-tw')}
            className={`font-mono text-[9px] md:text-[10px] uppercase tracking-wider transition-colors duration-300 ${language === 'zh-tw' ? "text-white font-black" : "text-white/40 hover:text-white"}`}
          >
            [ZH]
          </button>
          <span className="text-white/30 text-[10px]">/</span>
          <button 
            onClick={() => setLanguage('hi')}
            className={`font-mono text-[9px] md:text-[10px] uppercase tracking-wider transition-colors duration-300 ${language === 'hi' ? "text-white font-black" : "text-white/40 hover:text-white"}`}
          >
            [HI]
          </button>
        </div>

        {/* Dismiss Button */}
        <button 
          onClick={() => setVisible(false)} 
          className="text-white/60 hover:text-white transition-colors font-mono text-sm px-2 shrink-0 font-black"
          aria-label="Dismiss system notice"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
