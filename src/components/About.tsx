"use client";

import { profile } from "@/data/profile";
import { ScrollReveal } from "./ScrollReveal";
import { useCounter, useParallax } from "./AnimationKit";
import { useEffect, useRef, useState } from "react";

function AnimatedStat({ value, label }: { value: number; label: string }) {
  const countRef = useCounter(value, 2000);
  return (
    <div className="glass-card p-4 text-center group hover:border-white/15 transition-colors">
      <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
        <span ref={countRef as any}>0</span>{label === "CGPA" ? "" : "+"}
      </div>
      <div className="text-[11px] font-mono text-white/30 mt-1 uppercase">{label}</div>
    </div>
  );
}

export function About() {
  const [skillsVisible, setSkillsVisible] = useState(false);
  const skillsRef = useRef<HTMLDivElement>(null);
  const parallaxBlob = useParallax(-0.12);

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
    <section id="about" className="relative py-32 px-6 section-fade">
      <div ref={parallaxBlob as any} className="gradient-blob w-[500px] h-[500px] top-[30%] right-[-10%]"
        style={{ background: "radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <span className="text-sm font-mono text-teal-400 tracking-widest uppercase mb-4 block">About Me</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-16" style={{ fontFamily: "var(--font-display)" }}>
            Who I <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Am</span>
          </h2>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-10">
            <ScrollReveal delay={100}>
              <p className="text-lg text-white/70 leading-relaxed">{profile.bio}</p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <h3 className="text-sm font-mono text-emerald-400 tracking-widest uppercase mb-6">Experience</h3>
              <div className="space-y-6">
                {profile.experience.map((job) => (
                  <div key={job.company} className="glass-card p-5 group hover:border-white/15 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-white font-semibold">{job.company}</h4>
                        <p className="text-white/50 text-sm">{job.role}</p>
                      </div>
                      <span className="text-[11px] font-mono text-white/30 shrink-0 ml-4">{job.period}</span>
                    </div>
                    <p className="text-white/40 text-sm leading-relaxed">{job.description}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          <div className="space-y-10">
            <ScrollReveal delay={150} direction="right">
              <div className="glass-card p-6">
                <h3 className="text-sm font-mono text-violet-400 tracking-widest uppercase mb-4">Education</h3>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-semibold text-lg">{profile.education.school}</h4>
                    <p className="text-white/50 text-sm">{profile.education.degree}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-white/30 block">{profile.education.years}</span>
                    <span className="text-emerald-400 font-bold text-sm">CGPA: {profile.education.gpa}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={250} direction="right">
              <div ref={skillsRef}>
                <h3 className="text-sm font-mono text-rose-400 tracking-widest uppercase mb-6">Technical Skills</h3>
                <div className="space-y-5">
                  {profile.skills.map((skill, i) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-white/70">{skill.name}</span>
                        <span className="text-[11px] font-mono text-white/30">{skill.level}%</span>
                      </div>
                      <div className="skill-bar">
                        <div
                          className={`skill-bar-fill ${skillsVisible ? "animate" : ""}`}
                          style={{
                            background: `linear-gradient(90deg, ${skill.color}, ${skill.color}80)`,
                            maxWidth: `${skill.level}%`,
                            width: "100%",
                            transitionDelay: `${i * 150}ms`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Animated counters */}
            <ScrollReveal delay={350} direction="right">
              <div className="grid grid-cols-3 gap-3">
                <AnimatedStat value={300} label="LeetCode" />
                <AnimatedStat value={8} label="CGPA" />
                <AnimatedStat value={6} label="Projects" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
