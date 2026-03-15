"use client";

import { useEffect, useState, useRef } from "react";

interface ChildParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export default function Cursor() {
  const [isTouch, setIsTouch] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Constants
  const BONE = "#E8E8E6";
  const CYAN = "#0ee0c3";
  const BLOOD = "#d91111";
  const S = 2.6;
  const BASE_GRAV = 3200;
  const HOVER_GRAV = BASE_GRAV * 10;
  const DRAG_IDLE = 0.89;
  const DRAG_HOVER = 0.65;
  const TANGENTIAL_NUDGE = 0.32;

  // Refs for physics
  const mouse = useRef({ x: 0, y: 0 });
  const parentPos = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const children = useRef<ChildParticle[]>([]);
  const arrowPositions = useRef<{ x: number; y: number }[]>([]);
  
  // State refs
  const isHovering = useRef(false);
  const totalClicks = useRef(0);
  const lastClickTime = useRef(0);
  const burstFlashFrames = useRef(0);

  useEffect(() => {
    const isTd = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(isTd);
    if (isTd) return;

    // Initialize Particles
    const tempChildren: ChildParticle[] = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    for (let i = 0; i < 29; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 100 + Math.random() * 50;
      tempChildren.push({
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: -Math.sin(angle) * 2, // tangential start
        vy: Math.cos(angle) * 2,
        size: 1.6 + Math.random() * 2,
      });
    }
    children.current = tempChildren;

    // Pre-calculate Arrow Slots (↗)
    const slots: { x: number; y: number }[] = [];
    // Diagonal shaft (0-12)
    for (let i = 0; i <= 12; i++) {
      slots.push({
        x: (-6 + (i / 12) * 12) * S,
        y: (6 - (i / 12) * 12) * S,
      });
    }
    // Horizontal arm (13-20)
    for (let i = 1; i <= 8; i++) {
      slots.push({
        x: (6 - (i / 8) * 8) * S,
        y: -6 * S,
      });
    }
    // Vertical arm (21-28)
    for (let i = 1; i <= 8; i++) {
      slots.push({
        x: 6 * S,
        y: (-6 + (i / 8) * 8) * S,
      });
    }
    arrowPositions.current = slots;

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const delegateHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = !!(
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.getAttribute("role") === "button"
      );
      isHovering.current = interactive;
    };

    const onMouseDown = () => {
      const now = Date.now();
      if (now - lastClickTime.current > 4000) { // 240 frames @ 60fps ~4s
        totalClicks.current = 0;
      }
      totalClicks.current++;
      lastClickTime.current = now;
      burstFlashFrames.current = 16;

      const force = 5 + totalClicks.current * 4;
      children.current.forEach(p => {
        const angle = Math.random() * Math.PI * 2;
        p.vx += Math.cos(angle) * force;
        p.vy += Math.sin(angle) * force;
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", delegateHover);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("resize", handleResize);

    let frameId: number;
    const loop = () => {
      const cvs = canvasRef.current;
      const ctx = cvs?.getContext("2d");
      if (!cvs || !ctx) return;

      ctx.clearRect(0, 0, cvs.width, cvs.height);

      // 1. Parent Dot Physics (Spring + Damping)
      parentPos.current.vx += (mouse.current.x - parentPos.current.x) * 0.18;
      parentPos.current.vy += (mouse.current.y - parentPos.current.y) * 0.18;
      parentPos.current.vx *= 0.68;
      parentPos.current.vy *= 0.68;
      parentPos.current.x += parentPos.current.vx;
      parentPos.current.y += parentPos.current.vy;

      // Current visual states
      const isBursting = burstFlashFrames.current > 0;
      if (isBursting) burstFlashFrames.current--;
      const currentColor = isBursting ? BLOOD : (isHovering.current ? CYAN : BONE);

      // 2. Parent Dot DOM Render
      if (parentRef.current) {
        const p = parentRef.current;
        p.style.transform = `translate3d(${parentPos.current.x}px, ${parentPos.current.y}px, 0) translate(-50%, -50%)`;
        p.style.backgroundColor = currentColor;
        p.style.scale = isBursting ? "0.5" : "1";
        p.style.transition = isBursting ? "none" : "scale 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        
        // Specular dot
        const spec = p.firstChild as HTMLElement;
        if (spec) spec.style.display = isBursting ? "none" : "block";
      }

      // 3. Child Particle Physics & Canvas Render
      children.current.forEach((p, i) => {
        let dx, dy;
        if (isHovering.current) {
          const slot = arrowPositions.current[i];
          const tx = parentPos.current.x + slot.x;
          const ty = parentPos.current.y + slot.y;
          dx = tx - p.x;
          dy = ty - p.y;
        } else {
          dx = parentPos.current.x - p.x;
          dy = parentPos.current.y - p.y;
        }

        const dist = Math.hypot(dx, dy) + 0.1;

        if (isHovering.current) {
          const grav = Math.min(HOVER_GRAV / (dist + 10), 200);
          p.vx += (dx / dist) * grav * 0.016;
          p.vy += (dy / dist) * grav * 0.016;
          p.vx *= DRAG_HOVER;
          p.vy *= DRAG_HOVER;
        } else {
          const grav = Math.min(BASE_GRAV / (dist + 10), 55);
          p.vx += (dx / dist) * grav * 0.016;
          p.vy += (dy / dist) * grav * 0.016;
          // Tangential nudge
          p.vx += (-dy / dist) * TANGENTIAL_NUDGE;
          p.vy += (dx / dist) * TANGENTIAL_NUDGE;
          p.vx *= DRAG_IDLE;
          p.vy *= DRAG_IDLE;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Draw Particle
        ctx.beginPath();
        if (isBursting) {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = BLOOD;
          ctx.fill();
        } else {
          // Rim
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + 1.3, 0, Math.PI * 2);
          ctx.lineWidth = 0.6;
          ctx.strokeStyle = isHovering.current ? "rgba(14, 224, 195, 0.3)" : "rgba(232, 232, 230, 0.1)";
          ctx.stroke();

          // Main body
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = currentColor;
          ctx.fill();

          // Specular
          ctx.beginPath();
          ctx.arc(p.x - p.size * 0.32, p.y - p.size * 0.32, p.size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.68)";
          ctx.fill();
        }
      });

      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", delegateHover);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <style>{`
        body, a, button, input, textarea, select, * {
          cursor: none !important;
        }
        .gravity-parent {
          position: fixed;
          top: 0;
          left: 0;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          z-index: 10000;
          pointer-events: none;
          mix-blend-mode: difference;
          will-change: transform, background-color, scale;
        }
        .parent-specular {
          position: absolute;
          top: 15%;
          left: 15%;
          width: 40%;
          height: 40%;
          background: rgba(255,255,255,0.85);
          border-radius: 50%;
        }
      `}</style>

      {/* 29 Children Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{ mixBlendMode: 'difference' }}
      />

      {/* Parent Dot */}
      <div ref={parentRef} className="gravity-parent">
        <div className="parent-specular" />
      </div>
    </>
  );
}
