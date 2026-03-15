"use client";

import { useEffect, useState, useRef } from "react";

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  color: string;
  speed: number;
  decayRate: number;
  type: "out" | "in" | "shock";
  angle: number;
  velocityAtSpawn: number;
}

export default function Cursor() {
  const [isTouch, setIsTouch] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const velocityBuffer = useRef<number[]>([]);
  const currentVelocity = useRef(0);
  const lastSpawnTime = useRef(0);
  const ripples = useRef<Ripple[]>([]);
  const isHovering = useRef(false);
  const lastMoveTime = useRef(Date.now());
  const clickStartTime = useRef(0);
  const isClicking = useRef(false);

  // Constants
  const BONE = "#E8E8E6";
  const CYAN = "#0ee0c3";
  const BLOOD = "#d91111";

  useEffect(() => {
    const checkTouch = () => {
      const isTd = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouch(isTd);
      return isTd;
    };

    if (!checkTouch()) {
      const handleResize = () => {
        if (canvasRef.current) {
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
        }
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    if (isTouch) return;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      lastMoveTime.current = Date.now();
      
      if (anchorRef.current) {
        anchorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) rotate(45deg)`;
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = !!(
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("interactive") ||
        window.getComputedStyle(target).cursor === "pointer"
      );

      if (interactive && !isHovering.current) {
        ripples.current = ripples.current.map(r => 
          r.type === "out" ? { ...r, decayRate: r.decayRate * 5 } : r
        );
      }
      isHovering.current = interactive;
    };

    const onMouseDown = () => {
      isClicking.current = true;
      clickStartTime.current = Date.now();
      
      ripples.current = ripples.current.filter(r => r.type === "shock"); 
      
      const shock: Ripple = {
        x: mouse.current.x,
        y: mouse.current.y,
        radius: 0,
        maxRadius: 120,
        opacity: 1.0,
        color: BLOOD,
        speed: 6,
        decayRate: 0.04,
        type: "shock",
        angle: 0,
        velocityAtSpawn: 0
      };
      
      ripples.current.unshift(shock);
      if (ripples.current.length > 12) ripples.current.pop();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mousedown", onMouseDown);

    let animationFrameId: number;

    const render = () => {
      const now = Date.now();
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      // Physics: Velocity Calculation
      const dx = mouse.current.x - prevMouse.current.x;
      const dy = mouse.current.y - prevMouse.current.y;
      const velocity = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      
      velocityBuffer.current.push(velocity);
      if (velocityBuffer.current.length > 6) velocityBuffer.current.shift();
      currentVelocity.current = velocityBuffer.current.reduce((a, b) => a + b) / velocityBuffer.current.length;
      prevMouse.current = { ...mouse.current };

      const timeSinceMove = now - lastMoveTime.current;
      const isIdle = timeSinceMove > 300;

      // Update Anchor Scale (Upgrade 1)
      if (anchorRef.current) {
        let scale = 1;
        if (isClicking.current) {
          const elapsed = now - clickStartTime.current;
          if (elapsed < 200) {
            // Instant scale to 0.4 on click, then back to 1 over 200ms
            scale = 0.4 + (elapsed / 200) * 0.6;
          } else {
            isClicking.current = false;
            scale = isHovering.current ? 1.4 : 1;
          }
        } else if (isHovering.current) {
          scale = 1.4;
        }

        const currentScaleStr = anchorRef.current.style.getPropertyValue('--scale') || '1';
        const currentScale = parseFloat(currentScaleStr);
        const newScale = currentScale + (scale - currentScale) * (isClicking.current ? 1 : 0.2); // Snap for click, smooth for hover
        
        anchorRef.current.style.setProperty('--scale', newScale.toString());
        anchorRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%) rotate(45deg) scale(${newScale})`;
      }

      // Ripple Spawning Logic
      if (!isIdle) {
        if (isHovering.current) {
          if (now - lastSpawnTime.current > 200) {
            const inward: Ripple = {
              x: mouse.current.x,
              y: mouse.current.y,
              radius: 35,
              maxRadius: 35,
              opacity: 0.55,
              color: CYAN,
              speed: -1.5,
              decayRate: 0.55 / (35 / 1.5),
              type: "in",
              angle: angle,
              velocityAtSpawn: currentVelocity.current
            };
            ripples.current.unshift(inward);
            lastSpawnTime.current = now;
          }
        } else {
          const spawnInterval = Math.max(40, 120 - (currentVelocity.current * 8));
          if (now - lastSpawnTime.current > spawnInterval) {
            const vRatio = Math.min(Math.max(0, currentVelocity.current - 3) / 5, 1);
            
            const outward: Ripple = {
              x: mouse.current.x,
              y: mouse.current.y,
              radius: 0,
              maxRadius: 40 + (vRatio * 40),
              opacity: 0.35 + (vRatio * 0.3),
              color: BONE,
              speed: 1.2 + (vRatio * 1.6),
              decayRate: 0.008 + (vRatio * 0.006),
              type: "out",
              angle: angle,
              velocityAtSpawn: currentVelocity.current
            };
            ripples.current.unshift(outward);
            lastSpawnTime.current = now;
          }
        }
      }

      if (ripples.current.length > 12) ripples.current = ripples.current.slice(0, 12);

      // Rendering
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ripples.current = ripples.current.filter(r => {
          r.radius += r.speed;
          r.opacity -= r.decayRate;

          if (r.opacity <= 0 || (r.type === "in" && r.radius <= 0)) return false;

          // Draw Elliptical Ripple (Upgrade 2)
          ctx.beginPath();
          const radiusX = r.radius * (1 + (r.type === "shock" ? 0 : r.velocityAtSpawn * 0.08));
          const radiusY = r.radius;
          
          ctx.ellipse(r.x, r.y, radiusX, radiusY, r.angle, 0, Math.PI * 2);
          ctx.lineWidth = 0.8 * (r.opacity / (r.type === "shock" ? 1.0 : 0.65));
          ctx.strokeStyle = r.color;
          ctx.globalAlpha = r.opacity;
          ctx.stroke();
          ctx.globalAlpha = 1.0;

          return true;
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mousedown", onMouseDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <style>{`
        body, a, button, input, textarea, select, * {
          cursor: none !important;
        }
        .diamond-anchor {
          position: fixed;
          top: 0;
          left: 0;
          width: 8px;
          height: 8px;
          background: #E8E8E6;
          z-index: 10000;
          pointer-events: none;
          mix-blend-mode: difference;
          transition: scale 150ms ease;
          will-change: transform;
        }
        .ripple-canvas {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
        }
      `}</style>
      <div ref={anchorRef} className="diamond-anchor" />
      <canvas
        ref={canvasRef}
        className="ripple-canvas"
      />
    </>
  );
}
