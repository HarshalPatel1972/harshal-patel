"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { ScrollReveal } from "./ScrollReveal";

const LINKS = [
  {
    id: "email",
    label: "01 // COMMUNICATION",
    value: "INITIATE EMAIL",
    href: `mailto:${profile.email}`,
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
  {
    id: "location",
    label: "04 // COORDINATES",
    value: "LOCATE BASE",
    href: `https://maps.google.com/?q=${encodeURIComponent(profile.location)}`,
    color: "from-emerald-400 to-teal-400",
  },
];

/**
 * Rapidly scrambles characters to simulate encrypted data
 */
function ScrambledData({ original }: { original: string }) {
  const [text, setText] = useState(original);

  useEffect(() => {
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
    }, 60); // Fast update
    return () => clearInterval(interval);
  }, [original]);

  return <span className="font-mono">{text}</span>;
}

export function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 500, y: 500, r: 0 });
  const current = useRef({ x: 500, y: 500, r: 0 });
  const requestRef = useRef<number | null>(null);

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
    target.current.r = 180; // Base lens size
  };

  const handleMouseLeave = () => {
    target.current.r = 0; // Hide lens when cursor leaves
  };

  return (
    <section id="contact" className="relative bg-[#050508] border-t border-white/[0.04]">
      <ScrollReveal className="absolute top-12 left-6 md:left-12 z-40 block pointer-events-none">
         <span className="text-sm font-mono text-violet-400 tracking-widest uppercase">
            Data Decryption Matrix
         </span>
         <p className="text-white/30 text-xs font-mono mt-2 max-w-xs">
            Hover cursor over encrypted nodes to focus resonance frequency and decrypt transmission links.
         </p>
      </ScrollReveal>

      <div
        ref={containerRef}
        className="relative w-full h-[800px] flex items-center justify-center overflow-hidden cursor-none"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* =========================================
            BACKGROUND LAYER: Scrambled & Clickable 
            ========================================= */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-12 z-10 w-full">
          {LINKS.map((link) => (
            <a
              key={link.id + "-bg"}
              href={link.href}
              target={link.id !== "email" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="text-center block outline-none w-full"
              onMouseEnter={() => (target.current.r = 280)} // Expand lens on hover
              onMouseLeave={() => (target.current.r = 180)} // Shrink back
            >
              <div className="text-xs md:text-sm font-mono text-white/20 mb-2 tracking-widest">
                <ScrambledData original={link.label} />
              </div>
              <div
                className="text-5xl md:text-7xl lg:text-8xl font-black text-white/[0.03] uppercase tracking-tighter"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <ScrambledData original={link.value} />
              </div>
            </a>
          ))}
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
          {LINKS.map((link) => (
            <div key={link.id + "-fg"} className="text-center w-full">
              <div className="text-xs md:text-sm font-mono text-white/80 mb-2 tracking-widest">
                {link.label}
              </div>
              <div
                className={`text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter bg-gradient-to-r ${link.color} bg-clip-text text-transparent transform md:scale-105 transition-transform duration-500`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {link.value}
              </div>
            </div>
          ))}
        </div>

        {/* =========================================
            THE LENS FRAME (Physical Glass Ring)
            ========================================= */}
        <div
          className="absolute z-30 pointer-events-none rounded-full border border-white/20"
          style={{
            left: "calc(var(--lens-x, 50%) - var(--lens-r, 0px))",
            top: "calc(var(--lens-y, 50%) - var(--lens-r, 0px))",
            width: "calc(var(--lens-r, 0px) * 2)",
            height: "calc(var(--lens-r, 0px) * 2)",
            // The magic glass effect that distorts the background
            backdropFilter: "blur(0px) saturate(1.5) contrast(1.2)",
            boxShadow:
              "inset 0 0 40px rgba(255,255,255,0.05), inset 0 4px 10px rgba(255,255,255,0.2), 0 20px 40px rgba(0,0,0,0.5)",
          }}
        >
          {/* Subtle crosshair in the center of the lens */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
