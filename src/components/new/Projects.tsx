"use client";

import React, { useState } from "react";
import { projects, type Project } from "@/data/projects";
import { useLanguage } from "@/context/LanguageContext";

export function Projects() {
  const { language } = useLanguage();
  const projectList = projects[language as keyof typeof projects] || projects.en;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const titleTranslations = {
    en: "Selected Creations",
    ja: "厳選されたプロジェクト",
    ko: "선택된 프로젝트",
    "zh-tw": "精選作品集",
    hi: "विशेष प्रोजेक्ट्स",
    eridian: "♩ WORKS-THING ♩"
  };

  const descTranslations = {
    en: "A curated archive of high-performance tools, compilers, and remote execution bridges built from the ground up.",
    ja: "スクラッチから開発された高性能ツール、コンパイラ、リモート実行ブリッジの厳選アーカイブ。",
    ko: "처음부터 직접 구축한 고성능 도구, 컴파일러, 원격 실행 브릿지의 엄선된 아카이브.",
    "zh-tw": "自底向上構建的高性能工具、編譯器與遠端執行橋接器精選存檔。",
    hi: "स्क्रैच से निर्मित उच्च-प्रदर्शन टूल्स, कंपाइलर्स और रिमोट निष्पादन ब्रिजेस का एक संग्रह।",
    eridian: "HARSHAL MAKE THINGS FAST. USE CODE. LOOK HERE!"
  };

  const projectTitle = titleTranslations[language as keyof typeof titleTranslations] || titleTranslations.en;
  const projectDesc = descTranslations[language as keyof typeof descTranslations] || descTranslations.en;

  return (
    <section 
      id="projects" 
      className="relative py-24 px-6 md:px-16 lg:px-24 bg-neutral-950 text-white z-10 overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-r from-cyan-500/5 to-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-sm font-mono tracking-[0.2em] text-cyan-400 uppercase">
            {language === 'eridian' ? "PORTFOLIO CORE" : "PROJECTS"}
          </h2>
          <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            {projectTitle}
          </h3>
          <p className="text-neutral-400 text-sm md:text-base font-light leading-relaxed">
            {projectDesc}
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectList.map((project: Project, idx: number) => {
            const isHovered = hoveredIndex === idx;
            
            return (
              <div
                key={project.slug || idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative rounded-2xl p-6 bg-neutral-900/40 border border-white/[0.04] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-white/[0.12] flex flex-col justify-between h-[360px] overflow-hidden"
                style={{
                  boxShadow: isHovered 
                    ? `0 10px 30px -10px rgba(0,0,0,0.7), 0 0 20px -3px ${project.color}25` 
                    : "0 10px 30px -10px rgba(0,0,0,0.5)"
                }}
              >
                
                {/* Visual Glow overlay background */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 80% 20%, ${project.color}12, transparent 50%)`
                  }}
                />

                <div className="space-y-4">
                  {/* Category / Specs Tag */}
                  <div className="flex justify-between items-center">
                    <span 
                      className="text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded bg-white/[0.03] border border-white/[0.06]"
                      style={{ color: project.color }}
                    >
                      {project.specs?.[0] || "// CODE_"}
                    </span>
                    
                    {/* Glowing link indicator */}
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-neutral-500 hover:text-white transition-colors"
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>

                  {/* Project Title */}
                  <h4 className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h4>

                  {/* Description */}
                  <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-light line-clamp-4">
                    {project.description}
                  </p>
                </div>

                {/* Footer specs / tag container */}
                <div className="space-y-4 pt-4 border-t border-white/[0.04] mt-auto">
                  {/* Specs labels */}
                  {project.specs && project.specs.length > 1 && (
                    <div className="flex flex-wrap gap-x-3 text-[9px] font-mono text-neutral-500">
                      {project.specs.slice(1).map((spec: string, sIdx: number) => (
                        <span key={sIdx}>{spec}</span>
                      ))}
                    </div>
                  )}

                  {/* Tags list */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag: string, tIdx: number) => (
                      <span
                        key={tIdx}
                        className="text-[9px] font-mono text-neutral-300 bg-white/[0.02] border border-white/[0.05] rounded px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
