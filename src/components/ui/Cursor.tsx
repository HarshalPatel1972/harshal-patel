"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

export default function Cursor() {
  const [isTouch, setIsTouch] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Physics State
  const px = useRef(new Float32Array(20));
  const py = useRef(new Float32Array(20));
  const vx = useRef(new Float32Array(20));
  const vy = useRef(new Float32Array(20));
  const locked = useRef(new Uint8Array(20));
  const pt = useRef(new Float32Array(20));
  
  // Mouse and Meta State
  const mouse = useRef({ x: 0, y: 0 });
  const hoverType = useRef<"none" | "standard" | "play">("none");
  const totalClicks = useRef(0);
  const clickIdleTimer = useRef(0);
  const burstFlash = useRef(0);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Constants
  const PSIZE = 2.2;
  const GAP = PSIZE * 2 + 1.2; 
  const tipX = 4 * GAP;
  const tipY = -4 * GAP;
  
  const BONE = "#FFFFFF";
  const CYAN = "#0ee0c3";
  const BLOOD = "#d91111";

  // Pre-calculate Slots
  const arrowSlots = useRef<{x: number, y: number}[]>([]);
  const playSlots = useRef<{x: number, y: number}[]>([]);

  useEffect(() => {
    // Detect Touch
    const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(touchDevice);
    if (touchDevice) return;

    // ─── ARROW SLOTS (↗) ───
    const aSlots = [];
    for (let i = 0; i <= 8; i++) {
        aSlots.push({
        x: -4 * GAP + (i / 8) * 8 * GAP,
        y: 4 * GAP - (i / 8) * 8 * GAP
      });
    }
    for (let i = 1; i <= 5; i++) {
        aSlots.push({ x: tipX - i * GAP, y: tipY });
    }
    for (let i = 1; i <= 5; i++) {
        aSlots.push({ x: tipX, y: tipY + i * GAP });
    }
    arrowSlots.current = aSlots;

    // ─── SEARCH SLOTS (🔍 + dots) ───
    const sSlots = [];
    const radius = 4.5 * GAP;
    const centerX = -GAP;
    const centerY = -GAP;
    
    // Circle of the magnifying glass (12 particles)
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        sSlots.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius
        });
    }
    
    // Handle of the magnifying glass (4 particles)
    for (let i = 1; i <= 4; i++) {
        sSlots.push({
            x: centerX + radius + i * (GAP * 0.8),
            y: centerY + radius + i * (GAP * 0.8)
        });
    }

    // Trailing Dots (3 particles)
    for (let i = 0; i < 3; i++) {
        sSlots.push({
            x: centerX - radius - (i + 2) * GAP,
            y: centerY
        });
    }
    playSlots.current = sSlots;

    // Initialize Particles
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 100;
      px.current[i] = centerX + Math.cos(angle) * dist;
      py.current[i] = centerY + Math.sin(angle) * dist;
      vx.current[i] = -Math.sin(angle) * 2;
      vy.current[i] = Math.cos(angle) * 2;
      pt.current[i] = (Math.PI * 2 / 19) * (i - 1);
    }

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const closestHover = target.closest('a, button, [role="button"], [data-cursor]');
      
      if (closestHover) {
        const type = (closestHover as HTMLElement).getAttribute('data-cursor');
        if (type === 'play') {
          hoverType.current = "play";
        } else {
          hoverType.current = "standard";
        }
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const closestHover = target.closest('a, button, [role="button"], [data-cursor]');
      if (closestHover) {
        hoverType.current = "none";
        locked.current.fill(0);
      }
    };

    const onMouseDown = () => {
      totalClicks.current++;
      clickIdleTimer.current = 0;
      burstFlash.current = 18;
      locked.current.fill(0);
      
      const force = 6 + totalClicks.current * 5;
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        vx.current[i] += Math.cos(angle) * force;
        vy.current[i] += Math.sin(angle) * force;
      }
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

    let animationFrameId: number;
    const loop = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      if (isScrolling.current) {
        canvas.style.opacity = '0';
        animationFrameId = requestAnimationFrame(loop);
        return;
      } else {
        canvas.style.opacity = '1';
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      vx.current[0] += (mouse.current.x - px.current[0]) * 0.20;
      vy.current[0] += (mouse.current.y - py.current[0]) * 0.20;
      vx.current[0] *= 0.68;
      vy.current[0] *= 0.68;
      px.current[0] += vx.current[0];
      py.current[0] += vy.current[0];

      if (burstFlash.current > 0) burstFlash.current--;
      clickIdleTimer.current++;
      if (clickIdleTimer.current > 240) totalClicks.current = 0;

      const currentColor = burstFlash.current > 0 ? BLOOD : (hoverType.current !== "none" ? CYAN : BONE);

      for (let i = 1; i < 20; i++) {
        if (hoverType.current !== "none") {
          const slots = hoverType.current === "play" ? playSlots.current : arrowSlots.current;
          const slot = slots[i - 1];
          const tx = px.current[0] + slot.x;
          const ty = py.current[0] + slot.y;

          if (locked.current[i]) {
            px.current[i] = tx;
            py.current[i] = ty;
            vx.current[i] = 0;
            vy.current[i] = 0;
          } else {
            const dx = tx - px.current[i];
            const dy = ty - py.current[i];
            const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;

            if (dist < 2.5) {
              px.current[i] = tx;
              py.current[i] = ty;
              vx.current[i] = 0;
              vy.current[i] = 0;
              locked.current[i] = 1;
            } else {
              const grav = Math.min(100000 / (dist + 1), 600);
              vx.current[i] += (dx / dist) * grav * 0.016;
              vy.current[i] += (dy / dist) * grav * 0.016;
              let drag = 0.72;
              if (dist < 8) drag = 0.35;
              else if (dist < 20) drag = 0.52;
              else if (dist < 50) drag = 0.62;
              vx.current[i] *= drag;
              vy.current[i] *= drag;
              px.current[i] += vx.current[i];
              py.current[i] += vy.current[i];
            }
          }
        } else {
          pt.current[i] += 0.020;
          const tx = px.current[0] + Math.cos(pt.current[i]) * 20;
          const ty = py.current[0] + Math.sin(pt.current[i]) * 20;
          const dx = tx - px.current[i];
          const dy = ty - py.current[i];
          const distToTarget = Math.sqrt(dx * dx + dy * dy);
          const lerpStrength = distToTarget > 40 ? 0.08 : distToTarget > 15 ? 0.14 : 0.22;
          vx.current[i] += dx * lerpStrength;
          vy.current[i] += dy * lerpStrength;
          vx.current[i] *= 0.60;
          vy.current[i] *= 0.60;
          px.current[i] += vx.current[i];
          py.current[i] += vy.current[i];
        }
      }

      if (hoverType.current === "none") {
        ctx.beginPath();
        ctx.arc(px.current[0], py.current[0], 20, 0, Math.PI * 2);
        ctx.strokeStyle = "#E8E8E6";
        ctx.globalAlpha = 0.04;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }
      for (let i = 0; i < 20; i++) {
        const x = px.current[i];
        const y = py.current[i];
        ctx.beginPath();
        ctx.arc(x, y, PSIZE, 0, Math.PI * 2);
        ctx.fillStyle = currentColor;
        ctx.fill();

        if (burstFlash.current === 0) {
          ctx.beginPath();
          ctx.arc(x - PSIZE * 0.30, y - PSIZE * 0.30, PSIZE * 0.38, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.70)";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, y, PSIZE + 1.1, 0, Math.PI * 2);
          ctx.lineWidth = 0.6;
          ctx.strokeStyle = hoverType.current !== "none" ? "rgba(14, 224, 195, 0.30)" : "rgba(232, 232, 230, 0.09)";
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [isTouch]);

  if (isTouch) return null;

  // Use Portal to ensure the cursor is a direct child of <body>
  // This prevents any parent transforms or perspectives from disrupting the fixed positioning
  return createPortal(
    <>
      <style>{`
        body, a, button, input, textarea, select, * {
          cursor: none !important;
        }
        .gravity-parent-fixed {
          position: fixed;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          z-index: 10000;
          pointer-events: none;
          mix-blend-mode: difference;
          will-change: transform;
        }
        .particle-swatch {
          position: absolute;
          width: 4.4px;
          height: 4.4px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>

      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          pointerEvents: 'none',
          mixBlendMode: 'difference',
          willChange: 'transform'
        }}
      />
    </>,
    document.body
  );
}
