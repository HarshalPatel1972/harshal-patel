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
}

export default function Cursor() {
  const [isTouch, setIsTouch] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const velocityBuffer = useRef<number[]>([]);
  const currentVelocity = useRef(0);
  const lastSpawnTime = useRef(0);
  const ripples = useRef<Ripple[]>([]);
  const isHovering = useRef(false);
  const lastMoveTime = useRef(Date.now());

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
        // Kill existing expanding ripples on hover entry
        ripples.current = ripples.current.map(r => 
          r.type === "out" ? { ...r, decayRate: r.decayRate * 5 } : r
        );
      }
      isHovering.current = interactive;
    };

    const onMouseDown = () => {
      // Click shockwave
      ripples.current = ripples.current.filter(r => r.type === "shock"); // Hard cut other ripples
      
      const shock: Ripple = {
        x: mouse.current.x,
        y: mouse.current.y,
        radius: 0,
        maxRadius: 120,
        opacity: 1.0,
        color: BLOOD,
        speed: 6,
        decayRate: 0.04,
        type: "shock"
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

      // 1. Physics: Velocity Calculation
      const dx = mouse.current.x - prevMouse.current.x;
      const dy = mouse.current.y - prevMouse.current.y;
      const velocity = Math.hypot(dx, dy);
      
      velocityBuffer.current.push(velocity);
      if (velocityBuffer.current.length > 6) velocityBuffer.current.shift();
      currentVelocity.current = velocityBuffer.current.reduce((a, b) => a + b) / velocityBuffer.current.length;
      prevMouse.current = { ...mouse.current };

      const timeSinceMove = now - lastMoveTime.current;
      const isIdle = timeSinceMove > 300;

      // 2. Ripple Spawning Logic
      if (!isIdle) {
        if (isHovering.current) {
          // Hover State: Inward pull rings
          if (now - lastSpawnTime.current > 200) {
            const inward: Ripple = {
              x: mouse.current.x,
              y: mouse.current.y,
              radius: 35,
              maxRadius: 35, // Inward rings start at max and shrink to 0
              opacity: 0.55,
              color: CYAN,
              speed: -1.5, // inward speed
              decayRate: 0.55 / (35 / 1.5), // fade out exactly as it hits center
              type: "in"
            };
            ripples.current.unshift(inward);
            lastSpawnTime.current = now;
          }
        } else {
          // Movement State: Velocity-driven outward ripples
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
              type: "out"
            };
            ripples.current.unshift(outward);
            lastSpawnTime.current = now;
          }
        }
      }

      // Hard cap at 12 ripples
      if (ripples.current.length > 12) ripples.current = ripples.current.slice(0, 12);

      // 3. Rendering
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ripples.current = ripples.current.filter(r => {
          // Update Ripple Path
          if (r.type === "in") {
            r.radius += r.speed;
          } else {
            r.radius += r.speed;
          }
          r.opacity -= r.decayRate;

          if (r.opacity <= 0 || (r.type === "in" && r.radius <= 0)) return false;

          // Draw Ripple
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
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
      `}</style>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
      />
    </>
  );
}
