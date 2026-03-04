"use client";

import { projects } from "@/data/projects";
import { ScrollReveal } from "./ScrollReveal";
import { useState, useEffect, useRef } from "react";
import { animate as anime, utils } from "animejs";

/**
 * 🔣 Glitch Scrambler: scrambles characters momentarily when "trigger" changes
 */
function GlitchText({ text, trigger }: { text: string; trigger: any }) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let iterations = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>";
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iterations) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iterations >= text.length) clearInterval(interval);
      iterations += 1;
    }, 30);

    return () => clearInterval(interval);
  }, [text, trigger]);

  return <>{displayText}</>;
}

export function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];
  const hudRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  // Trigger animations when the active project changes
  useEffect(() => {
    if (!hudRef.current || !scannerRef.current) return;

    // Reset and trigger scanner line
    anime(scannerRef.current, {
      top: ["0%", "100%"],
      opacity: [1, 0],
      duration: 1500,
      easing: "cubicBezier(0.4, 0, 0.2, 1)",
    });

    // Stagger in HUD elements
    const elements = hudRef.current.querySelectorAll(".hud-item");
    anime(elements as any, {
      opacity: [0, 1],
      translateX: [30, 0],
      duration: 600,
      delay: utils.stagger(100),
      easing: "outQuart",
    });

    // Animate bars
    const bars = hudRef.current.querySelectorAll(".hud-bar");
    anime(bars as any, {
      scaleX: [0, 1],
      duration: 800,
      delay: utils.stagger(100, { start: 200 }),
      easing: "outExpo",
    });
  }, [activeIndex]);

  return (
    <section id="projects" className="relative py-32 px-4 md:px-6 section-fade">
      <div className="max-w-7xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-16">
            <span className="text-sm font-mono text-amber-400 tracking-widest uppercase">
              System Archives
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-amber-400/50 to-transparent" />
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* =========================================
              LEFT COL: Projects Index (Scrollable)
              ========================================= */}
          <div className="lg:col-span-5 relative flex flex-col gap-2">
            
            {projects.map((project, i) => {
              const isActive = activeIndex === i;
              return (
                <ScrollReveal key={project.title} delay={i * 100}>
                  <button
                    onClick={() => setActiveIndex(i)}
                    className={`relative w-full text-left p-6 group transition-all duration-500 rounded-xl flex items-center gap-6 ${
                      isActive ? "bg-white/5 border border-white/10 shadow-lg" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* Activity Indicator Node */}
                    <div className="relative flex items-center justify-center shrink-0">
                      <div className="absolute top-[-100px] bottom-[-100px] w-[1px] bg-white/10 z-0" />
                      <div
                        className={`relative w-4 h-4 rounded-full transition-all duration-500 z-10 ${
                          isActive
                            ? "scale-100 shadow-[0_0_15px_currentColor]"
                            : "scale-50 opacity-20 group-hover:scale-75 group-hover:opacity-50"
                        }`}
                        style={{ backgroundColor: project.color, color: project.color }}
                      >
                         {isActive && (
                            <div className="absolute inset-0 rounded-full animate-ping opacity-50" style={{ backgroundColor: project.color }} />
                         )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="text-[10px] font-mono mb-2 flex items-center justify-between" style={{ color: isActive ? project.color : 'rgba(255,255,255,0.3)' }}>
                        <span>INDEX_{String(i + 1).padStart(2, "0")}</span>
                        {isActive && <span className="animate-pulse">ACTIVE</span>}
                      </div>
                      <h3
                        className={`text-2xl font-bold transition-colors duration-300 font-display uppercase tracking-wider ${
                          isActive ? "text-white" : "text-white/40 group-hover:text-white/70"
                        }`}
                      >
                        {project.title}
                      </h3>
                    </div>
                  </button>
                </ScrollReveal>
              );
            })}
          </div>

          {/* =========================================
              RIGHT COL: Data terminal HUD
              ========================================= */}
          <div className="lg:col-span-7 lg:sticky lg:top-32 h-[600px]">
            <ScrollReveal delay={300} className="w-full h-full">
              <div
                ref={hudRef}
                className="w-full h-full border rounded-2xl p-8 relative overflow-hidden flex flex-col items-start justify-center backdrop-blur-md"
                style={{
                  backgroundColor: "rgba(5, 5, 8, 0.6)",
                  borderColor: `${activeProject.color}40`,
                  boxShadow: `0 20px 50px -10px ${activeProject.color}15, inset 0 0 0 1px ${activeProject.color}20`,
                }}
              >
                {/* Background Grid Pattern */}
                <div 
                  className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{
                    backgroundImage: `linear-gradient(${activeProject.color} 1px, transparent 1px), linear-gradient(90deg, ${activeProject.color} 1px, transparent 1px)`,
                    backgroundSize: "20px 20px"
                  }} 
                />

                {/* Vertical Scanner Line */}
                <div 
                  ref={scannerRef}
                  className="absolute left-0 right-0 h-[2px] pointer-events-none z-20"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${activeProject.color}, transparent)`,
                    boxShadow: `0 0 20px 2px ${activeProject.color}`
                  }}
                />

                <div className="relative z-10 w-full hud-item">
                  {/* Decorative Elements */}
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 w-full">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                      <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: activeProject.color }} />
                    </div>
                    <div className="text-[10px] font-mono text-white/40">
                      SECURE_CONNECTION // LIVE
                    </div>
                  </div>

                  <h2
                    className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6 bg-clip-text text-transparent break-words hud-item"
                    style={{
                      fontFamily: "var(--font-display)",
                      backgroundImage: `linear-gradient(135deg, #fff, ${activeProject.color})`,
                    }}
                  >
                    <GlitchText text={activeProject.title} trigger={activeIndex} />
                  </h2>

                  <div className="hud-bar origin-left h-[1px] w-full mb-8 opacity-50" style={{ backgroundColor: activeProject.color }} />

                  <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-xl hud-item font-mono text-sm md:text-base">
                    <GlitchText text={activeProject.description} trigger={activeIndex} />
                  </p>

                  <div className="flex flex-wrap gap-3 mb-12 hud-item">
                    {activeProject.tags.map((tag, idx) => (
                      <span
                        key={tag + activeIndex} // Force rerender on index change
                        className="text-xs font-mono px-3 py-1.5 rounded-full border bg-black/40 backdrop-blur-sm"
                        style={{
                          borderColor: `${activeProject.color}40`,
                          color: activeProject.color,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="hud-item mt-auto">
                    <a
                      href={activeProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-mono text-sm tracking-widest uppercase transition-all duration-300 group hover:pr-4"
                      style={{
                        backgroundColor: `${activeProject.color}15`,
                        border: `1px solid ${activeProject.color}40`,
                        color: activeProject.color,
                      }}
                    >
                      <span className="group-hover:translate-x-1 transition-transform">Initialize Protocol</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-2 transition-transform opacity-50 group-hover:opacity-100">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </a>
                  </div>

                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
