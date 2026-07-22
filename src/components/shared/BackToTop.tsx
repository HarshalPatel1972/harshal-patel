"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDesignVersion } from "./DesignVersionContext";
import { useLanguage } from "@/context/LanguageContext";

export function BackToTop() {
  const { designVersion, isMounted } = useDesignVersion();
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible((prev) => {
          if (!prev) {
            // Auto expand when first appearing
            setIsExpanded(true);
            if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
            collapseTimerRef.current = setTimeout(() => {
              setIsExpanded(false);
            }, 2500);
          }
          return true;
        });
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    };
  }, []);

  if (!isMounted) return null;

  const isV2 = designVersion === "new";

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleMouseEnter = () => {
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    collapseTimerRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 800);
  };

  const { prefixText, coreText } = (() => {
    switch (language) {
      case "ja":
        return { prefixText: "へ戻る", coreText: "ホーム ↑" };
      case "hi":
        return { prefixText: "मुझे घर ले चलो", coreText: "घर ↑" };
      case "eridian":
        return { prefixText: "RETURN TO", coreText: "BASE ↑" };
      default:
        return { prefixText: "Bring me", coreText: "Home ↑" };
    }
  })();

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 md:bottom-8 z-[90] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
          : "opacity-0 translate-y-8 pointer-events-none scale-95"
      }`}
    >
      {isV2 ? (
        /* ================= V2 STUDIO BRUTALIST CENTERED EXPANDABLE BUTTON ================= */
        <button
          onClick={scrollToTop}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="Scroll back to top"
          className="group relative block cursor-pointer outline-none border-none bg-transparent p-0"
        >
          {/* Backdrop Shadow Layer */}
          <div className="absolute inset-0 bg-[var(--sumi-ink)] translate-x-[4px] translate-y-[4px] transition-transform duration-200 group-hover:translate-x-[6px] group-hover:translate-y-[6px] group-active:translate-x-[2px] group-active:translate-y-[2px]" />

          {/* Top Interactive Layer */}
          <div className="relative z-10 flex items-center justify-center border-2 border-[var(--sumi-ink)] bg-[var(--forge-orange)] transition-all duration-300 group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:bg-[var(--sumi-ink)] group-active:translate-x-[2px] group-active:translate-y-[2px]">
            <div className="px-5 py-2.5 md:px-6 md:py-3 flex items-center justify-center overflow-hidden">
              <span
                className="text-white font-bold text-xs uppercase tracking-[0.2em] transition-colors duration-300 group-hover:text-[var(--forge-orange)] whitespace-nowrap flex items-center"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                {/* Ultra-Smooth CSS Width/Opacity Sliding Transition */}
                <span
                  className={`inline-block overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap ${
                    isExpanded
                      ? "max-w-[160px] opacity-100 mr-2"
                      : "max-w-0 opacity-0 mr-0"
                  }`}
                >
                  {prefixText}
                </span>
                <span>{coreText}</span>
              </span>
            </div>
          </div>
        </button>
      ) : (
        /* ================= V1 LEGACY CINEMATIC BRUTALIST CENTERED EXPANDABLE BUTTON ================= */
        <button
          onClick={scrollToTop}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="Scroll back to top"
          className="cursor-pointer px-5 py-2.5 md:px-6 md:py-3 bg-[#050505] text-[#E8E8E6] font-mono text-xs font-bold uppercase tracking-[0.25em] border border-[#E8E8E6]/30 shadow-[4px_4px_0px_var(--accent-blood)] transition-all duration-300 hover:bg-[var(--accent-blood)] hover:text-white hover:border-[var(--accent-blood)] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none whitespace-nowrap outline-none flex items-center justify-center overflow-hidden"
        >
          {/* Ultra-Smooth CSS Width/Opacity Sliding Transition */}
          <span
            className={`inline-block overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap ${
              isExpanded
                ? "max-w-[160px] opacity-100 mr-2"
                : "max-w-0 opacity-0 mr-0"
            }`}
          >
            {prefixText}
          </span>
          <span>{coreText}</span>
        </button>
      )}
    </div>
  );
}
