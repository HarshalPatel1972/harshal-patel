"use client";

import { profile } from "@/data/profile";
import { ScrollReveal } from "./ScrollReveal";
import { useCounter } from "./AnimationKit";
import { useEffect, useRef, useState } from "react";
import { animate as anime, utils, createTimeline } from "animejs";
import { SubliminalKanji } from "./ui/SubliminalKanji";
import { useLanguage } from "@/context/LanguageContext";
import { useSignals } from "@/context/SignalContext";

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

// INTERACTIVE BOUNCY SKILL BARS
function InteractiveSkillBar({ skill, isVisible, index }: { skill: { name: string; level: number }; isVisible: boolean; index: number }) {
  const [percent, setPercent] = useState(skill.level);
  const barRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const animRef = useRef<any>(null);
  const [colliding, setColliding] = useState(false);

  // Initial entry animation
  useEffect(() => {
    if (isVisible && fillRef.current) {
      anime(fillRef.current, {
        scaleX: [0, 1],
        opacity: [0, 1],
        duration: 1400,
        delay: index * 120,
        easing: 'easeOutElastic(1, .6)'
      });
    }
  }, [isVisible, index]);

  const { triggerSignal } = useSignals();
  const lastTriggered = useRef<number | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleInteraction = (e: React.PointerEvent | PointerEvent) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPercent(newPercent);

    const rounded = Math.round(newPercent);
    
    // PRESSURE TRIGGER LOGIC (MAPPA SCREAM SYSTEM)
    if (isDragging) {
      if (rounded === 0 && lastTriggered.current !== 0) {
        triggerSignal("PRESSURE PRESSURE PRESSURE");
        lastTriggered.current = 0;
      } else if (rounded <= 8 && rounded > 0 && lastTriggered.current !== 8 && lastTriggered.current !== 0) {
        triggerSignal("PRESSURE");
        lastTriggered.current = 8;
      } else if (rounded <= 10 && rounded > 8 && lastTriggered.current !== 10 && lastTriggered.current !== 8 && lastTriggered.current !== 0) {
        triggerSignal("PRESSURE");
        lastTriggered.current = 10;
      } else if (rounded > 15) {
        lastTriggered.current = null;
      }
    }

    // RED for liquid, CYAN for numbers (Original Aesthetic)
    const red = 'var(--accent-blood)';
    const cyan = 'var(--accent-cursed)';
    
    if (fillRef.current) {
        fillRef.current.style.backgroundColor = red;
        fillRef.current.style.width = `${newPercent}%`;
    }
    if (labelRef.current) {
        labelRef.current.style.color = cyan;
        labelRef.current.innerText = `${rounded}%`;
    }
  };


  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    lastTriggered.current = null;
    if (animRef.current) animRef.current.pause();
    e.currentTarget.setPointerCapture(e.pointerId);
    handleInteraction(e);
    
    // Reset visual state on new interaction
    if (fillRef.current) {
      fillRef.current.style.backgroundColor = 'var(--accent-blood)';
    }
    if (labelRef.current) labelRef.current.style.color = 'var(--accent-blood)';
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (isDragging) handleInteraction(e);
  };

  const onPointerUp = () => {
    setIsDragging(false);
    
    const startVal = percent;
    const targetVal = skill.level;
    const compression = Math.abs(startVal - targetVal);
    
    // RELEASE IGNITION - SNAP TO COLORS (RED LIQUID / CYAN NUMBERS)
    if (fillRef.current) fillRef.current.style.backgroundColor = 'var(--accent-blood)';
    if (labelRef.current) labelRef.current.style.color = 'var(--accent-cursed)';

    // VIOLENT SNAPBACK: Higher stiffness = Faster snap. Low damping = More overshoot.
    const stiffness = 120 + (compression * 3);
    const proxy = { val: startVal };
    
    animRef.current = anime(proxy, {
      val: targetVal,
      // Damping = 1.0 ensures aggressive oscillation past target (OVERSHOOT)
      easing: `spring(1, ${stiffness}, 1, 0)`,
      onUpdate: () => {
        const v = proxy.val;
        // DIRECT DOM INJECTION FOR HIGH-SPEED VISIBILITY
        if (fillRef.current) fillRef.current.style.width = `${v}%`;
        if (labelRef.current) labelRef.current.innerText = `${Math.round(v)}%`;
        
        // COLLISION FLASH
        setColliding(v >= 100 || v <= 0);
      },
      onComplete: () => {
        setPercent(targetVal);
        setColliding(false);
      }
    });
  };

  // Visual state for the container
  const isCurrentlyColliding = colliding;

  return (
    <div className="relative group/skill select-none">
      <div className="flex justify-between items-baseline mb-1">
        <span className={`text-sm md:text-base font-bold font-sans text-[var(--text-bone)] uppercase transition-colors ${isDragging ? "opacity-50" : ""}`}>{skill.name}</span>
        <span 
          ref={labelRef}
          className={`text-xs font-mono font-bold transition-transform ${isDragging ? "scale-110" : ""}`}
          style={{ color: 'var(--accent-cursed)' }}
        >
          {Math.round(percent)}%
        </span>
      </div>
      
      <div 
        ref={barRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`h-[24px] md:h-[20px] bg-black border w-full relative transition-colors duration-100 cursor-ew-resize touch-none ${isCurrentlyColliding ? "border-white bg-white/40" : "border-[var(--text-bone)]"}`}
      >

        <div
          ref={fillRef}
          className="absolute top-0 bottom-0 left-0 bg-[var(--accent-blood)] origin-left will-change-[width]"
          style={{ 
            width: `${percent}%`,
            boxShadow: colliding ? '0 0 25px #fff' : 'none'
          }}
        />
        <div className="absolute inset-0 halftone-bg mix-blend-multiply opacity-50 pointer-events-none" />
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
      className="relative z-20 pt-[34px] pb-[34px] md:pt-[98px] md:pb-[98px] px-4 md:px-8 section-fade bg-[var(--bg-ink)] flex flex-col items-center overflow-hidden isolate transform-gpu
                 before:absolute before:-top-[150px] before:left-0 before:right-0 before:h-[150px] before:bg-[var(--bg-ink)] before:pointer-events-none"
    >
      {/* Background Halftone Drop */}
      <div className="absolute inset-0 halftone-bg z-0 opacity-20 pointer-events-none" />

      {/* Vertical Watermark */}
      <SubliminalKanji kanji={language === 'ja' || language === 'zh-tw' ? "経験" : language === 'ko' ? "경험" : language === 'hi' ? "अनुभव" : "EXPERIENCE"} position="right" />

      {/* Massive Section Title (MAPPA Background Text Style) */}
      <div className="absolute top-10 left-0 right-0 flex justify-center pointer-events-none overflow-hidden z-0 opacity-10 select-none">
          <h2 className={`text-[8rem] md:text-[20rem] font-black uppercase whitespace-nowrap leading-none tracking-tighter ${language === 'hi' ? 'font-hindi' : 'font-display'} text-[var(--text-bone)]`} style={{ transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
             {language === 'en' ? 'ORIGIN' : language === 'ja' ? '源' : language === 'ko' ? '기원' : language === 'zh-tw' ? '關於' : language === 'fr' ? 'ORIGINE' : language === 'id' ? 'ASAL' : 'मूल'}
          </h2>
      </div>

      <div className="w-full max-w-7xl relative flex flex-col gap-12 lg:gap-24 mt-[10px] md:mt-32">
        
        <ScrollReveal duration={1200} className="w-full">
          <div className="manga-panel p-5 md:p-14 bg-white text-black brutal-shadow manga-cut-tr border-2 md:border-4 border-black relative">
            <div className={`absolute top-0 right-0 bg-[var(--accent-blood)] text-white font-black px-6 py-2 text-xl tracking-widest border-l-4 border-b-4 border-black ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
              {language === 'en' ? 'CHAPTER 02' : language === 'ja' ? '第二章' : language === 'ko' ? '제 2 장' : language === 'zh-tw' ? '第二章' : language === 'fr' ? 'CHAPITRE 02' : language === 'id' ? 'BAB 02' : 'अध्याय 02'}
            </div>
            
            <div className="grid lg:grid-cols-[1fr_200px] gap-12 mt-6 relative">
               <div>
                 <h3 className={`text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-[-0.02em] leading-[0.85] mb-8 ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
                   {language === 'en' ? "Software" : language === 'ja' ? "ソフトウェア" : language === 'ko' ? "소프트웨어" : language === 'zh-tw' ? "軟體" : language === 'fr' ? "Ingénieur" : language === 'id' ? "Insinyur" : "सॉफ्टवेयर"} <br /> <span className="text-[var(--accent-blood)] stroke-black" style={{ WebkitTextStroke: "2px black", color: "transparent" }}>{language === 'en' ? "Engineer" : language === 'ja' ? "エンジニア" : language === 'ko' ? "엔지니어" : language === 'zh-tw' ? "工程師" : language === 'fr' ? "Logiciel" : language === 'id' ? "Perangkat Lunak" : "इंजीनियर"}</span>
                 </h3>
                 <p className="text-base sm:text-lg md:text-xl font-sans font-bold leading-relaxed text-black/80 max-w-2xl border-l-4 border-black pl-6">
                   {currentProfile.bio}
                 </p>

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
                           {language === 'en' ? "Academic Topper" : language === 'ja' ? "成績優秀者" : language === 'ko' ? "성적 우수자" : language === 'zh-tw' ? "成績優秀者" : language === 'fr' ? "Major de Promotion" : language === 'id' ? "Lulusan Terbaik" : "अकादमिक टॉपर"}
                        </div>
                    </div>
                 </div>
               </div>
               
               <div className="hidden lg:flex justify-end items-center relative h-full">
                   <div className="absolute text-[8rem] font-black font-display leading-none text-black/5 rotate-90 whitespace-nowrap origin-center select-none">
                           {language === "en" ? "DESCRIPTION" : language === "ja" ? "説明" : language === "ko" ? "설명" : language === "zh-tw" ? "描述" : language === "fr" ? "DESCRIPTION" : language === "id" ? "DESKRIPSI" : "विवरण"}
                   </div>
               </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 w-full">
          <ScrollReveal duration={1200} delay={200} className="w-full">
            <div className="flex flex-col border-2 md:border-4 border-[var(--text-bone)] bg-white brutal-shadow">
               <div className={`bg-black text-[var(--text-bone)] font-black uppercase tracking-widest text-2xl md:text-5xl px-6 py-4 flex items-center ${language === 'hi' ? 'font-hindi' : 'font-display'}`} style={{ transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
                   {language === 'en' ? <>RECORDED <br/> EXPERIENCE</> : language === 'ja' ? <>記録された<br/>経験</> : language === 'ko' ? <>기록된<br/>경험</> : language === 'zh-tw' ? <>已記錄的<br/>工作經驗</> : language === 'fr' ? <>EXPÉRIENCE <br/> ENREGISTRÉE</> : language === 'id' ? <>DOKUMENTASI <br/> PENGALAMAN</> : <>दर्ज <br/> अनुभव</>}
               </div>
               
               <div className="flex flex-col bg-white">
                 {currentProfile.experience.map((job, i) => (
                   <div key={job.company} className="relative group border-b-4 border-black last:border-b-0 p-6 md:p-8 hover:bg-black hover:text-white transition-colors duration-300">
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

          <ScrollReveal duration={1200} delay={300} direction="up" className="w-full">
            <div className="manga-panel p-4 md:p-12 border-2 md:border-4 border-[var(--text-bone)] bg-[var(--bg-darker)] manga-cut-br flex flex-col gap-8 md:gap-12 overflow-hidden">
              
              <div className="grid grid-cols-2 gap-3 md:gap-8 bg-white p-4 md:p-6 border-2 border-black">
                  <MangaStat value={306} label={language === 'en' ? "Algorithms" : language === 'ja' ? "アルゴリズム" : language === 'ko' ? "알고리즘" : language === 'zh-tw' ? "演算法" : language === 'fr' ? "Algorithmes" : language === 'id' ? "Algoritma" : "एल्गोरिदम"} prefix=">" />
                  <MangaStat value={11} label={language === 'en' ? "Systems Built" : language === 'ja' ? "構築済システム" : language === 'ko' ? "구축된 시스템" : language === 'zh-tw' ? "已構建系統" : language === 'fr' ? "Systèmes Construits" : language === 'id' ? "Sistem Dibangun" : "सिस्टम बनाए"} prefix="" />
              </div>

              <div ref={skillsRef} className="flex flex-col gap-6">
                 <h4 className={`text-[var(--text-bone)] font-black text-2xl uppercase tracking-widest border-b-2 border-[var(--panel-border)] pb-2 flex items-center justify-between ${language === 'hi' ? 'font-hindi' : 'font-display'}`}>
                     {language === 'en' ? "Core Expertise" : language === 'ja' ? "主な専門分野" : language === 'ko' ? "핵심 전문 분야" : language === 'zh-tw' ? "核心專業領域" : language === 'fr' ? "Expertise Fondamentale" : language === 'id' ? "Keahlian Inti" : "मुख्य विशेषज्ञता"}
                    <span className="text-[10px] font-mono text-[var(--accent-blood)]">MAX 100%</span>
                 </h4>
                 <div className="space-y-6">
                    {currentProfile.skills.map((skill, i) => (
                      <InteractiveSkillBar 
                        key={skill.name} 
                        skill={skill} 
                        isVisible={skillsVisible} 
                        index={i} 
                      />
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
