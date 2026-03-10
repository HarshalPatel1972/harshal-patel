"use client";

import { profile } from "@/data/profile";
import { ScrollReveal } from "./ScrollReveal";
import { useCounter } from "./AnimationKit";
import { useEffect, useRef, useState } from "react";
import { animate as anime, utils } from "animejs";
import { SubliminalKanji } from "./ui/SubliminalKanji";
import { useLanguage } from "@/context/LanguageContext";

// Giant bold stats
function MangaStat({ value, label, prefix = "" }: { value: number; label: string; prefix?: string }) {
  const countRef = useCounter(value, 2000);
  return (
    <div className="flex flex-col border-b-2 border-black pb-4 hover:pl-4 transition-all duration-300 group">
      <div className="text-[10px] sm:text-xs font-mono font-bold text-black/60 uppercase tracking-[0.2em] mb-1">{label}</div>
      <div className="text-3xl sm:text-5xl md:text-6xl font-black font-display text-[var(--accent-blood)] tracking-tighter">
        {prefix}<span ref={countRef as any}>0</span>{label === "CGPA" ? "" : "+"}
      </div>
    </div>
  );
}

export function About() {
  const { language } = useLanguage();
  const currentProfile = profile[language];

  const sectionRef = useRef<HTMLElement>(null);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!skillsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSkillsVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(skillsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="about" 
      ref={sectionRef} 
      className="relative py-16 md:py-32 px-4 md:px-8 section-fade bg-[var(--bg-ink)] flex flex-col items-center overflow-hidden"
    >
      {/* Background Halftone Drop */}
      <div className="absolute inset-0 halftone-bg z-0 opacity-20 pointer-events-none" />

      {/* Vertical Kanji Watermark */}
      <SubliminalKanji kanji="経験" position="right" />

      {/* Massive Section Title (MAPPA Background Text Style) */}
      <div className="absolute top-10 left-0 right-0 flex justify-center pointer-events-none overflow-hidden z-0 opacity-10 select-none">
         <h2 className="text-[8rem] md:text-[20rem] font-black font-display text-[var(--text-bone)] whitespace-nowrap leading-none tracking-tighter" style={{ transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
            {language === 'en' ? "ORIGIN" : "起源"}
         </h2>
      </div>

      <div className="w-full max-w-7xl relative flex flex-col gap-12 lg:gap-24 mt-10 md:mt-32">
        
        {/* =========================================
            PANEL 1: Bio & Core Philosophy (Left Cut)
            ========================================= */}
        <ScrollReveal duration={1200} className="w-full">
          <div className="manga-panel p-5 md:p-14 bg-white text-black brutal-shadow manga-cut-tr border-2 md:border-4 border-black relative">
            <div className="absolute top-0 right-0 bg-[var(--accent-blood)] text-white font-black font-display px-6 py-2 text-xl tracking-widest border-l-4 border-b-4 border-black">
              {language === 'en' ? 'CHAPTER 02' : '第二章'}
            </div>
            
            <div className="grid lg:grid-cols-[1fr_200px] gap-12 mt-6 relative">
               <div>
                 <h3 className="text-4xl sm:text-5xl md:text-7xl font-black font-display uppercase tracking-[-0.02em] leading-[0.85] mb-8">
                   {language === 'en' ? "Software" : "ソフトウェア"} <br /> <span className="text-[var(--accent-blood)] stroke-black" style={{ WebkitTextStroke: "2px black", color: "transparent" }}>{language === 'en' ? "Engineer" : "エンジニア"}</span>
                 </h3>
                 <p className="text-base sm:text-lg md:text-xl font-sans font-bold leading-relaxed text-black/80 max-w-2xl border-l-4 border-black pl-6">
                   {currentProfile.bio}
                 </p>

                 {/* Education Credentials Block */}
                 <div className="mt-8 pt-6 border-t-2 border-black/10 flex flex-col md:flex-row gap-6">
                   <div className="flex-1">
                     <div className="text-[10px] font-mono font-bold text-[var(--accent-blood)] uppercase tracking-[0.3em] mb-2">// EDUCATION_HISTORY</div>
                     <div className="font-black font-display text-xl md:text-2xl uppercase italic">
                       {currentProfile.education.school}
                     </div>
                     <div className="text-sm font-bold font-sans text-black/60 uppercase">
                       {currentProfile.education.degree} | {currentProfile.education.years}
                     </div>
                   </div>
                   <div className="bg-black text-[var(--text-bone)] px-6 py-4 flex flex-col justify-center brutal-shadow">
                      <div className="text-[10px] font-mono font-bold text-[var(--accent-blood)] tracking-widest uppercase mb-1">GPA Score</div>
                      <div className="font-black font-display text-2xl md:text-3xl tracking-tighter">
                        {currentProfile.education.gpa}
                      </div>
                      <div className="text-[10px] font-bold font-sans uppercase tracking-[0.1em] opacity-60">
                         {language === 'en' ? "Academic Topper" : "成績優秀者"}
                      </div>
                   </div>
                 </div>
               </div>
               
               {/* Giant vertical typography */}
               <div className="hidden lg:flex justify-end items-center relative h-full">
                  <div className="absolute text-[8rem] font-black font-display leading-none text-black/5 rotate-90 whitespace-nowrap origin-center select-none">
                     {language === 'en' ? "DEVELOPER" : "開発者"}
                  </div>
               </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 w-full">
         {/* =========================================
             PANEL 2: Experience (Stacked Black Blocks)
             ========================================= */}
         <ScrollReveal duration={1200} delay={200} className="w-full">
           <div className="flex flex-col border-2 md:border-4 border-[var(--text-bone)] bg-white brutal-shadow">
              <div className="bg-black text-[var(--text-bone)] font-black font-display uppercase tracking-widest text-2xl md:text-5xl px-6 py-4 flex items-center" style={{ transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
                 {language === 'en' ? <>RECORDED <br/> EXPERIENCE</> : <>記録された<br/>経験</>}
              </div>
              
              <div className="flex flex-col bg-white">
                {currentProfile.experience.map((job, i) => (
                  <div key={job.company} className="relative group border-b-4 border-black last:border-b-0 p-6 md:p-8 hover:bg-black hover:text-white transition-colors duration-300">
                    
                    {/* Timestamp & Role Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 md:gap-4 mb-4">
                       <h4 className="text-3xl md:text-4xl lg:text-5xl font-black font-display uppercase leading-none text-black group-hover:text-white transition-colors">
                         {job.company}
                       </h4>
                       <span className="text-[10px] sm:text-xs font-mono font-bold bg-black text-white group-hover:bg-[var(--accent-blood)] px-3 py-1 uppercase tracking-widest self-start md:self-auto border-2 border-black group-hover:border-[var(--accent-blood)] transition-colors">
                         {job.period}
                       </span>
                    </div>

                    <div className="text-lg md:text-2xl font-bold font-sans uppercase tracking-tighter mb-4 text-[var(--accent-blood)] group-hover:text-[var(--text-bone)] transition-colors">
                       {job.role}
                    </div>

                    <p className="text-black/80 group-hover:text-white/80 text-sm md:text-base leading-relaxed font-sans border-l-4 border-black group-hover:border-[var(--accent-blood)] pl-4 transition-colors">
                      {job.description}
                    </p>
                  </div>
                ))}
              </div>
           </div>
         </ScrollReveal>

           {/* =========================================
               PANEL 3: Skills & Stats (Brutalist Right Cut)
               ========================================= */}
           <ScrollReveal duration={1200} delay={300} direction="up" className="w-full">
             <div className="manga-panel p-4 md:p-12 border-2 md:border-4 border-[var(--text-bone)] bg-[var(--bg-darker)] manga-cut-br flex flex-col gap-8 md:gap-12 overflow-hidden">
               
               {/* Massive Stats Block inside the panel */}
               <div className="grid grid-cols-3 gap-3 md:gap-8 bg-white p-4 md:p-6 border-2 border-black">
                 <MangaStat value={350} label={language === 'en' ? "Algorithms" : "アルゴリズム"} prefix=">" />
                 <MangaStat value={8.9} label={language === 'en' ? "Academic" : "成績"} />
                 <MangaStat value={11} label={language === 'en' ? "Systems Built" : "構築済システム"} prefix="" />
               </div>

               {/* Raw Skill Bars */}
               <div ref={skillsRef} className="flex flex-col gap-6">
                  <h4 className="text-[var(--text-bone)] font-black font-display text-2xl uppercase tracking-widest border-b-2 border-[var(--panel-border)] pb-2 flex items-center justify-between">
                     {language === 'en' ? "Core Expertise" : "主な専門分野"}
                     <span className="text-[10px] font-mono text-[var(--accent-blood)]">MAX 100%</span>
                  </h4>
                  <div className="space-y-6">
                    {currentProfile.skills.map((skill, i) => (
                      <div key={skill.name} className="relative">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="text-sm md:text-base font-bold font-sans text-[var(--text-bone)] uppercase">{skill.name}</span>
                          <span className="text-xs font-mono text-[var(--accent-cursed)] font-bold">{skill.level}%</span>
                        </div>
                        {/* MAPPA Brutalist Skill Bar */}
                        <div className="h-[8px] bg-black border border-[var(--text-bone)] w-full relative overflow-hidden">
                           <div
                             className={`absolute top-0 bottom-0 left-0 bg-[var(--accent-blood)] ${skillsVisible ? "scale-x-100" : "scale-x-0"} transition-transform duration-1000 origin-left`}
                             style={{
                               width: `${skill.level}%`,
                               transitionDelay: `${i * 150}ms`,
                               transitionTimingFunction: "cubic-bezier(0.86, 0, 0.07, 1)"
                             }}
                           />
                           {/* Halftone texture overlay on the fill */}
                           <div className="absolute inset-0 halftone-bg mix-blend-multiply opacity-50" />
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

             </div>
           </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
