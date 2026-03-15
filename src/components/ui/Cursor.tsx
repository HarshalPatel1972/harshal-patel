"use client";

import { useEffect, useState, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 1.0 to 0.0
  decay: number;
  size: number;
  type: "tendril" | "core" | "burst";
  color: string;
  borderColor?: string;
}

export default function Cursor() {
  const [isTouch, setIsTouch] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Constants
  const BONE = "#E8E8E6";
  const CYAN = "#0ee0c3";
  const BLOOD = "#d91111";
  const INK = "#050505";

  // Mouse & Physics
  const mouse = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const velocityBuffer = useRef<number[]>([]);
  const currentVelocity = useRef(0);

  // States
  const particles = useRef<Particle[]>([]);
  const isHovering = useRef(false);
  const isClicking = useRef(false);
  const clickStartTime = useRef(0);

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
      isHovering.current = interactive;
    };

    const onMouseDown = () => {
      isClicking.current = true;
      clickStartTime.current = Date.now();
      
      // Spawn 28 burst particles
      for (let i = 0; i < 28; i++) {
        const angle = (Math.PI * 2 * i) / 28 + (Math.random() - 0.5) * 0.3;
        const speed = 2 + Math.random() * 4;
        particles.current.push({
          x: mouse.current.x,
          y: mouse.current.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          decay: 0.04 + Math.random() * 0.02,
          size: 2 + Math.random() * 2,
          type: "burst",
          color: BLOOD
        });
      }

      // Turn all existing particles to Blood Red for 150ms
      particles.current.forEach(p => {
        if (p.type !== "burst") {
          p.color = BLOOD;
          if (p.borderColor) p.borderColor = BLOOD;
        }
      });
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
      if (velocityBuffer.current.length > 8) velocityBuffer.current.shift();
      currentVelocity.current = velocityBuffer.current.reduce((a, b) => a + b) / velocityBuffer.current.length;
      const intensity = Math.min(currentVelocity.current / 12, 1);
      prevMouse.current = { ...mouse.current };

      const clickElapsed = now - clickStartTime.current;
      if (isClicking.current && clickElapsed > 150) {
        // Return colors back to normal after click flash
        isClicking.current = false; // Note: simplified logic, anchor uses clickStartTime directly
      }

      // 2. Spawning Logic
      const cap = isHovering.current ? 80 : 120;
      
      let coreCount = 0;
      let tendrilCount = 0;
      let coreSpawnChance = 0;
      let tendrilSpawnChance = 0;

      if (isHovering.current) {
        coreCount = Math.floor(6 + Math.random() * 3);
        tendrilCount = Math.floor(4 + Math.random() * 2);
        coreSpawnChance = 1;
        tendrilSpawnChance = 1;
      } else if (currentVelocity.current > 0.5) {
        const isFast = currentVelocity.current > 8;
        coreCount = isFast ? Math.floor(4 + Math.random() * 3) : Math.floor(1 + Math.random() * 2);
        tendrilCount = isFast ? Math.floor(2 + Math.random() * 2) : 1;
        coreSpawnChance = 1;
        tendrilSpawnChance = isFast ? 1 : 0.55;
      }

      // Spawn Core
      if (Math.random() < coreSpawnChance) {
        for (let i = 0; i < coreCount; i++) {
          const spread = isHovering.current ? 10 : (5 + intensity * 5);
          const hue = Math.floor(170 + Math.random() * 20 + (isHovering.current ? -5 : 0));
          const brightness = Math.floor(55 + Math.random() * 20 + (isHovering.current ? 5 : 0));
          const sizeBase = isHovering.current ? (2.5 + Math.random() * 3.5) : (1.2 + Math.random() * 2.8 * (1 + intensity));
          const vyBase = isHovering.current ? -(1.5 + Math.random() * 2.5) : -(0.8 + Math.random() * 1.8 * (1 + intensity));

          particles.current.push({
            x: mouse.current.x + (Math.random() - 0.5) * spread * 2,
            y: mouse.current.y,
            vx: (Math.random() - 0.5) * 1.2,
            vy: vyBase,
            life: 1.0,
            decay: 0.028 + Math.random() * 0.025,
            size: sizeBase,
            type: "core",
            color: `hsl(${hue}, 90%, ${brightness}%)`
          });
        }
      }

      // Spawn Tendrils
      if (Math.random() < tendrilSpawnChance) {
        for (let i = 0; i < tendrilCount; i++) {
          const spread = isHovering.current ? 32 : (18 + intensity * 10);
          const sizeBase = isHovering.current ? (4 + Math.random() * 5) : (2 + Math.random() * 3.5);
          const borderAlpha = isHovering.current ? (0.25 + Math.random() * 0.3) : (0.15 + Math.random() * 0.2);

          particles.current.push({
            x: mouse.current.x + (Math.random() - 0.5) * spread * 2,
            y: mouse.current.y,
            vx: (Math.random() - 0.5) * 2.4,
            vy: -(0.3 + Math.random() * 0.8),
            life: 1.0,
            decay: 0.018 + Math.random() * 0.02,
            size: sizeBase,
            type: "tendril",
            color: INK,
            borderColor: `rgba(14, 224, 195, ${borderAlpha})`
          });
        }
      }

      if (particles.current.length > cap) {
        particles.current = particles.current.slice(particles.current.length - cap);
      }

      // 3. Render Anchor (Diamond)
      if (anchorRef.current) {
        const isClickWindow = (now - clickStartTime.current) < 200;
        const color = isClickWindow ? BLOOD : (isHovering.current ? CYAN : BONE);
        const scale = isClickWindow ? (0.5 + Math.min((now - clickStartTime.current) / 200, 1) * 0.5) : (isHovering.current ? 1.4 : 1);
        
        anchorRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%) rotate(45deg) scale(${scale})`;
        anchorRef.current.style.backgroundColor = color;
      }

      // 4. Render Canvas
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Filter and update particles
        particles.current = particles.current.filter(p => {
          p.life -= p.decay;
          if (p.life <= 0) return false;

          p.x += p.vx;
          p.y += p.vy;

          if (p.type === "core") {
            p.vy -= 0.015; // Upward acceleration
            p.vx += (Math.random() - 0.5) * 0.1; // Drift
          } else if (p.type === "tendril") {
            p.vx += (Math.random() - 0.5) * 0.16; // Drift
          }

          return true;
        });

        const isActualClickFlash = (now - clickStartTime.current) < 150;

        // Render Tendrils
        particles.current.filter(p => p.type === "tendril").forEach(p => {
          ctx.globalAlpha = p.life * 0.55;
          ctx.fillStyle = isActualClickFlash ? BLOOD : p.color;
          ctx.strokeStyle = isActualClickFlash ? BLOOD : (p.borderColor || p.color);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.rect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          ctx.fill();
          ctx.stroke();
        });

        // Render Cores
        particles.current.filter(p => p.type === "core").forEach(p => {
          ctx.globalAlpha = p.life * 0.85;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 1.8);
          const color = isActualClickFlash ? BLOOD : p.color;
          grad.addColorStop(0, color);
          grad.addColorStop(0.5, isActualClickFlash ? `rgba(217, 17, 17, 0.6)` : `rgba(14, 224, 195, 0.6)`);
          grad.addColorStop(1, "transparent");
          
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
          ctx.fill();
        });

        // Render Bursts
        particles.current.filter(p => p.type === "burst").forEach(p => {
          ctx.globalAlpha = p.life * 0.9;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.rect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          ctx.fill();
        });

        ctx.globalAlpha = 1.0;
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
        .flame-canvas {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
          will-change: transform;
        }
        .flame-anchor {
          position: fixed;
          top: 0;
          left: 0;
          width: 7px;
          height: 7px;
          z-index: 10000;
          pointer-events: none;
          mix-blend-mode: difference;
          will-change: transform, background-color;
        }
      `}</style>
      <div ref={anchorRef} className="flame-anchor" />
      <canvas
        ref={canvasRef}
        className="flame-canvas"
      />
    </>
  );
}
