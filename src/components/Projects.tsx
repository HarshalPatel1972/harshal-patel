"use client";

import { projects } from "@/data/projects";
import { ScrollReveal } from "./ScrollReveal";
import { useTilt, useParallax } from "./AnimationKit";
import { useRef } from "react";

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const tiltRef = useTilt(8);

  return (
    <a
      ref={tiltRef as any}
      href={project.link}
      className={`group glass-card p-6 md:p-8 block h-full relative overflow-hidden cursor-pointer hover:border-white/15 transition-colors duration-500 ${
        index === 0 ? "md:col-span-2 lg:col-span-2" : ""
      }`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"
        style={{ background: `linear-gradient(90deg, ${project.color}, transparent)` }}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(400px circle at 50% 0%, ${project.color}15, transparent 70%)` }}
      />

      <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
        <span className="text-[11px] font-mono tracking-widest mb-6 block" style={{ color: project.color }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-white transition-colors" style={{ fontFamily: "var(--font-display)" }}>
          {project.title}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed mb-6 group-hover:text-white/70 transition-colors">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="text-[11px] font-mono px-2.5 py-1 rounded-full border border-white/10 text-white/40 group-hover:border-white/20 group-hover:text-white/60 transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Arrow */}
      <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60">
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </div>
    </a>
  );
}

export function Projects() {
  const parallaxBlob = useParallax(0.2);

  return (
    <section id="projects" className="relative py-32 px-6 section-fade">
      <div ref={parallaxBlob as any} className="gradient-blob w-[500px] h-[500px] top-[20%] left-[-10%]"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <span className="text-sm font-mono text-violet-400 tracking-widest uppercase mb-4 block">Featured Work</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-16" style={{ fontFamily: "var(--font-display)" }}>
            Things I&apos;ve <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">Built</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 100} className={i === 0 ? "md:col-span-2 lg:col-span-2" : ""}>
              <ProjectCard project={project} index={i} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
