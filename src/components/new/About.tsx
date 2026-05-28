"use client";

import { profile } from "@/data/profile";
import { ScrollReveal } from "../ScrollReveal";
import { useEffect, useRef, useState } from "react";
import { animate as anime } from "animejs";
import { useLanguage } from "@/context/LanguageContext";
import { createPortal } from "react-dom";
import { useSignals } from "@/context/SignalContext";
import { useCounter } from "../AnimationKit";

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

// ─── Analog Gauge Dial (SVG arc) ──────────────────────────────────────────────
function GaugeDial({
  skill,
  isVisible,
  index,
}: {
  skill: { name: string; level: number; color?: string };
  isVisible: boolean;
  index: number;
}) {
  const [displayed, setDisplayed] = useState(0);

  const size = 90;
  const r = 36;
  const cx = size / 2;
  const cy = size / 2;

  const polar = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const describeArc = (pct: number) => {
    const startAngle = 135;
    const totalArc = 270;
    const endAngle = startAngle + (totalArc * pct) / 100;
    const s = polar(startAngle);
    const e = polar(endAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };

  useEffect(() => {
    if (!isVisible) return;
    const delay = index * 120;
    const proxy = { val: 0 };
    const timer = setTimeout(() => {
      anime(proxy, {
        val: skill.level,
        duration: 1000,
        easing: "easeOutQuad",
        onUpdate: () => {
          setDisplayed(Math.round(proxy.val));
        },
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [isVisible, skill.level, index]);

  const arcLength = 2 * Math.PI * r * 0.75;
  const strokeDashoffset = isVisible ? arcLength * (1 - skill.level / 100) : arcLength;

  const skillColors = [
    "#E8703A", // C++ / Systems
    "#4A7FA5", // Go (Golang)
    "#C4843A", // TypeScript / React
    "#5B8A6E", // Rust / WASM
    "#9B6BB5", // Python / AI
    "#4A9B8E", // SQL / Bash
  ];
  const accent = skillColors[index] || "#E8703A";
  const pathD = describeArc(100);

  return (
    <div
      className="flex flex-col items-center justify-between"
      style={{ width: "110px", height: "130px" }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="overflow-visible">
          {/* Track arc */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(22, 29, 26, 0.1)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Fill arc */}
          <path
            d={pathD}
            fill="none"
            stroke={accent}
            strokeWidth="6"
            strokeLinecap="round"
            style={{
              strokeDasharray: arcLength,
              strokeDashoffset: strokeDashoffset,
              transition: "stroke-dashoffset 1000ms ease-out",
              transitionDelay: `${index * 120}ms`,
            }}
          />
          {/* Percentage text */}
          <text
            x={cx}
            y={cy + 4}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="16"
            fontWeight="700"
            fill="var(--sumi-ink)"
            fontFamily="var(--font-big-shoulders), sans-serif"
          >
            {displayed}%
          </text>
        </svg>
      </div>
      <div
        className="text-center text-[10px] uppercase tracking-[0.15em] leading-tight"
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          color: "var(--muted-label)",
        }}
      >
        {skill.name}
      </div>
    </div>
  );
}

// ─── Experience timeline node ─────────────────────────────────────────────────
function TimelineNode({
  job,
  isLast,
  isFirst,
}: {
  job: { company: string; role: string; period: string; description: string };
  isLast: boolean;
  isFirst: boolean;
}) {
  const items = job.description.split(";").map(item => item.trim()).filter(Boolean);

  return (
    <div className="relative pl-10">
      {/* Circuit trace vertical line */}
      {!isLast && (
        <div
          className="absolute left-[13px] top-6 w-[2px]"
          style={{
            bottom: "-20px",
            background: "linear-gradient(to bottom, var(--forge-orange) 0%, var(--muted-label) 100%)",
            opacity: 0.35,
          }}
        />
      )}
      {/* Node circle */}
      <div
        className={`absolute left-[4px] top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${isFirst ? "animate-pulse" : ""}`}
        style={{
          borderColor: "var(--forge-orange)",
          background: isFirst ? "var(--forge-orange)" : "var(--aged-paper)",
          boxShadow: isFirst ? "0 0 12px rgba(232,112,58,0.4)" : "none",
        }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: isFirst ? "white" : "var(--forge-orange)" }}
        />
      </div>

      <div className="pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
          <h4
            className="uppercase leading-none"
            style={{
              fontSize: "clamp(1.1rem, 2.2vw, 1.4rem)",
              fontFamily: "var(--font-big-shoulders), sans-serif",
              fontWeight: 900,
              color: "var(--sumi-ink)",
            }}
          >
            {job.company}
          </h4>
          <span
            className="px-2.5 py-0.5 text-[9px] uppercase tracking-[0.2em] font-mono border border-[var(--muted-label)]/25 rounded-sm"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--sumi-ink)",
              opacity: 0.8,
            }}
          >
            {job.period}
          </span>
        </div>
        <div
          className="mb-3 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "var(--forge-orange)",
          }}
        >
          <span className="w-1.5 h-1.5 bg-[var(--forge-orange)] rotate-45 shrink-0" />
          {job.role}
        </div>
        
        <div className="space-y-3 mt-3">
          {items.map((item, idx) => (
            <div key={idx} className="border-l-2 border-[var(--forge-orange)]/40 pl-4 py-0.5 select-none">
              <span className="font-sans font-light text-sm leading-relaxed text-[var(--sumi-ink)]/90">{item}</span>
            </div>
          ))}
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
      case "ja": return "主な専門分野"; case "ko": return "핵심 전문 분야";
      case "zh-tw": return "核心專業領域"; case "fr": return "Expertise Fondamentale";
      case "id": return "Keahlian Inti"; case "de": return "Kernkompetenz";
      case "it": return "Competenza Core"; case "pt-br": return "Competência Principal";
      case "es-419": case "es": return "Experiencia Principal"; case "hi": return "मुख्य विशेषज्ञता";
      case "eridian": return "PRIMARY-SKILL"; default: return "Core Expertise";
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

      <div className="w-full max-w-7xl relative flex flex-col gap-16 mt-[50px]">

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
                className={`absolute w-3 h-3 rounded-full ${pos}`}
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
                <StudioStat value={12} label={language === "ja" ? "構築済システム" : language === "ko" ? "구축된 시스템" : language === "hi" ? "सिस्टम बनाए" : "Systems Built"} />
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
              <div>
                {currentProfile.experience.map((job, i) => (
                  <TimelineNode
                    key={job.company}
                    job={job}
                    isFirst={i === 0}
                    isLast={i === currentProfile.experience.length - 1}
                  />
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Analog gauge dials instrument panel */}
          <ScrollReveal duration={1200} delay={300} direction="up" className="w-full">
            <div>
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
                className="p-[28px] relative"
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
                  Core Expertise
                </div>
                <div className="grid grid-cols-3 gap-6 justify-items-center">
                  {currentProfile.skills.map((skill, i) => (
                    <GaugeDial
                      key={skill.name}
                      skill={skill}
                      isVisible={skillsVisible}
                      index={i}
                    />
                  ))}
                </div>
                {/* Pressure easter egg label */}
                <button
                  onClick={triggerPressure}
                  className="mt-6 w-full text-center text-[9px] uppercase tracking-[0.3em] hover:opacity-100 transition-opacity"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    color: "var(--sumi-ink)",
                    opacity: 0.6,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Scroll to calibrate
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
