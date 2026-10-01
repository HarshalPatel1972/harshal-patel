"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import { EDGES, project } from "@/lib/tesseract";
import { EXIT_MS, INTRO_MS, V3_URL, nextPhase, phaseDuration, type LogoPhase } from "@/lib/v3";

export type V3Variant = "old" | "new";
type Fx = "intro" | "exit" | null;

const SEEN_KEY = "v3_intro_seen";

/**
 * Drives the navbar logo's two faces and the tesseract effects.
 *  - once per visit, a tesseract flies out of the logo and says "check the new version 3"
 *  - then the logo alternates: V3 face (30–40 s, click opens V3) and normal logo (10–25 s, click = fact)
 */
export function useV3Logo(ready: boolean) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<LogoPhase>("idle");
  const [fx, setFx] = useState<Fx>(null);

  // Kick off shortly after the page is actually visible
  useEffect(() => {
    if (!ready || phase !== "idle") return;
    const t = setTimeout(() => {
      let seen = false;
      try { seen = sessionStorage.getItem(SEEN_KEY) === "1"; } catch { /* storage blocked */ }
      if (seen || reduce) setPhase("v3");
      else setFx("intro");
    }, 900);
    return () => clearTimeout(t);
  }, [ready, phase, reduce]);

  // Alternate the two faces on random intervals
  useEffect(() => {
    if (phase === "idle") return;
    const t = setTimeout(() => setPhase(nextPhase(phase)), phaseDuration(phase));
    return () => clearTimeout(t);
  }, [phase]);

  // Coming back with the browser's back button must not leave the exit veil up
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) setFx(null); };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  const openV3 = useCallback(() => {
    if (fx === "exit") return;
    if (reduce) { window.location.assign(V3_URL); return; }
    setFx("exit");
  }, [fx, reduce]);

  const onFxDone = useCallback(() => {
    if (fx === "exit") { window.location.assign(V3_URL); return; }
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* storage blocked */ }
    setFx(null);
    setPhase("v3");
  }, [fx]);

  return { phase, fx, openV3, onFxDone };
}

const easeOutBack = (u: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };
const easeInCubic = (u: number) => u * u * u;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

const PALETTE = {
  old: { accent: "#d91111", text: "#F5F5F0", plate: "rgba(5,5,5,0.94)", veil: "#050505", accentVar: "--accent-blood" },
  new: { accent: "#C44D1C", text: "#0F0D0A", plate: "rgba(237,228,211,0.94)", veil: "#EDE4D3", accentVar: "--forge-orange" },
} as const;

/** Full-screen canvas that draws the tesseract: flying out of the logo (intro) or swallowing the screen (exit). */
export function V3Effects({
  mode, anchorRef, variant, onDone,
}: { mode: Fx; anchorRef: RefObject<HTMLElement | null>; variant: V3Variant; onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const doneRef = useRef(onDone);
  useEffect(() => { doneRef.current = onDone; }, [onDone]);

  useEffect(() => {
    if (!mode) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) { doneRef.current(); return; }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth, H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const pal = PALETTE[variant];
    const cssAccent = getComputedStyle(document.documentElement).getPropertyValue(pal.accentVar).trim();
    const color = cssAccent || pal.accent;

    const r = anchorRef.current?.getBoundingClientRect();
    const from = r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: W - 30, y: 40 };
    const to = { x: W / 2, y: H * 0.46 };
    const size0 = Math.max(110, Math.min(240, Math.min(W, H) * 0.3));

    const { fly, hold, back } = INTRO_MS;
    const total = mode === "intro" ? fly + hold + back : EXIT_MS;
    const start = performance.now();
    let raf = 0;

    const drawCube = (cx: number, cy: number, size: number, alpha: number, t: number) => {
      const pts = project(t);
      ctx.lineCap = "round";
      ctx.shadowColor = color;
      ctx.shadowBlur = Math.min(18, size * 0.1);
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, Math.min(3, size * 0.014));
      for (const [i, j] of EDGES) {
        const a = pts[i], b = pts[j];
        ctx.globalAlpha = alpha * (0.3 + 0.7 * ((a.depth + b.depth) / 2));
        ctx.beginPath();
        ctx.moveTo(cx + a.x * size, cy + a.y * size);
        ctx.lineTo(cx + b.x * size, cy + b.y * size);
        ctx.stroke();
      }
      ctx.fillStyle = color;
      for (const p of pts) {
        ctx.globalAlpha = alpha * (0.5 + 0.5 * p.depth);
        ctx.beginPath();
        ctx.arc(cx + p.x * size, cy + p.y * size, Math.max(1.5, Math.min(4, size * 0.02)), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    const drawText = (cx: number, cy: number, size: number, a: number) => {
      if (a <= 0.01) return;
      ctx.globalAlpha = a;
      ctx.fillStyle = pal.plate;
      ctx.beginPath();
      ctx.ellipse(cx, cy, size * 0.62, size * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = pal.text;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      ctx.font = `700 ${Math.round(size * 0.1)}px ${mono}`;
      ctx.fillText("CHECK THE NEW", cx, cy - size * 0.13);
      ctx.fillStyle = color;
      ctx.font = `900 ${Math.round(size * 0.2)}px ${mono}`;
      ctx.fillText("VERSION 3", cx, cy + size * 0.06);
      ctx.fillStyle = pal.text;
      ctx.globalAlpha = a * 0.6;
      ctx.font = `700 ${Math.round(size * 0.075)}px ${mono}`;
      ctx.fillText("CLICK THE LOGO", cx, cy + size * 0.22);
    };

    const frame = (now: number) => {
      const e = now - start;
      ctx.clearRect(0, 0, W, H);

      if (mode === "intro") {
        let cx = to.x, cy = to.y, size = size0, alpha = 1, textA = 0;
        if (e < fly) {
          const u = e / fly, k = easeOutBack(u);
          cx = lerp(from.x, to.x, k); cy = lerp(from.y, to.y, k);
          size = size0 * Math.max(0.04, k);
          alpha = Math.min(1, u * 4);
          // the pop at the logo, as if the cube just left it
          ctx.globalAlpha = (1 - u) * 0.8;
          ctx.strokeStyle = color; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(from.x, from.y, 14 + u * 36, 0, Math.PI * 2); ctx.stroke();
        } else if (e < fly + hold) {
          const h = e - fly;
          size = size0 * (1 + 0.018 * Math.sin(h / 260));
          textA = Math.min(1, h / 380) * Math.min(1, (hold - h) / 380);
        } else {
          const k = easeInCubic(Math.min(1, (e - fly - hold) / back));
          cx = lerp(to.x, from.x, k); cy = lerp(to.y, from.y, k);
          size = size0 * (1 - 0.94 * k);
          alpha = 1 - 0.9 * k;
        }
        drawCube(cx, cy, size, alpha, e / 1000);
        drawText(cx, cy, size, textA);
      } else {
        const u = Math.min(1, e / EXIT_MS), k = easeInCubic(u);
        const cx = lerp(from.x, W / 2, k), cy = lerp(from.y, H / 2, k);
        drawCube(cx, cy, size0 * (0.1 + 13 * k), 1, e / 700 + 2);
        if (u > 0.5) {
          ctx.globalAlpha = Math.min(1, (u - 0.5) / 0.45);
          ctx.fillStyle = pal.veil;
          ctx.fillRect(0, 0, W, H);
        }
      }
      ctx.globalAlpha = 1;

      if (e >= total) { doneRef.current(); return; }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [mode, variant, anchorRef]);

  if (!mode) return null;
  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[120] h-full w-full" />;
}

/** The "V3" face shown inside the logo button. */
export function V3Face({ active, variant }: { active: boolean; variant: V3Variant }) {
  const isNew = variant === "new";
  const accent = isNew ? "var(--forge-orange)" : "var(--accent-blood)";
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 ${
        active ? "scale-100 rotate-0 opacity-100" : "pointer-events-none scale-50 rotate-90 opacity-0"
      }`}
    >
      <span
        className="v3-spin absolute -inset-[60%]"
        style={{ background: `conic-gradient(from 0deg, transparent 0 50%, ${accent} 85%, transparent 100%)` }}
      />
      <span className="absolute inset-[2px]" style={{ background: isNew ? "var(--sumi-ink)" : "#050505" }} />
      <span
        className="v3-breathe relative font-mono text-[13px] font-black leading-none tracking-tight md:text-[16px]"
        style={{ color: isNew ? "var(--aged-paper)" : "#F5F5F0" }}
      >
        V<span style={{ color: accent }}>3</span>
      </span>
    </span>
  );
}

/** Pulsing rings around the logo while the V3 face is up, plus the keyframes everything above uses. */
export function V3Aura({ active, variant }: { active: boolean; variant: V3Variant }) {
  const accent = variant === "new" ? "var(--forge-orange)" : "var(--accent-blood)";
  return (
    <>
      <style>{`
        @keyframes v3ring { 0% { transform: scale(1); opacity: .8; } 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes v3spin { to { transform: rotate(360deg); } }
        @keyframes v3breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.16); } }
        .v3-ring { animation: v3ring 2.2s ease-out infinite; }
        .v3-spin { animation: v3spin 2.4s linear infinite; }
        .v3-breathe { animation: v3breathe 1.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .v3-ring, .v3-spin, .v3-breathe { animation: none !important; } }
      `}</style>
      {active && (
        <>
          <span aria-hidden="true" className="v3-ring pointer-events-none absolute inset-[2px] border-2" style={{ borderColor: accent }} />
          <span aria-hidden="true" className="v3-ring pointer-events-none absolute inset-[2px] border-2" style={{ borderColor: accent, animationDelay: "1.1s" }} />
        </>
      )}
    </>
  );
}
