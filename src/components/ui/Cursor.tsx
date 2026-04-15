"use client";
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/context/LanguageContext";

export interface CursorHandle {
  getSpherePositions: () => { x: number; y: number }[];
}

const Cursor = forwardRef<CursorHandle>((_, ref) => {
  const { language } = useLanguage();
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
  const tickingMouseRef = useRef(false);

  // Color Cycling State
  const PALETTE = ["#E8E8E6", "#d91111", "#0ee0c3", "#ffffff"];
  const ERIDIAN_PALETTE = ["#FFB300", "#0055ff", "#FFB300", "#0055ff"]; // Rocky Yellow and Eridian Blue
  const colorIndexRef = useRef(0);
  const holdStartTimeRef = useRef<number | null>(null);

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
    // Improved touch detection: only disable if it's primarily a touch device
    // and hasn't seen mouse movement, or if we want to allow mouse on touch-enabled desktops.
    const touchDevice = ("ontouchstart" in window || navigator.maxTouchPoints > 0) && 
                       (window.matchMedia("(pointer: coarse)").matches && !window.matchMedia("(pointer: fine)").matches);
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
      if (isTouch) setIsTouch(false);
      mouse.current = { x: e.clientX, y: e.clientY }; 
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
    const onMouseUp = () => { holdStartTimeRef.current = null; };

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

      if (holdStartTimeRef.current) {
        const elapsed = Date.now() - holdStartTimeRef.current;
        const progress = Math.min(1, elapsed / 3000);
        if (progress >= 1) {
          colorIndexRef.current = (colorIndexRef.current + 1) % PALETTE.length;
          holdStartTimeRef.current = Date.now();
          burstFlash.current = 15;
        }
      }

      // Sync CSS properties for elements following the cursor
      document.documentElement.style.setProperty('--mouse-x', `${mouse.current.x}px`);
      document.documentElement.style.setProperty('--mouse-y', `${mouse.current.y}px`);

      // Snap lead particle directly to mouse — zero lag
      px.current[0] = mouse.current.x;
      py.current[0] = mouse.current.y;
      vx.current[0] = 0; vy.current[0] = 0;
      if (burstFlash.current > 0) burstFlash.current--;
      clickIdleTimer.current++;
      if (clickIdleTimer.current > 240) totalClicks.current = 0;

      const isEridian = language === 'eridian';
      const activePalette = isEridian ? ERIDIAN_PALETTE : PALETTE;
      
      const baseColor = activePalette[colorIndexRef.current];
      const currentColor = burstFlash.current > 0 
        ? (colorIndexRef.current === 1 ? activePalette[2] : activePalette[1]) 
        : hoverType.current !== "none" ? activePalette[2] : baseColor;

      for (let i = 1; i < 20; i++) {
        if (hoverType.current !== "none") {
          const slots = hoverType.current === "play" ? playSlots.current : arrowSlots.current;
          const slot = slots[i - 1];
          const tx = px.current[0] + slot.x, ty = py.current[0] + slot.y;
          if (locked.current[i]) { px.current[i] = tx; py.current[i] = ty; vx.current[i] = 0; vy.current[i] = 0; }
          else {
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

      if (holdStartTimeRef.current) {
        ctx.beginPath();
        ctx.arc(px.current[0], py.current[0], 25, -Math.PI/2, (-Math.PI/2) + (Math.PI * 2 * (Date.now() - holdStartTimeRef.current) / 3000));
        ctx.strokeStyle = activePalette[(colorIndexRef.current + 1) % activePalette.length]; ctx.lineWidth = 2; ctx.stroke();
      }
      if (hoverType.current === "none") {
        ctx.beginPath(); ctx.arc(px.current[0], py.current[0], 20, 0, Math.PI * 2);
        ctx.strokeStyle = baseColor; ctx.globalAlpha = isEridian ? (0.1 + Math.sin(Date.now() / 200) * 0.05) : 0.04; ctx.lineWidth = isEridian ? 2 : 0.5; ctx.stroke(); ctx.globalAlpha = 1;
        
        // Eridian Sonar Pulse (Inspired by PHM)
        if (isEridian) {
          const sonarPulse = (Date.now() % 2000) / 2000;
          ctx.beginPath();
          ctx.arc(px.current[0], py.current[0], 20 + sonarPulse * 60, 0, Math.PI * 2);
          ctx.strokeStyle = "#FFB300";
          ctx.lineWidth = 1;
          ctx.globalAlpha = (1 - sonarPulse) * 0.4;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      ctx.save();
      for (let i = 0; i < 20; i++) {
        if (i === 0 && hoverType.current === "play") continue;
        const x = px.current[i], y = py.current[i];
        ctx.beginPath(); 
        ctx.arc(x, y, PSIZE, 0, Math.PI * 2); 
        ctx.fillStyle = currentColor; 
        ctx.fill();
        ctx.closePath();

        if (burstFlash.current === 0) {
          ctx.beginPath(); 
          ctx.arc(x - PSIZE * 0.3, y - PSIZE * 0.3, PSIZE * 0.38, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.70)"; 
          ctx.fill();
          ctx.closePath();

          ctx.beginPath(); 
          ctx.arc(x, y, PSIZE + 1.1, 0, Math.PI * 2);
          ctx.lineWidth = 0.6; 
          ctx.strokeStyle = hoverType.current !== "none" ? activePalette[2] : `${baseColor}15`; 
          ctx.stroke();
          ctx.closePath();
        }
      }
      ctx.restore();
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
  }, [language]); // Removed isTouch to prevent engine restarts during interaction

  if (isTouch) return null;
  return createPortal(
    <>
      <style>{`body,a,button,input,textarea,select,*{cursor:none!important}`}</style>
      <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 999999, pointerEvents: "none", willChange: "transform", transform: "translate3d(0,0,0)", backfaceVisibility: "hidden" }} />
    </>,
    document.body
  );
});

export default Cursor;
