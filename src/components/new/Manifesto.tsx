"use client";

import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

const MANIFESTO_PARTS: Record<string, {
  prefix: string;
  underline: string;
  mid: string;
  circle: string;
  suffix: string;
}> = {
  en: {
    prefix: "I find what's ",
    underline: "broken",
    mid: " and build what's ",
    circle: "missing.",
    suffix: ""
  },
  ja: {
    prefix: "私は ",
    underline: "壊れたもの",
    mid: " を見つけ、",
    circle: "足りないもの",
    suffix: " を創る。"
  },
  ko: {
    prefix: "나는 ",
    underline: "망가진 것",
    mid: " 을 찾아내고, ",
    circle: "부족한 것",
    suffix: " 을 채운다."
  },
  "zh-tw": {
    prefix: "我尋找 ",
    underline: "破碎之處",
    mid: "，並構築 ",
    circle: "缺失之事",
    suffix: "。"
  },
  hi: {
    prefix: "मैं ढूंढता हूँ जो ",
    underline: "टूटा है",
    mid: ", और बनाता हूँ जो ",
    circle: "गायब है",
    suffix: "।"
  },
  eridian: {
    prefix: "♩ FIND ",
    underline: "BROKE-THING",
    mid: ". BUILD ",
    circle: "NEW-THING",
    suffix: ". AMAZE! ♩"
  },
  fr: {
    prefix: "Je trouve ce qui est ",
    underline: "brisé",
    mid: " et je construis ce qui ",
    circle: "manque",
    suffix: "."
  },
  id: {
    prefix: "Saya menemukan apa yang ",
    underline: "rusak",
    mid: " dan membangun apa yang ",
    circle: "hilang",
    suffix: "."
  },
  de: {
    prefix: "Ich finde, was ",
    underline: "kaputt",
    mid: " ist, und baue, was ",
    circle: "fehlt",
    suffix: "."
  },
  it: {
    prefix: "Trovo ciò che è ",
    underline: "rotto",
    mid: " e costruisco ciò che ",
    circle: "manca",
    suffix: "."
  },
  es: {
    prefix: "Encuentro lo que está ",
    underline: "roto",
    mid: " y construyo lo que ",
    circle: "falta",
    suffix: "."
  },
  "es-419": {
    prefix: "Encuentro lo que está ",
    underline: "roto",
    mid: " y construyo lo que ",
    circle: "falta",
    suffix: "."
  },
  "pt-br": {
    prefix: "Eu encontro o que está ",
    underline: "quebrado",
    mid: " e construo o que ",
    circle: "falta",
    suffix: "."
  }
};

export function Manifesto() {
  const { language } = useLanguage();
  const parts = MANIFESTO_PARTS[language] || MANIFESTO_PARTS.en;
  const trackRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (trackRef.current) {
        const st = window.scrollY;
        const sectionOffset = trackRef.current.offsetTop;
        const trackHeight = trackRef.current.offsetHeight - window.innerHeight;
        const totalScrollRange = sectionOffset + trackHeight;

        // Calculate progress starting from st = 0 up to totalScrollRange
        const progress = Math.max(0, Math.min(1, st / totalScrollRange));
        trackRef.current.style.setProperty("--scroll-progress", progress.toString());
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
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleScrollThrottled);
  }, []);

  const prefixWords = parts.prefix.split(" ").filter(w => w !== "");
  const midWords = parts.mid.split(" ").filter(w => w !== "");
  const suffixWords = parts.suffix.split(" ").filter(w => w !== "");

  const totalWords = prefixWords.length + 1 + midWords.length + 1 + suffixWords.length;

  return (
    <section
      id="manifesto"
      ref={trackRef}
      className="h-[200vh] relative z-10 isolate overflow-visible select-none"
      style={{
        background: "#161D1A", // deep chalkboard forest green
        backgroundImage: `
          radial-gradient(rgba(240, 237, 232, 0.03) 1px, transparent 0),
          radial-gradient(rgba(240, 237, 232, 0.03) 1px, transparent 0)
        `,
        backgroundSize: "24px 24px",
        backgroundPosition: "0 0, 12px 12px",
        "--scroll-progress": "0",
      } as React.CSSProperties}
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-6 md:px-16 lg:px-24">
        {/* Chalkboard noise overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-4 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="w-full max-w-5xl relative z-10 flex flex-col items-center text-center">
          {/* Editorial Chapter Badge */}
          <div
            className="inline-block mb-10 px-3 py-1 text-[9px] tracking-[0.3em] font-bold"
            style={{
              background: "rgba(240, 237, 232, 0.1)",
              color: "#F0EDE8", // Chalk white
              fontFamily: "var(--font-jetbrains-mono), monospace",
              border: "1px solid rgba(240, 237, 232, 0.2)",
            }}
          >
            The Manifesto
          </div>

          {/* Large Chalk Quote with scroll-reveal dynamic text */}
          <h2
            className="leading-[1.25] text-white tracking-wide max-w-4xl"
            style={{
              fontSize: "clamp(1.8rem, 4.5vw, 3.8rem)",
              fontFamily: "var(--font-dm-serif), serif",
              color: "#F0EDE8", // Chalk color
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
            }}
          >
            {prefixWords.map((word, idx) => {
              const i = idx;
              const start = (i / totalWords) * 0.65;
              const end = start + 0.2;
              return (
                <span
                  key={`pre-${idx}`}
                  className="inline-block mr-[0.3em] reveal-word"
                  style={{
                    "--start": start,
                    "--end": end,
                  } as React.CSSProperties}
                >
                  {word}
                </span>
              );
            })}

            {/* Underline container */}
            <span
              className="relative inline-block px-1 mx-[0.15em] reveal-word underline-path-container"
              style={{
                "--start": (prefixWords.length / totalWords) * 0.65,
                "--end": (prefixWords.length / totalWords) * 0.65 + 0.2,
                "--svg-start": (prefixWords.length / totalWords) * 0.65 + 0.1,
                "--svg-end": (prefixWords.length / totalWords) * 0.65 + 0.35,
              } as React.CSSProperties}
            >
              <span style={{ color: "var(--forge-orange)" }}>{parts.underline}</span>
              <svg
                className="absolute left-0 bottom-[-8px] w-full h-[12px] overflow-visible"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  className="underline-path"
                  d="M 2,5 Q 40,2 98,8"
                  fill="none"
                  stroke="var(--forge-orange)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            {midWords.map((word, idx) => {
              const i = prefixWords.length + 1 + idx;
              const start = (i / totalWords) * 0.65;
              const end = start + 0.2;
              return (
                <span
                  key={`mid-${idx}`}
                  className="inline-block mr-[0.3em] reveal-word"
                  style={{
                    "--start": start,
                    "--end": end,
                  } as React.CSSProperties}
                >
                  {word}
                </span>
              );
            })}

            {/* Circle container */}
            <span
              className="relative inline-block px-3 py-1 mx-[0.15em] reveal-word circle-path-container"
              style={{
                "--start": ((prefixWords.length + 1 + midWords.length) / totalWords) * 0.65,
                "--end": ((prefixWords.length + 1 + midWords.length) / totalWords) * 0.65 + 0.2,
                "--svg-start": ((prefixWords.length + 1 + midWords.length) / totalWords) * 0.65 + 0.15,
                "--svg-end": ((prefixWords.length + 1 + midWords.length) / totalWords) * 0.65 + 0.45,
              } as React.CSSProperties}
            >
              <span style={{ color: "var(--blueprint-blue)" }}>{parts.circle}</span>
              <svg
                className="absolute inset-0 w-full h-full overflow-visible"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  className="circle-path"
                  d="M 10,50 C 12,15 88,12 90,48 C 92,85 8,88 12,54"
                  fill="none"
                  stroke="var(--blueprint-blue)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            {suffixWords.map((word, idx) => {
              const i = prefixWords.length + 1 + midWords.length + 1 + idx;
              const start = (i / totalWords) * 0.65;
              const end = start + 0.2;
              return (
                <span
                  key={`suf-${idx}`}
                  className="inline-block mr-[0.3em] reveal-word"
                  style={{
                    "--start": start,
                    "--end": end,
                  } as React.CSSProperties}
                >
                  {word}
                </span>
              );
            })}
          </h2>

          {/* Tactile Workbench Measuring Tape timeline at bottom */}
          <div className="w-full max-w-3xl mt-24 font-mono text-[9px] tracking-[0.25em] text-[#8A7F72] uppercase">
            <div className="flex justify-between items-center mb-3">
              <span>Since 2022</span>
              <span className="hidden sm:inline">Active</span>
              <span>Present</span>
            </div>
            <div className="relative h-6 border-t border-b border-[#8A7F72]/30 flex items-center justify-between w-full overflow-hidden">
              {/* Colored Fill */}
              <div className="absolute left-0 top-0 bottom-0 timeline-fill" />
              
              {/* Grid overlay */}
              <div
                className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `repeating-linear-gradient(90deg, #F0EDE8 0px, #F0EDE8 1px, transparent 1px, transparent 12px)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Local style block for scroll reveal animations */}
      <style>{`
        .reveal-word {
          --progress: clamp(0, calc((var(--scroll-progress) - var(--start)) / 0.2), 1);
          opacity: var(--progress);
          transform: translateY(calc((1 - var(--progress)) * 25px));
          filter: blur(calc((1 - var(--progress)) * 12px));
          will-change: transform, opacity, filter;
        }
        .underline-path {
          stroke-dasharray: 200;
          stroke-dashoffset: calc(200 * (1 - clamp(0, calc((var(--scroll-progress) - var(--svg-start)) / 0.25), 1)));
        }
        .circle-path {
          stroke-dasharray: 500;
          stroke-dashoffset: calc(500 * (1 - clamp(0, calc((var(--scroll-progress) - var(--svg-start)) / 0.3), 1)));
        }
        .timeline-fill {
          /* Starts filling at 50% scroll, finishes at 90% scroll */
          width: calc(clamp(0, calc((var(--scroll-progress) - 0.5) * 2.5), 1) * 100%);
          background: linear-gradient(90deg, var(--blueprint-blue) 0%, var(--forge-orange) 100%);
          opacity: 0.8;
          box-shadow: 0 0 20px rgba(232, 97, 66, 0.4);
        }
      `}</style>
    </section>
  );
}
