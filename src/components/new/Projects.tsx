"use client";

import { projects } from "@/data/projects";
import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useFlipTransition } from "@/context/FlipContext";

interface Project {
  title: string;
  description: string;
  link: string;
  slug: string;
  mobileScreenshot: string;
  tags: string[];
  specs: string[];
}

// Per-card accent colours cycling through brand palette
const CARD_ACCENTS = [
  "#E8703A", // forge-orange
  "#4A7FA5", // blueprint-blue
  "#C4843A", // copper
  "#E8703A",
  "#4A7FA5",
  "#C4843A",
];

const STATUS_LABELS = ["SHIPPED", "IN PROGRESS", "SHIPPED", "SHIPPED", "IN PROGRESS", "ARCHIVED"];

// ─── Resonance canvas overlay ─────────────────────────────────────────────────
function ResonanceCanvas({ active, mouseX, mouseY }: { active: boolean; mouseX: number; mouseY: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const ringsRef = useRef<{ r: number; alpha: number }[]>([]);

  useEffect(() => {
    if (!active) {
      ringsRef.current = [];
      return;
    }
    // Spawn a new ring
    ringsRef.current = [...ringsRef.current, { r: 0, alpha: 0.15 }];
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ringsRef.current = ringsRef.current
        .map((ring) => ({ r: ring.r + 2.5, alpha: ring.alpha - 0.003 }))
        .filter((ring) => ring.alpha > 0);

      ringsRef.current.forEach((ring) => {
        ctx.strokeStyle = `rgba(74,127,165,${ring.alpha})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(
          mouseX - ring.r,
          mouseY - ring.r,
          ring.r * 2,
          ring.r * 2
        );
      });
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mouseX, mouseY]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      width={600}
      height={570}
    />
  );
}

// ─── Single Dossier Card ──────────────────────────────────────────────────────
function DossierCard({
  project,
  index,
  isStacked,
  language,
  isLoading,
  onNavigate,
}: {
  project: Project;
  index: number;
  isStacked: boolean;
  language: string;
  isLoading: boolean;
  onNavigate: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [mouse, setMouse] = useState({ x: 300, y: 285 });
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
  const statusLabel = STATUS_LABELS[index % STATUS_LABELS.length];
  const statusRotation = index % 2 === 0 ? "-rotate-[4deg]" : "rotate-[3deg]";

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const viewLabel =
    language === "en" ? (isLoading ? "Loading…" : "Open Dossier") :
    language === "ja" ? (isLoading ? "読み込み中…" : "詳細を見る") :
    language === "ko" ? (isLoading ? "로딩 중…" : "열기") :
    language === "zh-tw" ? (isLoading ? "載入中…" : "查看檔案") :
    language === "fr" ? (isLoading ? "Chargement…" : "Ouvrir le dossier") :
    language === "id" ? (isLoading ? "Memuat…" : "Buka Berkas") :
    language === "eridian" ? (isLoading ? "WAIT…" : "OPEN-THING") :
    (isLoading ? "लोड हो रहा है…" : "खोलें");

  return (
    <div
      className={`transition-[opacity,transform] duration-700 ease-out w-full ${
        isStacked ? "sticky top-[calc(10vh+60px)] md:top-[10vh]" : "relative top-0"
      }`}
      style={{ zIndex: isStacked ? index : 1 }}
    >
      <div className="flex items-stretch gap-0">
        {/* ── MAIN CARD ── */}
        <div
          className={`relative flex-1 overflow-hidden transition-all duration-500 cursor-pointer
            ${isLoading ? "opacity-60 animate-pulse" : ""}
            ${hovered ? "shadow-[0_8px_48px_rgba(0,0,0,0.25)]" : "shadow-[2px_4px_20px_rgba(15,13,10,0.15)]"}
          `}
          style={{ background: "var(--aged-paper)" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onMouseMove={handleMouseMove}
          onClick={onNavigate}
        >
          {/* Resonance canvas */}
          <ResonanceCanvas active={hovered} mouseX={mouse.x} mouseY={mouse.y} />

          {/* Accent colour top-strip */}
          <div className="h-2 w-full" style={{ background: accent }} />

          {/* Blueprint grid overlay */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(74,127,165,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(74,127,165,0.04) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />

          {/* Project number watermark */}
          <div
            className="absolute top-3 right-4 font-black select-none pointer-events-none leading-none z-0"
            style={{
              fontSize: "clamp(4rem,8vw,7rem)",
              color: "var(--muted-label)",
              opacity: 0.18,
              fontFamily: "var(--font-big-shoulders), sans-serif",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Status rubber stamp */}
          <div
            className={`absolute top-6 left-6 z-10 border-2 px-2 py-0.5 text-[9px] font-bold tracking-[0.25em] uppercase ${statusRotation}`}
            style={{
              borderColor: accent,
              color: accent,
              fontFamily: "var(--font-jetbrains-mono), monospace",
            }}
          >
            {statusLabel}
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full justify-between p-6 md:p-10 pt-16">
            <div>
              {/* Label-maker tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em]"
                    style={{
                      border: `1px dashed var(--muted-label)`,
                      color: "var(--sumi-ink)",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      background: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3
                className="uppercase leading-none mb-5 transition-colors duration-300"
                style={{
                  fontSize: "clamp(1.8rem,4.5vw,3.5rem)",
                  fontFamily: "var(--font-big-shoulders), sans-serif",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  color: hovered ? accent : "var(--sumi-ink)",
                }}
              >
                {project.title}
              </h3>

              {/* Description */}
              <p
                className="text-sm md:text-base leading-relaxed max-w-2xl border-l-[3px] pl-4 transition-colors duration-300"
                style={{
                  borderColor: hovered ? accent : "var(--muted-label)",
                  color: "var(--sumi-ink)",
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontWeight: 300,
                }}
              >
                {project.description}
              </p>
            </div>

            {/* Specs + CTA */}
            <div className="mt-8 flex flex-col gap-4">
              {/* Specs block — JetBrains Mono style */}
              <div
                className={`flex flex-col items-end gap-1 transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-40"}`}
              >
                {project.specs.map((spec) => (
                  <span
                    key={spec}
                    className="text-[10px] md:text-xs tracking-[0.2em]"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      color: "var(--sumi-ink)",
                    }}
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Arrow CTA */}
              <div className={`flex items-center gap-3 transition-all duration-300 ${hovered ? "opacity-100 translate-x-1" : "opacity-50 translate-x-0"}`}>
                <div
                  className="w-10 h-10 flex items-center justify-center transition-transform duration-300"
                  style={{ background: accent }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="square">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
                <span
                  className="text-xs uppercase tracking-[0.25em]"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    color: hovered ? accent : "var(--sumi-ink)",
                  }}
                >
                  {viewLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer for nav room (stacked mode only) */}
        {isStacked && <div className="w-8 md:w-10 shrink-0" />}
      </div>
    </div>
  );
}

// ─── Main Projects Section ────────────────────────────────────────────────────
export function Projects() {
  const { language } = useLanguage();
  const { triggerTransition, isPreloading, loadingSlug, setPreloading } = useFlipTransition();
  const currentProjects = projects[language as keyof typeof projects] || projects.en;
  const [isStacked, setIsStacked] = useState(true);

  const chapterLabel =
    language === "en" ? "CHAPTER 01" :
    language === "ja" ? "第一章" :
    language === "ko" ? "제 1 장" :
    language === "zh-tw" ? "第一章" :
    language === "fr" ? "CHAPITRE 01" :
    language === "id" ? "BAB 01" :
    language === "de" ? "KAPITEL 01" :
    language === "it" ? "CAPITOLO 01" :
    (language === "pt-br" || language === "es-419" || language === "es") ? "CAPÍTULO 01" :
    language === "eridian" ? "PART-ONE-THING" : "अध्याय 01";

  const h2Label =
    language === "ja" ? <><span className="text-[var(--sumi-ink)]">選定された</span><br /><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--forge-orange)" }}>作品</span></> :
    language === "ko" ? <><span className="text-[var(--sumi-ink)]">선정된</span><br /><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--forge-orange)" }}>작품</span></> :
    language === "eridian" ? <><span className="text-[var(--sumi-ink)]">HARSHAL</span><br /><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--forge-orange)" }}>MAKE-THINGS</span></> :
    <><span className="text-[var(--sumi-ink)]">SELECTED</span><br /><span className="text-transparent" style={{ WebkitTextStroke: "2px var(--forge-orange)" }}>WORKS</span></>;

  return (
    <section
      id="projects"
      className="relative pt-8 md:pt-12 pb-24 px-6 md:px-8 flex flex-col items-center z-10 isolate blueprint-grid-warm"
      style={{ background: "var(--studio-warm)" }}
    >
      {/* Section Header */}
      <div className="w-full max-w-7xl relative flex flex-col md:flex-row justify-between items-end mb-8 md:mb-10 border-b-2 border-[var(--muted-label)]/30 pb-8 mt-[50px]">
        <div>
          <div
            className="inline-block mb-4 px-3 py-1 text-xs tracking-widest font-bold"
            style={{
              background: "var(--sumi-ink)",
              color: "var(--chalk)",
              fontFamily: "var(--font-jetbrains-mono), monospace",
            }}
          >
            {chapterLabel}
          </div>
          <h2
            className="uppercase tracking-[-0.04em] leading-[0.85] m-0"
            style={{
              fontSize: "clamp(3rem,8vw,7rem)",
              fontFamily: "var(--font-big-shoulders), sans-serif",
              fontWeight: 900,
            }}
          >
            {h2Label}
          </h2>
        </div>
        <div className="flex flex-col items-end gap-3 mt-6 md:mt-0">
          <p
            className="max-w-xs text-right text-sm uppercase tracking-widest leading-relaxed"
            style={{
              color: "var(--muted-label)",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontWeight: 600,
            }}
          >
            {language === "en" ? "A showcase of systems built and technical problems solved." :
             language === "ja" ? "開発されたシステムと解決された技術的課題のショーケース。" :
             language === "ko" ? "개발된 시스템과 해결된 기술적 과제의 쇼케이스입니다." :
             language === "eridian" ? "HARSHAL BUILD GOOD FAST THINGS. AMAZE!" :
             "तैयार किए गए सिस्टम का प्रदर्शन।"}
          </p>
          {/* Expand / collapse toggle */}
          <button
            onClick={() => setIsStacked((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-200 border-2 bg-[var(--aged-paper)] hover:bg-[var(--forge-orange)]/5 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer select-none"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              borderColor: isStacked ? "var(--forge-orange)" : "var(--sumi-ink)",
              color: isStacked ? "var(--forge-orange)" : "var(--sumi-ink)",
              boxShadow: isStacked 
                ? "3px 3px 0px rgba(232, 112, 58, 0.2)" 
                : "3px 3px 0px rgba(26, 23, 20, 0.15)",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              {!isStacked
                ? <path d="M0 4h10v2H0z" />
                : <path d="M4 0h2v10H4zM0 4h10v2H0z" />}
            </svg>
            {isStacked ? "GRID VIEW" : "STACK VIEW"}
          </button>
        </div>
      </div>

      {/* Cards */}
      <div
        className={`relative w-full transition-all duration-700 ${
          isStacked
            ? "flex flex-col gap-[20vh] max-w-5xl mx-auto w-full"
            : "grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-7xl"
        }`}
      >
        {currentProjects.map((project: Project, i: number) => (
          <DossierCard
            key={project.title}
            project={project}
            index={i}
            isStacked={isStacked}
            language={language}
            isLoading={isPreloading && loadingSlug === project.slug}
            onNavigate={() => {
              setPreloading(true, project.slug);
              triggerTransition(project.slug, project.link, "WARP");
            }}
          />
        ))}
      </div>
    </section>
  );
}
