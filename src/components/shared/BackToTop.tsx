"use client";

import React, { useState, useEffect } from "react";
import { useDesignVersion } from "./DesignVersionContext";
import { useLanguage } from "@/context/LanguageContext";

export function BackToTop() {
  const { designVersion, isMounted } = useDesignVersion();
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
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

  const buttonText = (() => {
    switch (language) {
      case "ja":
        return "トップ ↑";
      case "hi":
        return "ऊपर ↑";
      case "eridian":
        return "ASCEND ↑";
      default:
        return "TOP ↑";
    }
  })();

  return (
    <div
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[90] transition-all duration-300 ease-out select-none ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      {isV2 ? (
        /* ================= V2 STUDIO BRUTALIST BACK TO TOP ================= */
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="group relative block cursor-pointer outline-none border-none bg-transparent p-0"
        >
          {/* Backdrop Shadow Layer */}
          <div className="absolute inset-0 bg-[var(--sumi-ink)] translate-x-[4px] translate-y-[4px] transition-transform duration-200 group-hover:translate-x-[6px] group-hover:translate-y-[6px] group-active:translate-x-[2px] group-active:translate-y-[2px]" />

          {/* Top Interactive Layer */}
          <div
            className="relative z-10 flex items-center justify-center px-4 py-2.5 md:px-5 md:py-3 border-2 border-[var(--sumi-ink)] bg-[var(--forge-orange)] transition-all duration-200 group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:bg-[var(--sumi-ink)] group-active:translate-x-[2px] group-active:translate-y-[2px]"
          >
            <span
              className="text-white font-bold text-xs uppercase tracking-[0.2em] transition-colors duration-200 group-hover:text-[var(--forge-orange)] whitespace-nowrap"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              {buttonText}
            </span>
          </div>
        </button>
      ) : (
        /* ================= V1 LEGACY CINEMATIC BRUTALIST BACK TO TOP ================= */
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="cursor-pointer px-4 py-2.5 md:px-5 md:py-3 bg-[#050505] text-[#E8E8E6] font-mono text-xs font-bold uppercase tracking-[0.25em] border border-[#E8E8E6]/30 shadow-[4px_4px_0px_var(--accent-blood)] transition-all duration-200 hover:bg-[var(--accent-blood)] hover:text-white hover:border-[var(--accent-blood)] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none whitespace-nowrap outline-none"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
