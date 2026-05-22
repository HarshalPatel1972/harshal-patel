"use client";

import React, { useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { profile } from "@/data/profile";
import { useLanguage } from "@/context/LanguageContext";
import { useMagnetic } from "../AnimationKit";

export function Hero() {
  const { language } = useLanguage();
  const currentProfile = profile[language as keyof typeof profile] || profile.en;

  const cta1Ref = useMagnetic<HTMLAnchorElement>(0.15);
  const cta2Ref = useMagnetic<HTMLAnchorElement>(0.15);

  const trackRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  const firstWord = currentProfile.name.split(" ")[0] || "Harshal";
  const remainingWords = currentProfile.name.split(" ").slice(1).join(" ") || "Patel";

  // SCROLL ENGINE
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      // Perform parallax/scale/opacity/blur updates on the Hero section content
      if (trackRef.current && heroContentRef.current) {
        const st = window.scrollY;
        const sectionOffset = trackRef.current.offsetTop;
        const trackHeight = trackRef.current.offsetHeight - window.innerHeight;

        if (st <= sectionOffset + trackHeight + 500) {
          const progress = Math.max(0, Math.min(1, (st - sectionOffset) / trackHeight));
          trackRef.current.style.setProperty("--scroll-progress", progress.toString());

          const scale = 1 - progress * 0.5;
          const translate = progress * -150;
          const opacity = Math.max(0, 1 - progress * 3.5);
          const blur = progress * 20;

          heroContentRef.current.style.transform = `translate3d(0, ${translate}px, 0) scale(${scale})`;
          heroContentRef.current.style.opacity = opacity.toString();
          heroContentRef.current.style.filter = blur > 0.5 ? `blur(${blur}px)` : "none";
          heroContentRef.current.style.pointerEvents = progress > 0.4 ? "none" : "auto";
        }
      }

      ticking = false;
    };

    const handleScrollThrottled = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScrollThrottled, { passive: true });
    handleScroll(); // initial call
    return () => window.removeEventListener("scroll", handleScrollThrottled);
  }, []);

  const availableText = (() => {
    switch (language) {
      case "ja": return "AVAILABLE FOR OPPORTUNITIES // 仕事受付中";
      case "ko": return "AVAILABLE FOR OPPORTUNITIES // 의뢰 가능";
      case "zh-tw": return "AVAILABLE FOR OPPORTUNITIES // 合作開放";
      case "hi": return "AVAILABLE FOR OPPORTUNITIES // उपलब्ध";
      case "eridian": return "MISSION STATUS // READY";
      default: return "AVAILABLE FOR OPPORTUNITIES // ACTIVE";
    }
  })();

  return (
    <section
      ref={trackRef}
      id="hero"
      className="h-[300vh] relative z-0 isolate transform-gpu overflow-visible blueprint-grid-warm text-[var(--sumi-ink)]"
      style={{ "--scroll-progress": "0" } as React.CSSProperties}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-6 md:px-16 lg:px-24 w-full">
        {/* Scroll Indicator Arrows */}
        <div 
          className="absolute bottom-[44px] md:bottom-[-6px] left-0 right-0 flex flex-col items-center transition-opacity duration-700 pointer-events-none z-30"
          style={{ opacity: 'calc(1 - (var(--scroll-progress) * 10))' } as React.CSSProperties}
        >
          <div className="relative h-20 w-8 flex flex-col items-center justify-center">
            {[0, 1, 2, 3, 4].map((i) => {
              const themeColors = ['var(--forge-orange)', 'var(--blueprint-blue)', 'var(--sumi-ink)', 'var(--forge-orange)', 'var(--blueprint-blue)'];
              return (
                <svg 
                  key={i} 
                  className="absolute animate-arrow-flow" 
                  style={{ animationDelay: `${i * 0.4}s` }} 
                  width="24"
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none"
                >
                  <path 
                    d="M12 4L12 20M12 20L5 13M12 20L19 13" 
                    stroke={themeColors[i]} 
                    strokeWidth="3.2" 
                    strokeLinecap="square" 
                    className="opacity-70"
                  />
                </svg>
              );
            })}
          </div>
        </div>

        <div ref={heroContentRef} className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Name and Tagline */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6 md:space-y-8">
          
          {/* Amber Folder Tag Shape */}
          <div
            className="inline-block px-5 py-2 text-white font-bold select-none relative animate-pulse shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
            style={{
              background: "var(--forge-orange)",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              clipPath: "polygon(0 0, 88% 0, 100% 100%, 0 100%)",
            }}
          >
            {availableText}
          </div>

          {/* Title - Split Typography */}
          <div className="space-y-1">
            <h1
              className="uppercase leading-[0.85] font-black"
              style={{
                fontSize: "clamp(3.5rem, 11vw, 7.8rem)",
                fontFamily: "var(--font-big-shoulders), sans-serif",
                letterSpacing: "-0.04em",
                color: "var(--sumi-ink)",
              }}
            >
              {firstWord}
            </h1>
            <h1
              className="uppercase leading-[0.85] font-black"
              style={{
                fontSize: "clamp(3.5rem, 11vw, 7.8rem)",
                fontFamily: "var(--font-big-shoulders), sans-serif",
                letterSpacing: "-0.04em",
                color: "transparent",
                WebkitTextStroke: "2px var(--forge-orange)",
              }}
            >
              {remainingWords}
            </h1>
          </div>

          {/* Studio open since annotation */}
          <div
            className="text-[10px] uppercase tracking-[0.25em]"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--blueprint-blue)",
              fontWeight: 700,
            }}
          >
            {"// STUDIO_OPEN_SINCE 2022"}
          </div>

          {/* Tagline */}
          <p
            className="text-lg md:text-xl leading-relaxed max-w-xl font-light"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "var(--sumi-ink)",
              opacity: 0.9,
            }}
          >
            {currentProfile.tagline}
          </p>



          {/* CTAs styled for a drafting board feel */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4 pointer-events-auto">
            <a
              ref={cta1Ref}
              href="#projects"
              className="group relative flex items-center justify-center min-w-[180px] md:min-w-[200px] select-none transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
              style={{
                background: "var(--forge-orange)",
                border: "1px solid var(--forge-orange)",
              }}
            >
              <div className="relative z-10 px-5 py-3.5 md:px-7 md:py-4.5">
                <span
                  className="text-white font-bold text-xs uppercase tracking-[0.2em]"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  {language === 'en' ? "View Work" : language === 'ja' ? "実績を見る" : language === 'eridian' ? "VIEW-WORKS" : "कार्य देखें"}
                </span>
              </div>
            </a>
            
            <a
              ref={cta2Ref}
              href="#contact"
              className="group relative flex items-center justify-center min-w-[180px] md:min-w-[200px] select-none transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                border: "1px dashed var(--sumi-ink)",
                background: "transparent",
              }}
            >
              <div className="relative z-10 px-5 py-3.5 md:px-7 md:py-4.5">
                <span
                  className="font-bold text-xs uppercase tracking-[0.2em] transition-colors group-hover:text-[var(--forge-orange)]"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    color: "var(--sumi-ink)",
                  }}
                >
                  {language === 'en' ? "Contact" : language === 'ja' ? "連絡する" : language === 'eridian' ? "SEND-SIGNAL" : "संपर्क करें"}
                </span>
              </div>
            </a>
          </div>

        </div>

      </div>
    </div>

      {/* Tactile Workbench Measuring Tape Bottom Edge */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 flex items-center justify-between border-t border-[var(--muted-label)]/30 pointer-events-none"
        style={{
          background: "var(--aged-paper)",
        }}
      >
        <div
          className="w-full h-full opacity-40"
          style={{
            backgroundImage: `
              repeating-linear-gradient(90deg, var(--sumi-ink) 0px, var(--sumi-ink) 1px, transparent 1px, transparent 8px),
              repeating-linear-gradient(90deg, var(--sumi-ink) 0px, var(--sumi-ink) 2px, transparent 2px, transparent 40px)
            `,
            backgroundPosition: "0 0, 0 0",
            backgroundSize: "100% 8px, 100% 16px",
            backgroundRepeat: "repeat-x",
          }}
        />
      </div>

    </section>
  );
}
