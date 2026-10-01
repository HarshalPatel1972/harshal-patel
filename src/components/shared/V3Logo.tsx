"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LOOKS, Sparks, drawOrbit, drawTesseract } from "./v3Canvas";
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
const easeOutQuart = (u: number) => 1 - Math.pow(1 - u, 4);
const easeInOutCubic = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const easeInCubic = (u: number) => u * u * u;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

const VEIL = { old: "#050505", new: "#EDE4D3" } as const;
const SKIP_GRACE_MS = 600; // ignore the click that just dismissed the preloader

/**
 * Full-screen layers for the V3 effects.
 *  - intro: a glowing tesseract flies out of the logo on a curve, spins up, settles, and a glass card
 *    opens inside it with the message. It stays for INTRO_MS.hold, then folds back into the logo.
 *    Any click, Esc or scroll sends it home early.
 *  - exit: the tesseract swallows the screen before navigating to V3.
 */
export function V3Effects({
  mode, anchorRef, variant, onDone,
}: { mode: Fx; anchorRef: RefObject<HTMLElement | null>; variant: V3Variant; onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const doneRef = useRef(onDone);
  useEffect(() => { doneRef.current = onDone; }, [onDone]);
  const [panel, setPanel] = useState(false);

  useEffect(() => {
    if (!mode) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) { doneRef.current(); return; }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth, H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const look = LOOKS[variant];
    const r = anchorRef.current?.getBoundingClientRect();
    const from = r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: W - 30, y: 40 };
    // centre of the space left of the navbar
    const to = { x: (W - 56) / 2, y: H * 0.46 };
    const size0 = Math.max(150, Math.min(235, Math.min(W, H) * 0.34));

    // curve the flight so it swoops instead of sliding in a straight line
    const dx = to.x - from.x, dy = to.y - from.y, dist = Math.hypot(dx, dy) || 1;
    const nx = -dy / dist, ny = dx / dist, arcPx = dist * 0.16;

    const { fly, hold, back } = INTRO_MS;
    const sparks = new Sparks();
    const start = performance.now();
    let last = start;
    let skipAt: number | null = null;
    let panelShown = false, panelHidden = false, launched = false;
    let raf = 0;

    const onSkip = () => {
      if (mode !== "intro" || skipAt !== null) return;
      const e = performance.now() - start;
      if (e < SKIP_GRACE_MS) return;
      skipAt = Math.max(e, fly);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onSkip(); };
    window.addEventListener("pointerdown", onSkip);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onSkip, { passive: true });

    const ring = (x: number, y: number, rad: number, a: number, w = 2) => {
      if (a <= 0.01) return;
      ctx.save();
      if (look.additive) ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = a; ctx.strokeStyle = look.color; ctx.lineWidth = w;
      ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    };

    const frame = (now: number) => {
      const e = now - start;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // fade the previous frame instead of clearing it: that's the motion trail
      ctx.globalCompositeOperation = "destination-out";
      ctx.globalAlpha = 1;
      const inHold = mode === "intro" && e > fly && (skipAt === null || e < skipAt);
      ctx.fillStyle = inHold ? "rgba(0,0,0,0.62)" : "rgba(0,0,0,0.26)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";

      // spin starts fast and settles
      const rot = e / 1000 * 0.7 + 5 * (1 - Math.exp(-e / 520));

      if (mode === "intro") {
        const T = skipAt !== null && e >= skipAt ? fly + hold + (e - skipAt) : e;
        let cx = to.x, cy = to.y, size = size0, alpha = 1;

        if (T < fly) {
          const u = T / fly, k = easeOutQuart(u);
          cx = lerp(from.x, to.x, k) + nx * arcPx * Math.sin(Math.PI * k);
          cy = lerp(from.y, to.y, k) + ny * arcPx * Math.sin(Math.PI * k);
          size = size0 * Math.max(0.03, easeOutBack(u));
          alpha = Math.min(1, u * 5);
          if (!launched) { launched = true; sparks.burst(from.x, from.y, 42); }
          sparks.emit(cx, cy, 2);
          ring(from.x, from.y, 14 + u * 70, (1 - u) * 0.85);
        } else if (T < fly + hold) {
          const h = T - fly;
          size = size0 * (1 + 0.02 * Math.sin(h / 330));
          const ph = (h % 1900) / 1900; // a slow pulse leaving the cube
          ring(cx, cy, size * (0.95 + 0.9 * ph), (1 - ph) * 0.3, 1.5);
        } else {
          const u = clamp01((T - fly - hold) / back), k = easeInOutCubic(u);
          cx = lerp(to.x, from.x, k) + nx * arcPx * Math.sin(Math.PI * k) * -1;
          cy = lerp(to.y, from.y, k) + ny * arcPx * Math.sin(Math.PI * k) * -1;
          size = size0 * (1 - 0.95 * easeInCubic(u));
          alpha = 1 - 0.8 * u;
          sparks.emit(cx, cy, 1);
          ring(from.x, from.y, 70 * (1 - u) + 10, u * 0.7);
        }

        const orbit = clamp01((T - fly * 0.7) / 700) * (T < fly + hold ? 1 : 1 - clamp01((T - fly - hold) / back));
        drawOrbit(ctx, { cx, cy, size, e, alpha: orbit, look });
        drawTesseract(ctx, { cx, cy, size, alpha, rot, look });
        sparks.step(dt);
        sparks.draw(ctx, look);

        if (!panelShown && T >= fly * 0.72) { panelShown = true; setPanel(true); }
        if (!panelHidden && T >= fly + hold - 260) { panelHidden = true; setPanel(false); }
        if (T >= fly + hold + back) { doneRef.current(); return; }
      } else {
        const u = Math.min(1, e / EXIT_MS), k = easeInCubic(u);
        const cx = lerp(from.x, W / 2, k), cy = lerp(from.y, H / 2, k);
        if (!launched) { launched = true; sparks.burst(from.x, from.y, 30, [200, 600]); }
        drawTesseract(ctx, { cx, cy, size: size0 * (0.1 + 13 * k), alpha: 1, rot: rot + 1.5, look });
        sparks.step(dt);
        sparks.draw(ctx, look);
        if (u > 0.5) {
          ctx.globalAlpha = Math.min(1, (u - 0.5) / 0.45);
          ctx.fillStyle = VEIL[variant];
          ctx.fillRect(0, 0, W, H);
          ctx.globalAlpha = 1;
        }
        if (e >= EXIT_MS) { doneRef.current(); return; }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", onSkip);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onSkip);
    };
  }, [mode, variant, anchorRef]);

  if (!mode) return null;
  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[120] h-full w-full" />
      <AnimatePresence>{mode === "intro" && panel && <V3Panel key="panel" variant={variant} />}</AnimatePresence>
    </>
  );
}

const PANEL_TEXT = "I rebuilt this portfolio from scratch, in 3D, on an entirely new stack.";

/** Types out `text` once, with a blinking caret. Screen readers get the whole sentence straight away. */
function Typed({ text, delay = 450, speed = 24 }: { text: string; delay?: number; speed?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let i = 0;
    let iv: ReturnType<typeof setInterval> | undefined;
    const t = setTimeout(() => {
      iv = setInterval(() => { i += 1; setN(i); if (i >= text.length) clearInterval(iv); }, speed);
    }, delay);
    return () => { clearTimeout(t); if (iv) clearInterval(iv); };
  }, [text, delay, speed]);
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{text.slice(0, n)}<span className="v3-caret">▍</span></span>
    </>
  );
}

/** The glass card that opens inside the cube. Styled like the fact card so the two feel related. */
function V3Panel({ variant }: { variant: V3Variant }) {
  const isNew = variant === "new";
  const accent = isNew ? "var(--forge-orange)" : "#ff4a4a"; // brighter red so it reads on the dark glass
  const shown = INTRO_MS.hold + INTRO_MS.fly * 0.28 - 260; // matches when the card is told to leave
  return (
    <div className="pointer-events-none fixed z-[121] top-[46%] w-[min(360px,calc(100vw-112px))] -translate-x-1/2 -translate-y-1/2" style={{ left: "calc(50% - 28px)" }}>
      <style>{`
        @keyframes v3progress { from { transform: scaleX(1); } to { transform: scaleX(0); } }
        @keyframes v3caret { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        @keyframes v3nudge { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(3px, -3px); } }
        .v3-caret { animation: v3caret 0.9s steps(1) infinite; margin-left: 1px; }
        .v3-nudge { display: inline-block; animation: v3nudge 1s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .v3-caret, .v3-nudge { animation: none !important; } }
      `}</style>
      <motion.div
        role="status"
        aria-live="polite"
        className={`relative overflow-hidden px-5 pb-6 pt-5 ${
          isNew
            ? "border-[3px] border-[var(--sumi-ink)] bg-[rgba(237,228,211,0.94)] text-[var(--sumi-ink)] shadow-[8px_8px_0_var(--forge-orange)]"
            : "border border-[var(--accent-blood)] bg-[rgba(8,8,8,0.78)] text-[#F5F5F0] shadow-[0_0_70px_rgba(255,43,43,0.32)] backdrop-blur-md"
        }`}
        initial={{ opacity: 0, scaleY: 0.04, scaleX: 0.7 }}
        animate={{ opacity: 1, scaleY: 1, scaleX: 1, transition: { type: "spring", stiffness: 240, damping: 24, mass: 0.9 } }}
        exit={{ opacity: 0, scaleY: 0.04, scaleX: 0.8, transition: { duration: 0.22, ease: "easeIn" } }}
      >
        {!isNew && (
          <>
            <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-[var(--accent-blood)]" />
            <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-[var(--accent-blood)]" />
            <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-[var(--accent-blood)]" />
            <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-[var(--accent-blood)]" />
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 3px)" }} />
          </>
        )}

        <div className="relative mb-3 flex items-center gap-2">
          <span className="px-1.5 py-0.5 font-mono text-[10px] font-black tracking-[0.2em] text-white" style={{ background: accent }}>NEW</span>
          <span className="font-mono text-[10px] font-bold tracking-[0.28em] opacity-70">VERSION 3</span>
        </div>
        <h2 className="relative text-[34px] font-black leading-none tracking-tight">
          V3 is live<span style={{ color: accent }}>.</span>
        </h2>
        <p className="relative mt-3 min-h-[5em] text-[14px] font-medium leading-snug opacity-90">
          <Typed text={PANEL_TEXT} />
        </p>
        <p className="relative mt-3 flex items-center gap-2 font-mono text-[11px] font-black tracking-[0.16em]" style={{ color: accent }}>
          CLICK THE GLOWING V3 LOGO <span className="v3-nudge">↗</span>
        </p>

        {/* time left on screen */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-[3px] w-full origin-left"
          style={{ background: accent, animation: `v3progress ${shown}ms linear forwards` }}
        />
      </motion.div>
    </div>
  );
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
