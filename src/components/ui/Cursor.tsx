"use client";
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom";

export interface CursorHandle {
  getSpherePositions: () => { x: number; y: number }[];
}

const Cursor = forwardRef<CursorHandle>((_, ref) => {
  const [isTouch, setIsTouch] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const px = useRef(new Float32Array(20));
  const py = useRef(new Float32Array(20));
  const vx = useRef(new Float32Array(20));
  const vy = useRef(new Float32Array(20));
  const locked = useRef(new Uint8Array(20));
  const pt = useRef(new Float32Array(20));

  const mouse = useRef({ x: 0, y: 0 });
  const hoverType = useRef<"none" | "standard" | "play">("none");
  const totalClicks = useRef(0);
  const clickIdleTimer = useRef(0);
  const burstFlash = useRef(0);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Color Cycling State
  const PALETTE = ["#E8E8E6", "#d91111", "#0ee0c3", "#ffffff"];
  const colorIndexRef = useRef(0);
  const holdStartTimeRef = useRef<number | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);

  const PSIZE = 2.2;
  const GAP = PSIZE * 2 + 1.2;
  const tipX = 4 * GAP;
  const tipY = -4 * GAP;

  const arrowSlots = useRef<{ x: number; y: number }[]>([]);
  const playSlots = useRef<{ x: number; y: number }[]>([]);

  useImperativeHandle(ref, () => ({
    getSpherePositions: () =>
      Array.from({ length: 20 }, (_, i) => ({ x: px.current[i], y: py.current[i] })),
  }));

  useEffect(() => {
    const touchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouch(touchDevice);
    if (touchDevice) return;

    // Arrow slots (↗)
    const aSlots = [];
    for (let i = 0; i <= 8; i++) aSlots.push({ x: -4 * GAP + (i / 8) * 8 * GAP, y: 4 * GAP - (i / 8) * 8 * GAP });
    for (let i = 1; i <= 5; i++) aSlots.push({ x: tipX - i * GAP, y: tipY });
    for (let i = 1; i <= 5; i++) aSlots.push({ x: tipX, y: tipY + i * GAP });
    arrowSlots.current = aSlots;

    // Search slots (🔍)
    const sSlots = [];
    const radius = 3.2 * GAP;
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2;
      sSlots.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
    }
    const sX = Math.cos(Math.PI / 4) * radius, sY = Math.sin(Math.PI / 4) * radius;
    for (let i = 1; i <= 5; i++) sSlots.push({ x: sX + i * GAP * 0.85, y: sY + i * GAP * 0.85 });
    playSlots.current = sSlots;

    // Init particles
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    for (let i = 0; i < 20; i++) {
      const a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 100;
      px.current[i] = cx + Math.cos(a) * d; py.current[i] = cy + Math.sin(a) * d;
      vx.current[i] = -Math.sin(a) * 2; vy.current[i] = Math.cos(a) * 2;
      pt.current[i] = (Math.PI * 2 / 19) * (i - 1);
    }

    const handleResize = () => { if (canvasRef.current) { canvasRef.current.width = window.innerWidth; canvasRef.current.height = window.innerHeight; } };
    handleResize();
    window.addEventListener("resize", handleResize);

    const onMouseMove = (e: MouseEvent) => { 
      mouse.current = { x: e.clientX, y: e.clientY }; 
      // EXPOSE TO CSS: powers the glow-dots
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    const onMouseOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const c = t.closest('a, button, [role="button"], [data-cursor]');
      if (c) hoverType.current = (c as HTMLElement).getAttribute('data-cursor') === 'play' ? 'play' : 'standard';
    };
    const onMouseOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('a, button, [role="button"], [data-cursor]')) { hoverType.current = "none"; locked.current.fill(0); }
    };

    const onMouseDown = () => {
      holdStartTimeRef.current = Date.now();
      totalClicks.current++; clickIdleTimer.current = 0; burstFlash.current = 18; locked.current.fill(0);
      const force = 6 + totalClicks.current * 5;
      for (let i = 0; i < 20; i++) { const a = Math.random() * Math.PI * 2; vx.current[i] += Math.cos(a) * force; vy.current[i] += Math.sin(a) * force; }
    };

    const onMouseUp = () => {
      holdStartTimeRef.current = null;
      setHoldProgress(0);
    };

    const handleScroll = () => {
      if (!isScrolling.current) isScrolling.current = true;
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => { isScrolling.current = false; }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    let rafId: number;
    const loop = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      if (isScrolling.current) { canvas.style.opacity = "0"; rafId = requestAnimationFrame(loop); return; }
      canvas.style.opacity = "1";
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ── Hold Progression Logic ──────────────────────────────────────────
      if (holdStartTimeRef.current) {
        const elapsed = Date.now() - holdStartTimeRef.current;
        const progress = Math.min(1, elapsed / 3000);
        setHoldProgress(progress);
        
        if (progress >= 1) {
          // Change Color and Reset Timer (Cycle)
          colorIndexRef.current = (colorIndexRef.current + 1) % PALETTE.length;
          holdStartTimeRef.current = Date.now(); // Reset for next cycle if still held
          burstFlash.current = 15; // Visual feedback for change
        }
      }

      // Core follows mouse
      vx.current[0] += (mouse.current.x - px.current[0]) * 0.2;
      vy.current[0] += (mouse.current.y - py.current[0]) * 0.2;
      vx.current[0] *= 0.68; vy.current[0] *= 0.68;
      px.current[0] += vx.current[0]; py.current[0] += vy.current[0];

      if (burstFlash.current > 0) burstFlash.current--;
      clickIdleTimer.current++;
      if (clickIdleTimer.current > 240) totalClicks.current = 0;

      // Current Particle Color
      const baseColor = PALETTE[colorIndexRef.current];
      const currentColor = burstFlash.current > 0 ? (colorIndexRef.current === 1 ? PALETTE[2] : PALETTE[1]) : hoverType.current !== "none" ? PALETTE[2] : baseColor;

      for (let i = 1; i < 20; i++) {
        if (hoverType.current !== "none") {
          const slots = hoverType.current === "play" ? playSlots.current : arrowSlots.current;
          const slot = slots[i - 1];
          const tx = px.current[0] + slot.x, ty = py.current[0] + slot.y;
          if (locked.current[i]) {
            px.current[i] = tx; py.current[i] = ty; vx.current[i] = 0; vy.current[i] = 0;
          } else {
            const ddx = tx - px.current[i], ddy = ty - py.current[i];
            const dist = Math.sqrt(ddx * ddx + ddy * ddy) + 0.001;
            if (dist < 2.5) { px.current[i] = tx; py.current[i] = ty; vx.current[i] = 0; vy.current[i] = 0; locked.current[i] = 1; }
            else {
              const grav = Math.min(100000 / (dist + 1), 600);
              vx.current[i] += (ddx / dist) * grav * 0.016; vy.current[i] += (ddy / dist) * grav * 0.016;
              let drag = 0.72; if (dist < 8) drag = 0.35; else if (dist < 20) drag = 0.52; else if (dist < 50) drag = 0.62;
              vx.current[i] *= drag; vy.current[i] *= drag;
              px.current[i] += vx.current[i]; py.current[i] += vy.current[i];
            }
          }
        } else {
          pt.current[i] += 0.02;
          const tx = px.current[0] + Math.cos(pt.current[i]) * 20;
          const ty = py.current[0] + Math.sin(pt.current[i]) * 20;
          const ddx = tx - px.current[i], ddy = ty - py.current[i];
          const dd = Math.sqrt(ddx * ddx + ddy * ddy);
          const ls = dd > 40 ? 0.08 : dd > 15 ? 0.14 : 0.22;
          vx.current[i] += ddx * ls; vy.current[i] += ddy * ls;
          vx.current[i] *= 0.6; vy.current[i] *= 0.6;
          px.current[i] += vx.current[i]; py.current[i] += vy.current[i];
        }
      }

      // Draw Hold Progress Ring
      if (holdStartTimeRef.current) {
        ctx.beginPath();
        ctx.arc(px.current[0], py.current[0], 25, -Math.PI/2, (-Math.PI/2) + (Math.PI * 2 * (Date.now() - holdStartTimeRef.current) / 3000));
        ctx.strokeStyle = PALETTE[(colorIndexRef.current + 1) % PALETTE.length];
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      if (hoverType.current === "none") {
        ctx.beginPath(); ctx.arc(px.current[0], py.current[0], 20, 0, Math.PI * 2);
        ctx.strokeStyle = baseColor; ctx.globalAlpha = 0.04; ctx.lineWidth = 0.5; ctx.stroke(); ctx.globalAlpha = 1;
      }

      for (let i = 0; i < 20; i++) {
        if (i === 0 && hoverType.current === "play") continue;
        const x = px.current[i], y = py.current[i];

        ctx.beginPath(); ctx.arc(x, y, PSIZE, 0, Math.PI * 2); ctx.fillStyle = currentColor; ctx.fill();

        if (burstFlash.current === 0) {
          ctx.shadowBlur = 0;
          ctx.beginPath(); ctx.arc(x - PSIZE * 0.3, y - PSIZE * 0.3, PSIZE * 0.38, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.70)"; ctx.fill();
          ctx.beginPath(); ctx.arc(x, y, PSIZE + 1.1, 0, Math.PI * 2);
          ctx.lineWidth = 0.6;
          ctx.strokeStyle = hoverType.current !== "none" ? PALETTE[2] : `${baseColor}15`;
          ctx.stroke();
        }
      }
      ctx.shadowBlur = 0;
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return createPortal(
    <>
      <style>{`body,a,button,input,textarea,select,*{cursor:none!important}`}</style>
      <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 9999, pointerEvents: "none", mixBlendMode: "difference", willChange: "transform" }} />
    </>,
    document.body
  );
});
Cursor.displayName = "Cursor";
export default Cursor;
