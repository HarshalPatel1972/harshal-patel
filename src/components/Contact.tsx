"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { ScrollReveal } from "./ScrollReveal";
import { animate as anime } from "animejs";

const LINKS = [
  {
    id: "email",
    label: "01 // COMMUNICATION",
    value: "INITIATE EMAIL",
    href: `mailto:${profile.email}`, // We will preventDefault on this
    color: "from-amber-300 to-orange-500",
  },
  {
    id: "github",
    label: "02 // SOURCE CODE",
    value: "ACCESS GITHUB",
    href: profile.github,
    color: "from-violet-400 to-fuchsia-500",
  },
  {
    id: "linkedin",
    label: "03 // PROFESSIONAL",
    value: "VIEW NETWORK",
    href: profile.linkedin,
    color: "from-blue-400 to-cyan-400",
  },
];

/**
 * Rapidly scrambles characters to simulate encrypted data
 */
function ScrambledData({ original, isCopied }: { original: string; isCopied?: boolean }) {
  const [text, setText] = useState(original);

  useEffect(() => {
    // If copied, show the exact text immediately without scrambling
    if (isCopied) {
      setText(original);
      return;
    }

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>";
    const interval = setInterval(() => {
      setText(
        original
          .split("")
          .map((c) =>
            c === " " ? " " : chars[Math.floor(Math.random() * chars.length)]
          )
          .join("")
      );
    }, 60);
    return () => clearInterval(interval);
  }, [original, isCopied]);

  return <span className="font-mono">{text}</span>;
}

export function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 500, y: 500, r: 0 });
  const current = useRef({ x: 500, y: 500, r: 0 });
  const requestRef = useRef<number | null>(null);
  
  const [copied, setCopied] = useState(false);

  // Smooth lerp for the lens
  useEffect(() => {
    const update = () => {
      current.current.x += (target.current.x - current.current.x) * 0.15;
      current.current.y += (target.current.y - current.current.y) * 0.15;
      current.current.r += (target.current.r - current.current.r) * 0.12;

      if (containerRef.current) {
        containerRef.current.style.setProperty("--lens-x", `${current.current.x}px`);
        containerRef.current.style.setProperty("--lens-y", `${current.current.y}px`);
        containerRef.current.style.setProperty("--lens-r", `${current.current.r}px`);
      }

      requestRef.current = requestAnimationFrame(update);
    };
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    target.current.x = e.clientX - rect.left;
    target.current.y = e.clientY - rect.top;
  };

  const handleMouseEnter = () => {
    if (!copied) target.current.r = 180;
  };

  const handleMouseLeave = () => {
    if (!copied) target.current.r = 0;
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (id === "email") {
      e.preventDefault(); // Stop mailto: behavior
      navigator.clipboard.writeText(profile.email);
      setCopied(true);
      
      // Massive lens expansion + color flash
      target.current.r = 800;
      
      if (ringRef.current) {
        anime(ringRef.current, {
          borderColor: ["#10b981", "rgba(255,255,255,0.2)"],
          boxShadow: [
            "inset 0 0 100px rgba(16,185,129,0.5), inset 0 4px 10px rgba(255,255,255,0.2), 0 20px 40px rgba(0,0,0,0.5)",
            "inset 0 0 40px rgba(255,255,255,0.05), inset 0 4px 10px rgba(255,255,255,0.2), 0 20px 40px rgba(0,0,0,0.5)"
          ],
          duration: 1500,
          easing: "outExpo"
        });
      }

      setTimeout(() => {
        setCopied(false);
        target.current.r = 180; // Return to hover state size
      }, 2000);
    }
  };

  return (
    <section id="contact" className="relative bg-[#050508] border-t border-white/[0.04]">
      <ScrollReveal className="absolute top-12 left-6 md:left-12 z-40 block pointer-events-none">
         <span className="text-sm font-mono text-violet-400 tracking-widest uppercase">
            Data Decryption Matrix
         </span>
         <p className="text-white/30 text-xs font-mono mt-2 max-w-xs">
            Hover cursor over encrypted nodes to focus resonance frequency.<br/>
            Click to extract.
         </p>
      </ScrollReveal>

      <div
        ref={containerRef}
        className="relative w-full h-[700px] flex items-center justify-center overflow-hidden cursor-none"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* =========================================
            BACKGROUND LAYER: Scrambled & Clickable 
            ========================================= */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-12 z-10 w-full">
          {LINKS.map((link) => {
            const isEmailCopied = copied && link.id === "email";
            const textValue = isEmailCopied ? "DATA EXTRACTED" : link.value;

            return (
              <a
                key={link.id + "-bg"}
                href={link.href}
                target={link.id !== "email" ? "_blank" : undefined}
                rel="noopener noreferrer"
                onClick={(e) => handleLinkClick(e, link.id)}
                className="text-center block outline-none w-full"
                onMouseEnter={() => !copied && (target.current.r = 280)}
                onMouseLeave={() => !copied && (target.current.r = 180)}
              >
                <div className="text-xs md:text-sm font-mono text-white/20 mb-2 tracking-widest transition-colors duration-300">
                  <ScrambledData original={link.label} isCopied={isEmailCopied} />
                </div>
                <div
                  className="text-5xl md:text-7xl lg:text-8xl font-black text-white/[0.03] uppercase tracking-tighter"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <ScrambledData original={textValue} isCopied={isEmailCopied} />
                </div>
              </a>
            );
          })}
        </div>

        {/* =========================================
            FOREGROUND LAYER: Real Data, Masked
            ========================================= */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-12 z-20 pointer-events-none w-full bg-[#0a0a0f]/40 backdrop-blur-sm"
          style={{
            clipPath: `circle(var(--lens-r, 0px) at var(--lens-x, 50%) var(--lens-y, 50%))`,
          }}
        >
          {LINKS.map((link) => {
            const isEmailCopied = copied && link.id === "email";
            const textValue = isEmailCopied ? "DATA EXTRACTED" : link.value;
            // When copied, turn the email gradient emerald green
            const gradientColors = isEmailCopied ? "from-emerald-300 to-teal-400" : link.color;

            return (
              <div key={link.id + "-fg"} className="text-center w-full">
                <div className="text-xs md:text-sm font-mono text-white/80 mb-2 tracking-widest">
                  {link.label}
                </div>
                <div
                  className={`text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter bg-gradient-to-r ${gradientColors} bg-clip-text text-transparent transform md:scale-105 transition-all duration-500 ${isEmailCopied ? 'scale-110 tracking-widest drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]' : ''}`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {textValue}
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================
            THE LENS FRAME (Physical Glass Ring)
            ========================================= */}
        <div
          ref={ringRef}
          className="absolute z-30 pointer-events-none rounded-full border border-white/20"
          style={{
            left: "calc(var(--lens-x, 50%) - var(--lens-r, 0px))",
            top: "calc(var(--lens-y, 50%) - var(--lens-r, 0px))",
            width: "calc(var(--lens-r, 0px) * 2)",
            height: "calc(var(--lens-r, 0px) * 2)",
            backdropFilter: "blur(0px) saturate(1.5) contrast(1.2)",
            boxShadow:
              "inset 0 0 40px rgba(255,255,255,0.05), inset 0 4px 10px rgba(255,255,255,0.2), 0 20px 40px rgba(0,0,0,0.5)",
          }}
        >
          {/* Subtle crosshair in the center of the lens */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full transition-colors duration-300 ${copied ? 'bg-emerald-400 scale-150 shadow-[0_0_10px_#10b981]' : 'bg-white/50'}`} />
        </div>
      </div>
    </section>
  );
}
