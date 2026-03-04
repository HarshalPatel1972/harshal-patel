"use client";

import { profile } from "@/data/profile";
import { ScrollReveal } from "./ScrollReveal";
import { useCounter, useTilt, useParallax } from "./AnimationKit";
import { useEffect, useRef, useState } from "react";
import { animate as anime, utils } from "animejs";

/**
 * 📊 Dynamic Barcode Generator
 */
function DynamicBarcode() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bars = containerRef.current?.querySelectorAll(".barcode-bar");
    if (!bars) return;
    
    // Randomly flutter the heights of the barcode
    bars.forEach((bar) => {
      const loop = () => {
        anime(bar as HTMLElement, {
          height: [`${utils.random(20, 100)}%`],
          duration: utils.random(200, 800),
          easing: "linear",
          onComplete: loop,
        });
      };
      loop();
    });
  }, []);

  return (
    <div ref={containerRef} className="flex items-end h-[50px] gap-[2px] opacity-20 hover:opacity-100 transition-opacity">
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="barcode-bar w-[2px] bg-emerald-400" style={{ height: `${Math.random() * 100}%` }} />
      ))}
    </div>
  );
}

/**
 * ⚛️ Skill Reactor (SVG Orbital Rings)
 */
function SkillReactor() {
  const reactorRef = useRef<SVGSVGElement>(null);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  useEffect(() => {
    if (!reactorRef.current) return;
    
    // Setup orbital spinning
    const rings = reactorRef.current.querySelectorAll(".skill-orbit");
    rings.forEach((ring, i) => {
      anime(ring as HTMLElement, {
        rotateZ: [0, 360],
        duration: 25000 + i * 5000, // Inner rings fast, outer rings slow
        easing: "linear",
        loop: true,
        direction: i % 2 === 0 ? "normal" : "reverse", // Alternating direction
      });
    });

    // Setup draw-in paths on render
    const paths = reactorRef.current.querySelectorAll(".skill-path");
    const observer = new IntersectionObserver(([entry]) => {
        if(entry.isIntersecting) {
            paths.forEach((path, i) => {
                const dash = path.getAttribute("data-dash") || "0";
                const circ = path.getAttribute("data-circ") || "0";
                anime(path as HTMLElement, {
                    strokeDashoffset: [circ, dash],
                    duration: 2000,
                    delay: i * 200,
                    easing: "outQuart"
                });
            });
            observer.disconnect();
        }
    }, { threshold: 0.1 });
    observer.observe(reactorRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[320px] mx-auto flex items-center justify-center">
      {/* Center Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">
          CAPACITY
        </span>
        <span className="text-xl font-bold font-mono tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
          {activeSkill ? profile.skills.find(s => s.name === activeSkill)?.level + "%" : "100%"}
        </span>
      </div>

      <svg ref={reactorRef} viewBox="0 0 300 300" className="w-full h-full overflow-visible">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g style={{ transformOrigin: '150px 150px', transform: 'rotate(-90deg)' }}>
          {profile.skills.map((skill, i) => {
            const radius = 45 + i * 20;
            const circumference = 2 * Math.PI * radius;
            const dashValue = circumference - (skill.level / 100) * circumference;
            const isHovered = activeSkill === skill.name;

            return (
              <g 
                key={skill.name} 
                className="skill-orbit cursor-pointer transition-all duration-300" 
                style={{ transformOrigin: '150px 150px' }}
                onMouseEnter={() => setActiveSkill(skill.name)}
                onMouseLeave={() => setActiveSkill(null)}
              >
                {/* Track */}
                <circle cx="150" cy="150" r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={isHovered ? 12 : 8} className="transition-all duration-300" />
                
                {/* Value Line */}
                <circle 
                  className="skill-path transition-all duration-300"
                  cx="150" cy="150" r={radius} 
                  fill="none" 
                  stroke={skill.color} 
                  strokeWidth={isHovered ? 12 : 5}
                  strokeDasharray={`${circumference} ${circumference}`}
                  data-dash={dashValue}
                  data-circ={circumference}
                  strokeDashoffset={circumference} // Starts hidden, animated by anime
                  strokeLinecap="round"
                  filter={isHovered ? "url(#glow)" : ""}
                  style={{ opacity: activeSkill && !isHovered ? 0.15 : 1 }}
                />
                
                {/* Invisible wide capture area for better hover */}
                <circle cx="150" cy="150" r={radius} fill="none" stroke="transparent" strokeWidth="20" />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

function Stat({ value, label, prefix = "" }: { value: number; label: string; prefix?: string }) {
  const countRef = useCounter(value, 2000);
  return (
    <div className="py-2 border-b border-white/5 last:border-0 group hover:pl-2 transition-all duration-300">
      <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest group-hover:text-emerald-400/50 transition-colors">{label}</div>
      <div className="text-xl font-bold font-mono text-white/90">
        {prefix}<span ref={countRef as any}>0</span>{label === "CGPA" ? "" : "+"}
      </div>
    </div>
  );
}

export function About() {
  const tiltRef = useTilt(3);
  const parallaxBlob = useParallax(0.1);

  return (
    <section id="about" className="relative py-32 px-4 md:px-6 section-fade overflow-hidden">
      <div ref={parallaxBlob as any} className="gradient-blob w-[600px] h-[600px] top-[10%] right-[-20%]"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <span className="text-sm font-mono text-emerald-400 tracking-widest uppercase mb-4 block">Identity Verification</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-16" style={{ fontFamily: "var(--font-display)" }}>
            Subject <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Profile</span>
          </h2>
        </ScrollReveal>

        {/* The Massive Biometric ID Card */}
        <ScrollReveal delay={200}>
          <div ref={tiltRef as any} className="glass-card p-0 overflow-hidden relative" style={{ transformStyle: 'preserve-3d' }}>
            
            {/* Grid layout inside the card */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr_1.5fr] divide-y lg:divide-y-0 lg:divide-x divide-white/5">
              
              {/* === COL 1: Status & Stats === */}
              <div className="p-8 bg-black/40 flex flex-col justify-between">
                <div>
                   {/* Avatar / Icon */}
                   <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/5 mb-6 flex items-center justify-center border border-emerald-500/20 relative overflow-hidden group shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                      <div className="absolute inset-0 bg-emerald-400/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                   </div>
                   
                   <div className="text-[10px] font-mono text-white/40 mb-1">SYSTEM_STATUS</div>
                   <div className="text-sm font-mono font-bold text-emerald-400 flex items-center gap-2 mb-10 border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 rounded inline-flex">
                     <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                     ONLINE_AND_READY
                   </div>
                </div>

                <div className="space-y-2 mb-12">
                   <Stat value={300} label="Algorithms Solved" prefix=">" />
                   <Stat value={8} label="CGPA" />
                   <Stat value={6} label="Systems Built" prefix="0" />
                </div>

                <div>
                   <div className="text-[10px] font-mono text-white/40 mb-2">AUTH_ID: XA-992</div>
                   <DynamicBarcode />
                </div>
              </div>

              {/* === COL 2: Bio & Logs === */}
              <div className="p-8 md:p-12 relative bg-white/[0.01]">
                 <div className="absolute top-0 right-0 p-6 opacity-5">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
                       <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                 </div>

                 <h3 className="text-2xl font-bold mb-6 text-white/90" style={{ fontFamily: "var(--font-display)" }}>Harshal Patel</h3>
                 <p className="text-white/60 text-sm md:text-base leading-relaxed mb-12">
                    {profile.bio}
                 </p>

                 <div className="space-y-8">
                    <div>
                       <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/5 pb-2">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                          Access Logs // Experience
                       </div>
                       
                       <div className="space-y-6">
                         {profile.experience.map((job) => (
                           <div key={job.company} className="relative pl-5 border-l border-white/10 group hover:border-emerald-400/30 transition-colors">
                             <div className="absolute left-[-3px] top-1.5 w-[5px] h-[5px] rounded-full bg-white/20 group-hover:bg-emerald-400 group-hover:shadow-[0_0_10px_#10b981] transition-all" />
                             
                             <div className="flex flex-wrap items-baseline justify-between mb-1">
                               <div className="text-white/90 font-medium">{job.company}</div>
                               <div className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded">{job.period}</div>
                             </div>
                             <div className="text-emerald-400/80 text-xs mb-2 font-mono">[{job.role}]</div>
                             <div className="text-white/40 text-[13px] leading-relaxed">{job.description}</div>
                           </div>
                         ))}
                       </div>
                    </div>
                 </div>
              </div>

              {/* === COL 3: Orbital Skill Reactor === */}
              <div className="p-8 bg-[#050508]/50 flex flex-col justify-between relative overflow-hidden">
                 <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-8 text-center flex items-center justify-center gap-2">
                    <span className="w-1 h-1 bg-white/30 rounded-full" /> Hardware Capabilities <span className="w-1 h-1 bg-white/30 rounded-full" />
                 </div>
                 
                 <SkillReactor />

                 <div className="mt-10 text-center text-[10px] font-mono text-white/40 grid grid-cols-2 gap-y-3 gap-x-2">
                   {profile.skills.map((s) => (
                     <div key={s.name} className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                       <span className="w-1.5 h-1.5 rounded-full shadow-sm" style={{ background: s.color, boxShadow: `0 0 5px ${s.color}` }} />
                       {s.name}
                     </div>
                   ))}
                 </div>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

