"use client";

import { useDesignVersion } from "./DesignVersionContext";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect, useRef } from "react";

export function DesignVersionSwitcher() {
  const { designVersion, setDesignVersion, isMounted } = useDesignVersion();
  const { language } = useLanguage();
  const [isAtTop, setIsAtTop] = useState(true);
  const [noticeVisible, setNoticeVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show notice on mount, then auto-hide after 3s
  useEffect(() => {
    const timer1 = setTimeout(() => setNoticeVisible(true), 0);
    hideTimer.current = setTimeout(() => {
      setNoticeVisible(false);
    }, 3000);
    return () => { clearTimeout(timer1); if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [designVersion]);

  if (!isMounted) return null;

  const isV2 = designVersion === "new";

  const handleToggle = () => {
    setDesignVersion(isV2 ? "old" : "new");
  };

  const noticeText = isV2
    ? (language === "hi" ? "V2 — विकास में है" : "V2 — In Development")
    : (language === "hi" ? "V1 — क्लासिक संस्करण" : "V1 — Classic");

  return (
    <div className="relative flex flex-col items-start select-none pointer-events-auto">

      {/* Toggle button container */}
      <div className="relative group inline-flex items-center gap-0">
        {/* Backdrop Shadow Layer */}
        <div
          className="absolute inset-0 transition-all duration-300 translate-x-[3px] translate-y-[3px] group-hover:translate-x-[4.5px] group-hover:translate-y-[4.5px] group-active:translate-x-[1px] group-active:translate-y-[1px]"
          style={{
            background: isV2 ? "var(--sumi-ink)" : "var(--accent-blood)",
          }}
        />

        {/* Toggle button */}
        <button
          onClick={handleToggle}
          className={`relative z-10 flex items-center justify-center border text-xs font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer overflow-hidden h-9 group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-active:translate-x-[1px] group-active:translate-y-[1px] ${
            isAtTop ? "w-[240px] px-4" : "w-9 px-0"
          }`}
          style={{
            background: isV2 ? "var(--aged-paper)" : "var(--bg-ink)",
            borderColor: isV2 ? "var(--sumi-ink)" : "var(--text-bone)",
            color: isV2 ? "var(--sumi-ink)" : "var(--text-bone)",
            borderWidth: isV2 ? "2px" : "1px",
          }}
        >
          {/* Expanded Content Wrapper */}
          <div 
            className={`flex items-center gap-3.5 whitespace-nowrap w-full justify-center transition-all duration-300 ${
              isAtTop ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none absolute"
            }`}
          >
            {/* Status dot */}
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span
                className="relative inline-flex rounded-full h-1.5 w-1.5"
                style={{ background: isV2 ? "var(--forge-orange)" : "var(--accent-blood)" }}
              />
            </span>

            {/* Label */}
            <span className="font-bold opacity-90 group-hover:opacity-100 transition-opacity">
              {isV2
                ? (language === "hi" ? "V2 देख रहे हैं" : "Viewing V2")
                : (language === "hi" ? "V1 — क्लासिक" : "V1 — Classic")}
            </span>

            <div
              className="h-3 w-[1px] opacity-20 shrink-0"
              style={{
                background: isV2 ? "var(--sumi-ink)" : "var(--text-bone)",
              }}
            />

            {/* Action hint */}
            <span
              className="text-[10px] font-black transition-colors shrink-0"
              style={{ color: isV2 ? "var(--forge-orange)" : "var(--accent-blood)" }}
            >
              {isV2
                ? (language === "hi" ? "V1 पर वापस" : "← Back to V1")
                : (language === "hi" ? "V2 आज़माएं" : "Try V2 →")}
            </span>
          </div>

          {/* Collapsed Content Wrapper */}
          <div 
            className={`font-black text-xs shrink-0 select-none transition-all duration-300 ${
              !isAtTop ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none absolute"
            }`}
          >
            {isV2 ? "V2" : "V1"}
          </div>
        </button>

        {/* Version notice — shows on load for 3s, then reappears on hover */}
        {isAtTop && (
          <div
            className={`absolute left-full ml-2.5 z-20 hidden sm:flex items-center gap-2 px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase border whitespace-nowrap transition-all duration-500 pointer-events-none ${
              noticeVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
            }`}
            style={{
              background: isV2 ? "var(--aged-paper)" : "var(--bg-ink)",
              borderColor: isV2 ? "var(--sumi-ink)" : "var(--text-bone)",
              color: isV2 ? "var(--sumi-ink)" : "var(--text-bone)",
              borderLeftWidth: "3.5px",
              borderLeftColor: isV2 ? "var(--forge-orange)" : "var(--accent-blood)",
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="relative inline-flex rounded-full h-1.5 w-1.5"
                style={{ background: isV2 ? "var(--forge-orange)" : "var(--accent-blood)" }}
              />
            </span>
            {noticeText}
          </div>
        )}
      </div>
    </div>
  );
}
