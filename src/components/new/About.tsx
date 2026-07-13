"use client";

import { profile } from "@/data/profile";
import { ScrollReveal } from "../ScrollReveal";
import { useEffect, useRef, useState } from "react";
import { animate as anime } from "animejs";
import { useLanguage } from "@/context/LanguageContext";
import { createPortal } from "react-dom";
import { useSignals } from "@/context/SignalContext";
import { useCounter } from "../AnimationKit";
import { SkillImpacts } from "./SkillImpacts";

// ─── Animated stat counter ────────────────────────────────────────────────────
function StudioStat({ value, label }: { value: number; label: string }) {
  const countRef = useCounter(value, 2000);
  return (
    <div className="flex flex-col gap-1">
      <div
        className="text-[10px] uppercase tracking-[0.25em]"
        style={{ fontFamily: "var(--font-jetbrains-mono), monospace", color: "var(--muted-label)" }}
      >
        {label}
      </div>
      <div
        className="font-black leading-none"
        style={{
          fontSize: "clamp(2rem,5vw,3.5rem)",
          fontFamily: "var(--font-big-shoulders), sans-serif",
          color: "var(--forge-orange)",
        }}
      >
        <span ref={countRef as React.Ref<HTMLSpanElement>}>0</span>+
      </div>
    </div>
  );
}

// ─── Wave Progress Meter ──────────────────────────────────────────────────────
function WaveSkillBar({
  skill,
  isVisible,
  index,
}: {
  skill: { name: string; level: number; color?: string };
  isVisible: boolean;
  index: number;
}) {
  const [displayed, setDisplayed] = useState(0);

  const skillColors = [
    "#C44D1C", // C++ / Systems
    "#2C5270", // Go (Golang)
    "#905B20", // TypeScript / React
    "#385C46", // Rust / WASM
    "#6D3C8A", // Python / AI
    "#2B6B61", // SQL / Bash
  ];
  const accent = skillColors[index % skillColors.length];

  useEffect(() => {
    if (!isVisible) return;
    const delay = index * 120;
    const proxy = { val: 0 };
    const timer = setTimeout(() => {
      anime(proxy, {
        val: skill.level,
        duration: 1500,
        easing: "easeOutCubic",
        onUpdate: () => {
          setDisplayed(Math.round(proxy.val));
        },
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [isVisible, skill.level, index]);

  const waveSvg = (color: string, opacity: string) => {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 24' preserveAspectRatio='none'>
        <path d='M0,12 Q10,6 20,12 T40,12 L40,24 L0,24 Z' fill='${color}' opacity='${opacity}'/>
      </svg>
    `)}`;
  };

  return (
    <div className="flex flex-col gap-2 w-full group">
      <style>{`
        @keyframes waveTravel1 {
          to { background-position-x: -50px; }
        }
        @keyframes waveTravel2 {
          to { background-position-x: -40px; }
        }
        @keyframes bubbleRise {
          0% { transform: translateY(10px) scale(0.5); opacity: 0; }
          30% { opacity: 0.6; }
          70% { opacity: 0.6; }
          100% { transform: translateY(-10px) scale(1.2); opacity: 0; }
        }
        .wave-travel-1 {
          animation: waveTravel1 3s linear infinite;
        }
        .wave-travel-2 {
          animation: waveTravel2 2s linear infinite;
        }
        .liquid-bubble {
          position: absolute;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: bubbleRise 2s ease-in infinite;
        }
      `}</style>
      <div className="flex justify-between items-end w-full">
        <span 
          className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] transition-opacity duration-300 group-hover:opacity-100" 
          style={{ color: "var(--sumi-ink)", opacity: 0.8 }}
        >
          {skill.name}
        </span>
        <span 
          className="font-bold text-lg leading-none" 
          style={{ color: accent, fontFamily: "var(--font-big-shoulders), sans-serif" }}
        >
          {displayed}%
        </span>
      </div>
      
      {/* Track & Fill Container */}
      <div 
        className="relative h-[24px] sm:h-[28px] w-full mt-1 rounded-full overflow-hidden shadow-inner" 
        style={{ 
          backgroundColor: "rgba(22, 29, 26, 0.05)",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)" 
        }}
      >
        
        {/* Growing Liquid Container */}
        <div 
          className="absolute top-0 bottom-0 left-0 h-full overflow-hidden rounded-full"
          style={{
            width: isVisible ? `${skill.level}%` : '0%',
            transition: 'width 2s cubic-bezier(0.2, 0.8, 0.2, 1)',
            transitionDelay: `${index * 120}ms`,
          }}
        >
          {/* Back Wave (Slower, Wider, Semi-transparent) */}
          <div 
            className="absolute top-0 left-0 h-full w-[200vw] wave-travel-1"
            style={{
              backgroundImage: `url("${waveSvg(accent, '0.4')}")`,
              backgroundRepeat: 'repeat-x',
              backgroundPosition: '0 center',
              backgroundSize: '50px 100%',
            }}
          />

          {/* Front Wave (Faster, Narrower, Opaque) */}
          <div 
            className="absolute top-0 left-0 h-full w-[200vw] wave-travel-2"
            style={{
              backgroundImage: `url("${waveSvg(accent, '0.9')}")`,
              backgroundRepeat: 'repeat-x',
              backgroundPosition: '0 center',
              backgroundSize: '40px 100%',
            }}
          />

          {/* Bubbles (Attached to viewport width so they don't slide horizontally as the bar grows) */}
          <div className="absolute top-0 left-0 w-[100vw] h-full pointer-events-none mix-blend-overlay">
            {Array.from({ length: 15 }).map((_, i) => (
              <div 
                key={i}
                className="liquid-bubble" 
                style={{ 
                  left: `${i * 30 + 15}px`, 
                  width: `${(i % 3) + 3}px`, 
                  height: `${(i % 3) + 3}px`,
                  animationDuration: `${1.5 + (i % 4) * 0.4}s`, 
                  animationDelay: `${(i % 5) * 0.3}s` 
                }} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Experience timeline node ─────────────────────────────────────────────────
function TimelineNode({
  job,
  index,
}: {
  job: { company: string; role: string; period: string; description: string };
  index: number;
}) {
  const items = job.description.split(";").map(item => item.trim()).filter(Boolean);
  const isEven = index % 2 === 0;
  const accent = isEven ? "var(--forge-orange)" : "var(--blueprint-blue)";

  return (
    <div className="relative pl-10 md:pl-14 pb-12 group last:pb-0 select-none">
      {/* ── Vertical Workbench Ruler Track ── */}
      <div className="absolute left-4 top-2 bottom-0 w-[1px] bg-[var(--sumi-ink)]/15 group-last:hidden" />
      <div className="absolute left-4 top-2 h-full flex flex-col justify-between pointer-events-none opacity-20 group-last:hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="w-4 h-[1px] bg-[var(--sumi-ink)] -translate-x-[6px]" />
        ))}
      </div>

      {/* ── Technical Calibration Node ── */}
      <div 
        className="absolute left-[9px] top-1.5 w-[15px] h-[15px] flex items-center justify-center bg-[var(--studio-warm)] transition-transform duration-300 group-hover:rotate-90 z-10"
      >
        {/* Crosshair indicator */}
        <div className="absolute w-full h-[1px] bg-[var(--sumi-ink)]/30" />
        <div className="absolute h-full w-[1px] bg-[var(--sumi-ink)]/30" />
        <div 
          className="w-2 h-2 rounded-full z-20" 
          style={{ background: accent }}
        />
      </div>

      {/* ── Blueprint Folder Dossier ── */}
      <div className="relative flex flex-col items-start w-full">
        {/* Folder tab */}
        <div 
          className="px-4 py-1 text-[10px] font-mono tracking-widest uppercase font-bold text-[#F0EDE8] translate-y-[1px] z-10 shadow-[2px_-2px_6px_rgba(0,0,0,0.05)] rounded-t-sm"
          style={{ background: accent }}
        >
          dossier // {String(index + 1).padStart(2, "0")}
        </div>

        {/* Folder Card Body */}
        <div 
          className="w-full bg-white/40 backdrop-blur-sm border-2 border-dashed border-[var(--sumi-ink)]/15 p-6 md:p-8 hover:bg-white/70 hover:border-[var(--sumi-ink)]/30 transition-all duration-500 shadow-[3px_6px_20px_rgba(26,23,20,0.03)] hover:shadow-[6px_12px_28px_rgba(26,23,20,0.08)] rounded-tr-md rounded-b-md relative overflow-hidden text-left"
        >
          {/* Blueprint background grid */}
          <div 
            className="absolute inset-0 pointer-events-none z-0 opacity-15"
            style={{
              backgroundImage: `radial-gradient(circle, var(--sumi-ink) 1px, transparent 1px)`,
              backgroundSize: "16px 16px"
            }}
          />

          <div className="relative z-10 flex flex-col gap-4">
            
            {/* Header: Role & Period */}
            <div className="flex flex-col gap-1">
              <h4 
                className="text-2xl sm:text-3xl font-black font-display tracking-tight leading-tight uppercase text-[var(--sumi-ink)]"
                style={{ fontFamily: "var(--font-big-shoulders), sans-serif" }}
              >
                {job.role}
              </h4>
              
              <div className="flex flex-wrap gap-2 items-center text-[10px] font-mono tracking-widest text-[var(--muted-label)] mt-1.5">
                <span className="font-bold text-[var(--sumi-ink)]">{job.company.toUpperCase()}</span>
                <span>•</span>
                <span className="border border-[var(--sumi-ink)]/10 px-2 py-0.5 rounded-sm bg-white/30">{job.period}</span>
              </div>
            </div>

            {/* Schematic separator line */}
            <div className="h-[2px] w-full flex items-center gap-1 opacity-25">
              <div className="h-full w-4" style={{ background: accent }} />
              <div className="h-full flex-1 bg-[var(--sumi-ink)] border-b border-dashed" />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
            </div>

            {/* Achievements details */}
            <div className="flex flex-col gap-3.5 mt-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 select-none">
                  {/* Hex Diagnostic bullet */}
                  <span 
                    className="text-[10px] font-mono font-bold px-1.5 py-0.5 border bg-white/60 shrink-0 select-none text-center min-w-8"
                    style={{ borderColor: "rgba(26,23,20,0.15)", color: accent }}
                  >
                    [{String(idx + 1).padStart(2, "0")}]
                  </span>
                  
                  <span className="font-sans font-light text-sm leading-relaxed text-[var(--sumi-ink)]/85 flex-1">
                    {item}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main About Section ───────────────────────────────────────────────────────
export function About() {
  const { language } = useLanguage();
  const currentProfile = profile[language as keyof typeof profile] || profile.en;
  const sectionRef = useRef<HTMLElement>(null);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [showPressureVideo, setShowPressureVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const gaugesRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { triggerSignal } = useSignals();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = gaugesRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSkillsVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const currentVideoSrc = language === "hi" ? "/pressure.mp4" : "/pressure-eng.mp4";

  const triggerPressure = () => {
    setShowPressureVideo(true);
    triggerSignal("PRESSURE");
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const closePressure = () => {
    setShowPressureVideo(false);
    if (videoRef.current) videoRef.current.pause();
  };

  const chapterLabel = (() => {
    switch (language) {
      case "ja": case "zh-tw": return "第二章";
      case "ko": return "제 2 장";
      case "fr": return "CHAPITRE 02";
      case "id": return "BAB 02";
      case "de": return "KAPITEL 02";
      case "it": return "CAPITOLO 02";
      case "pt-br": case "es-419": case "es": return "CAPÍTULO 02";
      case "hi": return "अध्याय 02";
      case "eridian": return "PART-TWO-THING";
      default: return "CHAPTER 02";
    }
  })();

  const titleFilled = (() => {
    switch (language) {
      case "ja": return "ソフトウェア"; case "ko": return "소프트웨어";
      case "zh-tw": return "軟體"; case "fr": return "Ingénieur";
      case "id": return "Insinyur"; case "de": return "Software";
      case "it": return "Ingegnere"; case "pt-br": case "es-419": case "es": return "Ingeniero de";
      case "hi": return "सॉफ्टवेयर"; case "eridian": return "SOFTWARE";
      default: return "Software";
    }
  })();

  const titleOutline = (() => {
    switch (language) {
      case "ja": return "エンジニア"; case "ko": return "엔지니어";
      case "zh-tw": return "工程師"; case "fr": return "Logiciel";
      case "id": return "Perangkat Lunak"; case "de": return "Ingenieur";
      case "it": return "Software"; case "pt-br": case "es-419": case "es": return "Software";
      case "hi": return "इंजीनियर"; case "eridian": return "ENGINEER";
      default: return "Engineer";
    }
  })();

  const originWatermark = (() => {
    switch (language) {
      case "ja": return "源"; case "ko": return "기원"; case "zh-tw": return "關於";
      case "fr": return "ORIGINE"; case "id": return "ASAL"; case "de": return "HERKUNFT";
      case "it": return "ORIGINE"; case "pt-br": return "ORIGEM";
      case "es-419": case "es": return "ORIGEN"; case "hi": return "मूल";
      case "eridian": return "DATA-ORIGIN"; default: return "ORIGIN";
    }
  })();

  const coreExpertiseLabel = (() => {
    switch (language) {
      case "ja": return "スキル・インパクト"; case "ko": return "스킬 임팩트";
      case "zh-tw": return "技能影響"; case "fr": return "Impacts des Compétences";
      case "id": return "Dampak Keahlian"; case "de": return "Skill Impacts";
      case "it": return "Impatti delle Competenze"; case "pt-br": return "Impactos de Habilidades";
      case "es-419": case "es": return "Impactos de Habilidades"; case "hi": return "कौशल प्रभाव";
      case "eridian": return "SKILL-SPLAT"; default: return "Skill Impacts";
    }
  })();

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-20 pt-8 md:pt-12 pb-16 md:pb-24 px-4 md:px-8 flex flex-col items-center overflow-hidden isolate transform-gpu blueprint-grid-warm"
    >
      {/* Background watermark */}
      <div className="absolute top-[-2rem] left-0 right-0 flex justify-center pointer-events-none overflow-hidden z-0 select-none" style={{ opacity: 0.06 }}>
        <h2
          className="font-black uppercase whitespace-nowrap leading-none tracking-tighter text-[var(--copper)]"
          style={{ fontSize: "clamp(8rem,20vw,20rem)", fontFamily: "var(--font-big-shoulders), sans-serif" }}
        >
          {originWatermark}
        </h2>
      </div>

      {/* Pressure video portal */}
      {mounted && createPortal(
        <div className={`fixed inset-0 z-[1000] flex items-center justify-center transition-all duration-700 ${showPressureVideo ? "bg-black/95 opacity-100 backdrop-blur-2xl pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div className={`relative w-[280px] sm:w-[500px] md:w-[700px] lg:w-[900px] aspect-video bg-black border-4 border-white shadow-[0_0_100px_var(--forge-orange)] transition-transform duration-700 ${showPressureVideo ? "scale-100 translate-y-0" : "scale-50 translate-y-20"}`}>
            <video
              ref={videoRef}
              src={currentVideoSrc}
              preload={skillsVisible ? "auto" : "metadata"}
              playsInline
              onEnded={closePressure}
              className="w-full h-full object-cover"
            />
            <button onClick={closePressure} className="absolute -top-6 -right-6 w-12 h-12 bg-[var(--forge-orange)] text-white font-black border-4 border-black flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-50">
              ✕
            </button>
          </div>
        </div>,
        document.body
      )}

      <div 
        className="w-full max-w-7xl relative flex flex-col gap-16"
        style={{ marginTop: "calc(clamp(8rem,20vw,20rem) * -0.2)" }}
      >

        {/* ── MAIN PAPER CARD (vision board) ── */}
        <ScrollReveal duration={1200} className="w-full">
          <div
            className="relative p-5 md:p-14"
            style={{
              background: "var(--aged-paper)",
              boxShadow: "0 4px 40px rgba(15,13,10,0.12), inset 0 0 0 1px rgba(138,127,114,0.2)",
            }}
          >
            {/* Pushpin corners */}
            {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos) => (
              <div
                key={pos}
                className={`absolute w-3 h-3 rounded-full hidden md:block ${pos}`}
                style={{ background: "var(--forge-orange)", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
              />
            ))}

            {/* Chapter badge */}
            <div
              className="inline-block mb-6 px-3 py-1 text-xs tracking-widest font-bold"
              style={{
                background: "var(--sumi-ink)",
                color: "var(--chalk)",
                fontFamily: "var(--font-jetbrains-mono), monospace",
              }}
            >
              {chapterLabel}
            </div>

            <div className="grid lg:grid-cols-[1fr_240px] gap-12 mt-2 relative">
              <div>
                {/* Title */}
                <h3
                  className="uppercase tracking-[-0.02em] leading-[0.85] mb-8"
                  style={{
                    fontSize: "clamp(2.5rem,7vw,5rem)",
                    fontFamily: "var(--font-big-shoulders), sans-serif",
                    fontWeight: 900,
                    color: "var(--sumi-ink)",
                  }}
                >
                  {titleFilled}{" "}
                  <span
                    style={{
                      color: "transparent",
                      WebkitTextStroke: "2px var(--forge-orange)",
                    }}
                  >
                    {titleOutline}
                  </span>
                </h3>

                {/* Bio */}
                <p
                  className="text-base md:text-lg leading-relaxed max-w-2xl border-l-[3px] pl-6"
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontWeight: 400,
                    color: "var(--sumi-ink)",
                    borderColor: "var(--forge-orange)",
                  }}
                >
                  {currentProfile.bio}
                </p>

                {/* Education */}
                <div
                  className="mt-8 pt-6 flex flex-col md:flex-row gap-6"
                  style={{ borderTop: "1px solid var(--muted-label)", opacity: 0.9 }}
                >
                  <div className="flex-1">
                    <div
                      className="text-[10px] mb-2 uppercase tracking-[0.3em]"
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        color: "var(--blueprint-blue)",
                      }}
                    >
                      Education
                    </div>
                    <div
                      className="font-black uppercase italic text-xl md:text-2xl"
                      style={{ fontFamily: "var(--font-big-shoulders), sans-serif", color: "var(--sumi-ink)" }}
                    >
                      {currentProfile.education.school}
                    </div>
                    <div
                      className="text-sm uppercase mt-1"
                      style={{
                        fontFamily: "var(--font-dm-sans), sans-serif",
                        color: "var(--muted-label)",
                      }}
                    >
                      {currentProfile.education.degree}
                      {" | "}
                      <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", color: "var(--forge-orange)" }}>
                        {currentProfile.education.years}
                      </span>
                    </div>
                  </div>

                  {/* GPA block */}
                  <div
                    className="px-6 py-4 flex flex-col justify-center"
                    style={{
                      background: "var(--dark-walnut)",
                      borderTop: "3px solid var(--forge-orange)",
                    }}
                  >
                    <div
                      className="text-[10px] tracking-widest uppercase mb-1"
                      style={{ fontFamily: "var(--font-jetbrains-mono), monospace", color: "var(--forge-orange)" }}
                    >
                      GPA Score
                    </div>
                    <div
                      className="font-black tracking-tighter text-2xl md:text-3xl"
                      style={{ fontFamily: "var(--font-big-shoulders), sans-serif", color: "var(--chalk)" }}
                    >
                      {currentProfile.education.gpa}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats column */}
              <div className="flex flex-row lg:flex-col justify-start gap-8 pt-2">
                <StudioStat value={300} label={language === "ja" ? "アルゴリズム" : language === "ko" ? "알고리즘" : language === "hi" ? "एल्गोरिदम" : "Algorithms"} />
                <StudioStat value={20} label={language === "ja" ? "構築済システム" : language === "ko" ? "구축된 시스템" : language === "hi" ? "सिस्टम बनाए" : "Systems Built"} />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ── LOWER SECTION: Experience + Gauge Dials ── */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 w-full">

          {/* Circuit-trace experience timeline */}
          <ScrollReveal duration={1200} delay={200} className="w-full">
            <div>
              <div
                className="font-black uppercase tracking-widest mb-8 text-xl md:text-2xl"
                style={{
                  fontFamily: "var(--font-big-shoulders), sans-serif",
                  color: "var(--sumi-ink)",
                  borderBottom: "2px solid var(--muted-label)",
                  paddingBottom: "0.5rem",
                  opacity: 0.7,
                }}
              >
                {language === "ja" ? "記録された経験" : language === "ko" ? "기록된 경험" : language === "hi" ? "दर्ज अनुभव" : "Recorded Experience"}
              </div>
              <div className="relative pl-2 ml-1 mt-2">
                {currentProfile.experience.map((job, i) => (
                  <TimelineNode
                    key={job.company}
                    job={job}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Analog gauge dials instrument panel */}
          <ScrollReveal duration={1200} delay={300} direction="up" className="w-full h-full">
            <div className="h-full flex flex-col">
              <div
                className="font-black uppercase tracking-widest mb-6 text-xl md:text-2xl"
                style={{
                  fontFamily: "var(--font-big-shoulders), sans-serif",
                  color: "var(--sumi-ink)",
                  borderBottom: "2px solid var(--muted-label)",
                  paddingBottom: "0.5rem",
                  opacity: 0.7,
                }}
              >
                {coreExpertiseLabel}
              </div>

              {/* Instrument panel */}
              <div
                className="p-[28px] relative flex-1 flex flex-col"
                ref={gaugesRef}
                style={{
                  background: "rgba(22, 29, 26, 0.015)",
                  borderRadius: "8px",
                  border: "1px dashed rgba(22, 29, 26, 0.2)",
                }}
              >
                <div
                  className="text-[9px] uppercase tracking-[0.3em] mb-6 opacity-60"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace", color: "var(--sumi-ink)" }}
                >
                  Skill Impacts
                </div>
                <div className="flex-1 w-full pt-2 h-full">
                  {skillsVisible && <SkillImpacts skills={currentProfile.skills} />}
                </div>

              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
