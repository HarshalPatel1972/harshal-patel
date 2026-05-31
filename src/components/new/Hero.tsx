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
    let sectionOffset = 0;
    let trackHeight = 0;

    const updateDimensions = () => {
      if (!trackRef.current) return;
      sectionOffset = trackRef.current.offsetTop;
      trackHeight = window.innerHeight; // Track over 1 full screen scroll
    };

    const handleScroll = () => {
      // Perform parallax/scale/opacity/blur updates on the Hero section content
      if (trackRef.current && heroContentRef.current) {
        const st = window.scrollY;

        if (st <= sectionOffset + trackHeight + 500) {
          const progress = Math.max(0, Math.min(1, (st - sectionOffset) / trackHeight));
          trackRef.current.style.setProperty("--scroll-progress", progress.toString());

          const scale = 1 - progress * 0.3;
          const translate = progress * -100;
          const opacity = Math.max(0, 1 - progress * 2.0);
          const blur = progress * 15;

          // ⚡ Bolt: Removed synchronous layout reads from scroll loop and cached dimensions
          heroContentRef.current.style.transform = `translate3d(0, ${translate}px, 0) scale(${scale})`;
          heroContentRef.current.style.opacity = opacity.toString();
          heroContentRef.current.style.filter = blur > 0.5 ? `blur(${blur}px)` : "none";
          heroContentRef.current.style.pointerEvents = progress > 0.6 ? "none" : "auto";
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

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    window.addEventListener("scroll", handleScrollThrottled, { passive: true });
    handleScrollThrottled(); // initial call
    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("scroll", handleScrollThrottled);
    };
  }, []);

  const availableText = (() => {
    switch (language) {
      case "ja": return "AVAILABLE FOR OPPORTUNITIES · 工作受付中";
      case "ko": return "AVAILABLE FOR OPPORTUNITIES · 의뢰 가능";
      case "zh-tw": return "AVAILABLE FOR OPPORTUNITIES · 合作開放";
      case "hi": return "AVAILABLE FOR OPPORTUNITIES · उपलब्ध";
      case "eridian": return "MISSION STATUS · READY";
      default: return "AVAILABLE FOR OPPORTUNITIES · ACTIVE";
    }
  })();

  const [isNameHovered, setIsNameHovered] = React.useState(false);

  return (
    <section
      ref={trackRef}
      id="hero"
      className="h-screen relative z-0 isolate transform-gpu overflow-hidden blueprint-grid-warm text-[var(--sumi-ink)]"
      style={{ "--scroll-progress": "0" } as React.CSSProperties}
    >
      <div className="relative h-full flex items-center justify-center overflow-hidden px-6 md:px-16 lg:px-24 w-full">
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
          
          {/* Manila Folder Label Tag */}
          <div className="relative flex flex-col items-start select-none">
            {/* Folder Tab */}
            <div className="h-[5px] w-[32px] bg-[#E5A93B]/15 border-t border-x border-[var(--forge-orange)] rounded-t-[2px] ml-[10px] mb-[-1px] z-10 relative" />
            {/* Folder Body */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E5A93B]/10 border border-[var(--forge-orange)] shadow-[2px_2px_0px_rgba(232,112,58,0.1)] rounded-tr-[3px] rounded-b-[3px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--forge-orange)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--forge-orange)]"></span>
              </span>
              <span
                className="font-semibold tracking-[0.15em] text-[10px] uppercase"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: "var(--sumi-ink)",
                }}
              >
                {availableText}
              </span>
            </div>
          </div>

          {/* Title - Split Typography */}
          <div 
            className="space-y-1 group cursor-default select-none"
            onMouseEnter={() => setIsNameHovered(true)}
            onMouseLeave={() => setIsNameHovered(false)}
          >
            <h1
              className="uppercase leading-[0.85] font-black transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                fontSize: "clamp(3.5rem, 11vw, 7.8rem)",
                fontFamily: "var(--font-big-shoulders), sans-serif",
                letterSpacing: "-0.04em",
                color: isNameHovered ? "transparent" : "var(--sumi-ink)",
                WebkitTextStroke: isNameHovered ? "2px var(--forge-orange)" : "none",
              }}
            >
              {firstWord}
            </h1>
            <h1
              className="uppercase leading-[0.85] font-black transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                fontSize: "clamp(3.5rem, 11vw, 7.8rem)",
                fontFamily: "var(--font-big-shoulders), sans-serif",
                letterSpacing: "-0.04em",
                color: isNameHovered ? "var(--sumi-ink)" : "transparent",
                WebkitTextStroke: isNameHovered ? "none" : "2px var(--forge-orange)",
              }}
            >
              {remainingWords}
            </h1>
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
            {(() => {
              const tagline = currentProfile.tagline;
              const parts = tagline.split(/(Go|TypeScript|Typescipt|WebAssembly)/gi);
              return parts.map((part, index) => {
                const lower = part.toLowerCase();
                if (lower === "go") {
                  return (
                    <span 
                      key={index} 
                      className="font-extrabold italic text-[#00ADD8] tracking-tight hover:scale-105 inline-block transition-transform duration-200" 
                      style={{ 
                        fontFamily: 'var(--font-big-shoulders), sans-serif',
                        fontSize: '1.1em'
                      }}
                    >
                      Go
                    </span>
                  );
                }
                if (lower === "typescript" || lower === "typescipt") {
                  return (
                    <span 
                      key={index} 
                      className="font-bold text-[#3178C6] tracking-tight bg-[#3178C6]/10 px-1 py-0.5 rounded-sm hover:bg-[#3178C6]/20 transition-colors duration-200 inline-block align-baseline mx-0.5" 
                      style={{ 
                        fontFamily: 'var(--font-dm-sans), sans-serif',
                        fontSize: '0.9em',
                        lineHeight: '1'
                      }}
                    >
                      TypeScript
                    </span>
                  );
                }
                if (lower === "webassembly") {
                  return (
                    <span 
                      key={index} 
                      className="font-semibold text-[#654FF0] tracking-wide bg-[#654FF0]/10 px-1.5 py-0.5 rounded-sm hover:bg-[#654FF0]/20 transition-colors duration-200 inline-block align-baseline mx-0.5"
                      style={{
                        fontFamily: 'var(--font-jetbrains-mono), monospace',
                        fontSize: '0.85em',
                        lineHeight: '1'
                      }}
                    >
                      WebAssembly
                    </span>
                  );
                }
                return part;
              });
            })()}
          </p>



          {/* CTAs styled for a drafting board feel */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4 pointer-events-auto">
            <a
              ref={cta1Ref}
              href="#projects"
              className="group relative block min-w-[180px] md:min-w-[200px] select-none cursor-pointer"
            >
              {/* Outer shadow layer / backdrop */}
              <div className="absolute inset-0 bg-[var(--sumi-ink)] translate-x-[4px] translate-y-[4px] transition-transform duration-200 group-hover:translate-x-[6px] group-hover:translate-y-[6px] group-active:translate-x-[2px] group-active:translate-y-[2px]" />
              
              {/* Top interactive layer */}
              <div
                className="relative z-10 flex items-center justify-center border-2 border-[var(--sumi-ink)] bg-[var(--forge-orange)] transition-all duration-200 group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:bg-[var(--sumi-ink)] group-active:translate-x-[2px] group-active:translate-y-[2px]"
                style={{
                  minHeight: "56px",
                }}
              >
                <div className="px-5 py-3.5 md:px-7 md:py-4">
                  <span
                    className="text-white font-bold text-xs uppercase tracking-[0.2em] transition-colors duration-200 group-hover:text-[var(--forge-orange)]"
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    {language === 'en' ? "View Work" : language === 'ja' ? "実績を見る" : language === 'eridian' ? "VIEW-WORKS" : "कार्य देखें"}
                  </span>
                </div>
              </div>
            </a>
            
            <a
              ref={cta2Ref}
              href="#contact"
              className="group relative block min-w-[180px] md:min-w-[200px] select-none cursor-pointer"
            >
              {/* Outer shadow layer / backdrop */}
              <div className="absolute inset-0 bg-[var(--sumi-ink)] translate-x-[4px] translate-y-[4px] transition-transform duration-200 group-hover:translate-x-[6px] group-hover:translate-y-[6px] group-active:translate-x-[2px] group-active:translate-y-[2px]" />
              
              {/* Top interactive layer */}
              <div
                className="relative z-10 flex items-center justify-center border-2 border-[var(--sumi-ink)] bg-[var(--aged-paper)] transition-all duration-200 group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:bg-[var(--sumi-ink)] group-active:translate-x-[2px] group-active:translate-y-[2px]"
                style={{
                  minHeight: "56px",
                }}
              >
                <div className="px-5 py-3.5 md:px-7 md:py-4">
                  <span
                    className="font-bold text-xs uppercase tracking-[0.2em] transition-colors duration-200 text-[var(--sumi-ink)] group-hover:text-[var(--forge-orange)]"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                    }}
                  >
                    {language === 'en' ? "Contact" : language === 'ja' ? "連絡する" : language === 'eridian' ? "SEND-SIGNAL" : "संपर्क करें"}
                  </span>
                </div>
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
