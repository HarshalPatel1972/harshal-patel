"use client";

import { projects } from "@/data/projects";
import { useState, useRef, useEffect } from "react";
import { animate as anime, utils } from "animejs";
import { SubliminalKanji } from "./ui/SubliminalKanji";
import { useLanguage } from "@/context/LanguageContext";
import { KineticLink } from "./ui/KineticLink";

interface Project {
  title: string;
  description: string;
  link: string;
  tags: string[];
  specs: string[];
}

export function Projects() {
  const { language } = useLanguage();
  const currentProjects = projects[language];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isOverridden, setIsOverridden] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  // Entrance staggered animation (RESTORED)
  useEffect(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll(".project-card");
    anime(elements as any, {
      opacity: [1, 1],
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
      className="relative pt-[46px] md:pt-[78px] pb-[10vh] px-6 md:px-8 bg-white flex flex-col items-center z-20"
    >
      {/* Background ink texture (inverted for this section since background is white) */}
      <div className="absolute inset-0 halftone-bg z-0 opacity-[0.03] pointer-events-none invert mix-blend-multiply" />

      {/* Vertical Kanji Watermark */}
      <SubliminalKanji kanji="作品" position="left" />

      {/* Massive Section Title (MAPPA Layout) */}
      <div className="w-full max-w-7xl relative flex flex-col md:flex-row justify-between items-end mb-[-23px] md:mb-[41px] border-b-4 border-black pb-8">
        <div>
           <div className="bg-black text-white font-black font-mono text-xs tracking-widest px-3 py-1 inline-block mb-4">
             {language === 'en' ? 'CHAPTER 01' : '第一章'}
           </div>
           <h2 className="text-5xl md:text-8xl lg:text-9xl font-black font-display text-[var(--bg-ink)] uppercase tracking-[-0.04em] leading-[0.8] m-0">
             {language === 'en' ? <>SELECTED <br/> WORKS</> : <>選定された<br/>作品</>}
           </h2>
        </div>
        <p className="text-[var(--bg-ink)] font-sans font-bold max-w-xs text-left md:text-right mt-8 md:mt-0 text-sm md:text-base uppercase tracking-widest leading-relaxed">
           {language === 'en' 
             ? "A showcase of systems built and technical problems solved."
             : "開発されたシステムと解決された技術的課題のショーケース。"}
        </p>
      </div>

      <div className={`transition-all duration-1000 relative ${isOverridden ? 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 opacity-100 max-w-7xl w-full' : 'flex flex-col gap-[20vh] max-w-5xl w-[calc(100%-2.5rem)] md:w-full mr-[2.5rem] md:mr-0 pl-0 md:pl-0'}`}>
        {/* GLOBAL MASTER OVERRIDER (Z-Elevated to stay on top of all stacks) */}
        {!isOverridden && (
          <div className="absolute right-[4px] md:right-0 top-0 h-full w-9 md:w-10 pointer-events-none z-30">
            <div className="sticky top-[10vh] md:top-[12vh] pointer-events-auto flex justify-center">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOverridden(true);
                }}
                className="h-44 md:h-64 w-full bg-white text-black border-4 border-black hover:border-[var(--accent-blood)] hover:bg-[var(--accent-blood)] hover:text-white flex flex-col items-center justify-center gap-4 transition-all duration-300 group/btn shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none translate-x-0"
              >
                <div className="relative w-2 h-2 flex items-center justify-center">
                   <div className="absolute inset-0 bg-[var(--accent-blood)] animate-ping opacity-75 group-hover/btn:bg-white" />
                   <div className="relative w-1.5 h-1.5 bg-[var(--accent-blood)] group-hover/btn:bg-white shrink-0" />
                </div>
                <div className="flex flex-col items-center">
                  {"SPREAD_PROJECTS".split("_").map((word, wIdx) => (
                    <div key={wIdx} className={`flex flex-col items-center ${wIdx === 0 ? "mb-3 md:mb-4" : ""}`}>
                      {word.split("").map((char, cIdx) => (
                        <span key={cIdx} className="font-display text-[9px] md:text-[11px] font-black uppercase leading-none mb-[2px] last:mb-0">
                          {char}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </button>
            </div>
          </div>
        )}

        {currentProjects.map((project: Project, i: number) => {
          const isHovered = activeIndex === i;
          
          return (
            <div 
              key={project.title} 
              className={`transition-all duration-700 ease-out w-full ${isOverridden ? `relative top-0 ${i === 0 ? "md:col-span-2" : ""}` : 'sticky top-[10vh] md:top-[12vh]'}`} 
              style={{ zIndex: isOverridden ? 1 : i }}
            >
              <div className="flex items-start">
                <KineticLink 
                  href={project.link}
                  target="_blank"
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={`project-card block relative flex-1 manga-panel manga-cut-bl bg-[var(--bg-ink)] border-4 border-black brutal-shadow transition-all duration-500 ${isOverridden ? 'min-h-[280px] md:min-h-[450px] p-5 md:p-12' : 'h-[400px] md:h-[550px] p-6 md:p-12'} group cursor-pointer overflow-hidden`}
                >
                  {/* Background Blood Splatter on Hover */}
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={`absolute inset-0 w-full h-full text-[var(--accent-blood)] transition-opacity duration-500 pointer-events-none z-0 ${isHovered ? 'opacity-10' : 'opacity-0'}`}>
                     <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="currentColor" />
                  </svg>

                  {/* Number Watermark */}
                  <div className="absolute top-4 right-4 text-[4rem] md:text-[8rem] font-black font-display text-[var(--text-bone)] opacity-25 select-none pointer-events-none leading-none z-0 transition-transform duration-500">
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      {/* Tags / Categories */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag: string) => (
                          <span key={tag} className="border border-[var(--text-bone)] text-[var(--text-bone)] px-3 py-1 text-xs font-bold uppercase tracking-widest font-sans bg-black/50">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h3 className={`text-3xl md:text-6xl lg:text-7xl font-black font-display uppercase tracking-[-0.02em] leading-none mb-6 transition-colors duration-300 ${isHovered ? 'text-[var(--accent-blood)]' : 'text-[var(--text-bone)]'}`}>
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className={`text-[var(--text-muted)] font-sans text-sm md:text-lg leading-relaxed max-w-2xl border-l-[3px] pl-4 transition-colors duration-300 ${isHovered ? 'border-[var(--accent-blood)] text-[var(--text-bone)]' : 'border-[var(--text-muted)]'}`}>
                        {project.description}
                      </p>
                    </div>

                    {/* Technical HUD Specs */}
                    <div className={`flex flex-col items-end gap-1 mt-8 mb-4 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-40'}`}>
                      {project.specs.map((spec: string) => (
                        <span key={spec} className="font-mono text-[10px] md:text-xs text-[var(--text-bone)] tracking-[0.2em] font-bold">
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-12 flex items-center gap-4">
                       <div className="w-12 h-12 bg-white text-[var(--bg-ink)] flex items-center justify-center brutal-shadow rotate-0 group-hover:-rotate-45 transition-transform duration-300">
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
                           <path d="M5 12h14M12 5l7 7-7 7"/>
                         </svg>
                       </div>
                       <span className={`font-black font-display text-xl uppercase tracking-widest transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-2 text-[var(--accent-blood)]' : 'opacity-0 -translate-x-4 text-[var(--text-bone)]'}`}>
                          {language === 'en' ? "View Project" : "プロジェクトを見る"}
                       </span>
                    </div>
                  </div>
                </KineticLink>

                {/* LAYOUT PLACEHOLDER (Maintains sizing for all cards in stack) */}
                {!isOverridden && (
                  <div className="w-8 md:w-10 shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
