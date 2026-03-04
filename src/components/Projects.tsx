"use client";

import { projects } from "@/data/projects";
import { ScrollReveal } from "./ScrollReveal";
import { useState, useRef, useEffect } from "react";
import { animate as anime, utils } from "animejs";

export function Projects() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  // Entrance staggered animation
  useEffect(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll(".project-card");
    anime(elements as any, {
      opacity: [0, 1],
      translateX: [50, 0],
      duration: 1200,
      delay: utils.stagger(150),
      easing: "outCubic",
    });
  }, []);

  return (
    <section 
      id="projects" 
      ref={containerRef}
      className="relative py-24 md:py-32 px-4 md:px-8 bg-[var(--text-bone)] flex flex-col items-center"
      onClick={() => {
        // Global Impact frame
        document.body.style.animation = "none";
        void document.body.offsetWidth;
        document.body.style.animation = "impact-flash 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      }}
    >
      {/* Background ink texture (inverted for this section since background is white) */}
      <div className="absolute inset-0 halftone-bg z-0 opacity-[0.03] pointer-events-none invert mix-blend-multiply" />

      {/* Massive Section Title (MAPPA Layout) */}
      <div className="w-full max-w-7xl relative z-10 flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 border-b-4 border-black pb-8">
        <div>
           <div className="bg-black text-white font-black font-mono text-xs tracking-widest px-3 py-1 inline-block mb-4">
             CHAPTER 02
           </div>
           <h2 className="text-6xl md:text-8xl lg:text-9xl font-black font-display text-[var(--bg-ink)] uppercase tracking-[-0.04em] leading-[0.8] m-0">
             SELECTED <br/> WORKS
           </h2>
        </div>
        <p className="text-black/60 font-sans font-bold max-w-xs text-right mt-8 md:mt-0 text-sm md:text-base uppercase tracking-widest leading-relaxed">
           Archival records of systems constructed and curses excised.
        </p>
      </div>

      <div className="w-full max-w-7xl relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {projects.map((project, i) => {
          const isHovered = activeIndex === i;
          
          return (
            <ScrollReveal key={project.title} duration={1000} delay={i * 100} className={`w-full ${i === 0 ? "md:col-span-2" : ""}`}>
              <a 
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                className="project-card block relative manga-panel manga-cut-bl bg-[var(--bg-ink)] border-4 border-black brutal-shadow min-h-[350px] md:min-h-[450px] p-8 md:p-12 group cursor-pointer overflow-hidden"
              >
                {/* Background Blood Splatter on Hover */}
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={`absolute inset-0 w-full h-full text-[var(--accent-blood)] transition-opacity duration-500 pointer-events-none z-0 ${isHovered ? 'opacity-10' : 'opacity-0'}`}>
                   <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="currentColor" />
                </svg>

                {/* Number Watermark */}
                <div className="absolute top-4 right-4 text-[4rem] md:text-[8rem] font-black font-display text-[var(--text-bone)] opacity-5 select-none pointer-events-none leading-none z-0 transition-transform duration-500 group-hover:scale-110">
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    {/* Tags / Categories */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map(tag => (
                        <span key={tag} className="border border-[var(--text-bone)] text-[var(--text-bone)] px-3 py-1 text-xs font-bold uppercase tracking-widest font-sans bg-black/50">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className={`text-4xl md:text-6xl lg:text-7xl font-black font-display uppercase tracking-[-0.02em] leading-none mb-6 transition-colors duration-300 ${isHovered ? 'text-[var(--accent-blood)]' : 'text-[var(--text-bone)]'}`}>
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-[var(--text-muted)] font-sans text-sm md:text-lg leading-relaxed max-w-2xl border-l-[3px] pl-4 transition-colors duration-300 ${isHovered ? 'border-[var(--accent-blood)] text-[var(--text-bone)]' : 'border-[var(--text-muted)]'}`}>
                      {project.description}
                    </p>
                  </div>

                  {/* Brutalist Arrow/CTA */}
                  <div className="mt-12 flex items-center gap-4">
                     <div className="w-12 h-12 bg-[var(--text-bone)] text-[var(--bg-ink)] flex items-center justify-center brutal-shadow rotate-0 group-hover:-rotate-45 transition-transform duration-300">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
                         <path d="M5 12h14M12 5l7 7-7 7"/>
                       </svg>
                     </div>
                     <span className={`font-black font-display text-xl uppercase tracking-widest transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-2 text-[var(--accent-blood)]' : 'opacity-0 -translate-x-4 text-[var(--text-bone)]'}`}>
                        Execute
                     </span>
                  </div>
                </div>
              </a>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
