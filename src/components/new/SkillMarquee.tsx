"use client";

import React from "react";
import { skillPaths } from "./SkillIcons";

const getSkillBrand = (name: string) => {
  if (name.toLowerCase().includes("c++")) return { slug: "cplusplus", hex: "var(--sumi-ink)" };
  if (name.toLowerCase().includes("go")) return { slug: "go", hex: "var(--sumi-ink)" };
  if (name.toLowerCase().includes("typescript") || name.toLowerCase().includes("react")) return { slug: "typescript", hex: "var(--sumi-ink)" };
  if (name.toLowerCase().includes("rust")) return { slug: "rust", hex: "var(--sumi-ink)" }; 
  if (name.toLowerCase().includes("python")) return { slug: "python", hex: "var(--sumi-ink)" };
  return { slug: "gnubash", hex: "var(--sumi-ink)" };
};

export function SkillMarquee({ skills }: { skills: any[] }) {
  // We want to make a visually dense marquee.
  // We'll split the skills into two rows, and pad them if necessary.
  const mid = Math.ceil(skills.length / 2);
  const row1 = skills.slice(0, mid);
  const row2 = skills.slice(mid);

  // Duplicate elements multiple times to ensure the marquee can scroll infinitely 
  // without whitespace, since it needs to be wider than the container.
  const marquee1 = [...row1, ...row1, ...row1, ...row1, ...row1, ...row1];
  const marquee2 = [...row2, ...row2, ...row2, ...row2, ...row2, ...row2];

  return (
    <div 
      className="relative w-full overflow-hidden flex flex-col gap-4 py-8 select-none" 
      style={{ 
        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', 
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' 
      }}
    >
      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scrollLeft 30s linear infinite;
        }
        .animate-scroll-right {
          animation: scrollRight 30s linear infinite;
        }
        .skill-card-v2 {
          background-color: rgba(22, 29, 26, 0.04);
          border: 1px solid rgba(22, 29, 26, 0.1);
        }
        .skill-card-v2:hover {
          background-color: rgba(22, 29, 26, 0.08);
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(22, 29, 26, 0.08);
        }
      `}</style>
      
      {/* Row 1: Left scrolling */}
      <div className="flex w-max animate-scroll-left gap-4 hover:[animation-play-state:paused]">
        {marquee1.map((skill, i) => (
          <SkillCard key={`r1-${i}`} skill={skill} />
        ))}
      </div>

      {/* Row 2: Right scrolling */}
      <div className="flex w-max animate-scroll-right gap-4 hover:[animation-play-state:paused]">
        {marquee2.map((skill, i) => (
          <SkillCard key={`r2-${i}`} skill={skill} />
        ))}
      </div>
    </div>
  );
}

function SkillCard({ skill }: { skill: any }) {
  const brand = getSkillBrand(skill.name);
  return (
    <div 
      className="skill-card-v2 w-[110px] h-[110px] md:w-[130px] md:h-[130px] rounded-lg flex flex-col items-center justify-center gap-3 transition-all duration-300"
    >
      <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
        {skillPaths[brand.slug] ? (
           <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-sm" style={{ fill: brand.hex }}>
             <path d={skillPaths[brand.slug]} />
           </svg>
        ) : (
           <div className="w-full h-full bg-[var(--sumi-ink)] opacity-20 rounded-full" />
        )}
      </div>
      <span 
        className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-center px-2" 
        style={{ 
          fontFamily: "var(--font-jetbrains-mono), monospace",
          color: "var(--sumi-ink)"
        }}
      >
        {skill.name}
      </span>
    </div>
  );
}
