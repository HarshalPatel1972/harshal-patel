"use client";

import React from "react";
import { profile } from "@/data/profile";
import { useLanguage } from "@/context/LanguageContext";

export function About() {
  const { language } = useLanguage();
  const currentProfile = profile[language as keyof typeof profile] || profile.en;

  const sectionTitles = {
    en: {
      about: "ABOUT ME",
      heading: "System Architecture & Life",
      bioTitle: "Biography",
      eduTitle: "Education",
      expTitle: "Work History",
      skillsTitle: "Core Capabilities"
    },
    ja: {
      about: "自己紹介",
      heading: "システムアーキテクチャと経歴",
      bioTitle: "略歴",
      eduTitle: "学歴",
      expTitle: "職歴",
      skillsTitle: "コアスキル"
    },
    ko: {
      about: "자기소개",
      heading: "시스템 아키텍처 및 연혁",
      bioTitle: "약력",
      eduTitle: "학력",
      expTitle: "경력",
      skillsTitle: "핵심 기술"
    },
    "zh-tw": {
      about: "關於我",
      heading: "系統架構與生平",
      bioTitle: "生平簡介",
      eduTitle: "學歷",
      expTitle: "工作經歷",
      skillsTitle: "核心能力"
    },
    hi: {
      about: "मेरे बारे में",
      heading: "सिस्टम आर्किटेक्चर और जीवन",
      bioTitle: "जीवनी",
      eduTitle: "शिक्षा",
      expTitle: "कार्य अनुभव",
      skillsTitle: "प्रमुख क्षमताएं"
    },
    eridian: {
      about: "HARSHAL-DATA",
      heading: "ENGINEER CORE LIFE-DATA",
      bioTitle: "CORE-INFO",
      eduTitle: "LEARN-DATA",
      expTitle: "WORK-DATA",
      skillsTitle: "POWER-LEVEL"
    }
  };

  const t = sectionTitles[language as keyof typeof sectionTitles] || sectionTitles.en;

  return (
    <section 
      id="about" 
      className="relative py-24 px-6 md:px-16 lg:px-24 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white z-10 overflow-hidden"
    >
      {/* Visual background lights */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-sm font-mono tracking-[0.2em] text-violet-400 uppercase">
            {t.about}
          </h2>
          <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            {t.heading}
          </h3>
        </div>

        {/* Multi-grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Bio & Education */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Biography glassmorphism card */}
            <div className="p-6 md:p-8 rounded-2xl bg-neutral-900/40 border border-white/[0.04] backdrop-blur-md space-y-4">
              <h4 className="text-lg font-mono text-cyan-400 tracking-wider uppercase border-b border-white/5 pb-2">
                ⚡ {t.bioTitle}
              </h4>
              <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-light">
                {currentProfile.bio}
              </p>
            </div>

            {/* Education Info */}
            <div className="p-6 md:p-8 rounded-2xl bg-neutral-900/40 border border-white/[0.04] backdrop-blur-md space-y-6">
              <h4 className="text-lg font-mono text-violet-400 tracking-wider uppercase border-b border-white/5 pb-2">
                🎓 {t.eduTitle}
              </h4>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h5 className="text-base font-bold text-white">
                    {currentProfile.education?.school}
                  </h5>
                  <p className="text-sm text-neutral-400 font-light">
                    {currentProfile.education?.degree}
                  </p>
                </div>
                <div className="text-left md:text-right space-y-1 font-mono text-xs text-neutral-500">
                  <div className="text-cyan-400 font-semibold">{currentProfile.education?.years}</div>
                  <div>GPA: <span className="text-white font-bold">{currentProfile.education?.gpa}</span></div>
                </div>
              </div>

              {/* Chandigarh University Premium Alumni Badge */}
              <div className="p-4 bg-cyan-950/15 border border-cyan-500/20 rounded-xl flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold">
                  CU
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">ALUMNI NETWORK</span>
                  <p className="text-[11px] text-neutral-300 font-light">
                    {language === "hi" 
                      ? "चंडीगढ़ विश्वविद्यालय के पूर्व छात्र नेटवर्क के एक गर्वित सदस्य।" 
                      : "Proud member and alum of Chandigarh University Engineering community."}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Work History & Skills */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Work History Timeline */}
            <div className="p-6 md:p-8 rounded-2xl bg-neutral-900/40 border border-white/[0.04] backdrop-blur-md space-y-6">
              <h4 className="text-lg font-mono text-cyan-400 tracking-wider uppercase border-b border-white/5 pb-2">
                💼 {t.expTitle}
              </h4>
              
              <div className="space-y-6 relative pl-4 border-l border-white/10">
                {currentProfile.experience?.map((exp, idx) => (
                  <div key={idx} className="space-y-2 relative">
                    {/* Circle bullet */}
                    <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-cyan-500 border-2 border-neutral-950" />
                    
                    <div className="flex justify-between items-baseline gap-2">
                      <h5 className="text-sm font-bold text-white">{exp.company}</h5>
                      <span className="text-[10px] font-mono text-cyan-400 whitespace-nowrap">{exp.period}</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium">{exp.role}</p>
                    <p className="text-xs text-neutral-500 leading-relaxed font-light">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Capability levels */}
            <div className="p-6 md:p-8 rounded-2xl bg-neutral-900/40 border border-white/[0.04] backdrop-blur-md space-y-6">
              <h4 className="text-lg font-mono text-violet-400 tracking-wider uppercase border-b border-white/5 pb-2">
                🛠️ {t.skillsTitle}
              </h4>

              <div className="space-y-4">
                {currentProfile.skills?.map((skill, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-neutral-300">
                      <span>{skill.name}</span>
                      <span style={{ color: skill.color }}>{skill.level}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${skill.level}%`,
                          backgroundColor: skill.color || "var(--accent-blood)"
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
