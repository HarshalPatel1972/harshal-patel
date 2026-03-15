"use client";

import { useEffect, useState, useRef } from "react";

interface Star {
  x: number;
  y: number;
  opacity: number;
}

export default function Cursor() {
  const [isTouch, setIsTouch] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<Star[]>([]);
  const mouse = useRef({ x: -1000, y: -1000 });
  const targetCenter = useRef<{ x: number; y: number } | null>(null);
  const clickFlash = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  // 1. Initial Setup & Touch Detection
  useEffect(() => {
    const touchDevice = window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(touchDevice);
    if (!touchDevice) {
      generateStars();
      window.addEventListener("resize", generateStars);
    }
    return () => window.removeEventListener("resize", generateStars);
  }, []);

  const generateStars = () => {
    const count = 25;
    const newStars: Star[] = [];
    for (let i = 0; i < count; i++) {
      newStars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: 0,
      });
    }
    stars.current = newStars;
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
  };

  // 2. Event Listeners
  useEffect(() => {
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive =
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("interactive") ||
        window.getComputedStyle(target).cursor === "pointer";

      if (interactive) {
        const el = target.closest("a") || target.closest("button") || target;
        const rect = el.getBoundingClientRect();
        targetCenter.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      } else {
        targetCenter.current = null;
      }
    };

    const handleMouseDown = () => {
      clickFlash.current = 1.0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);

    // Start Animation
    const render = () => {
      draw();
      animationFrameId.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isTouch]);

  // 3. Render Logic
  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const radius = 120;
    const activeStars: number[] = [];

    // Decaying flash
    if (clickFlash.current > 0) {
      clickFlash.current -= 0.05;
      if (clickFlash.current < 0) clickFlash.current = 0;
    }

    // Determine target position (mouse or element center)
    const tx = targetCenter.current ? targetCenter.current.x : mouse.current.x;
    const ty = targetCenter.current ? targetCenter.current.y : mouse.current.y;

    // Calculate nearest stars for lock-on if hovering
    const distances = stars.current.map((star, i) => {
      const dx = tx - star.x;
      const dy = ty - star.y;
      return { index: i, dist: Math.sqrt(dx * dx + dy * dy) };
    });

    let nearestIndices: number[] = [];
    if (targetCenter.current) {
      // Force nearest 5 stars to activate during hover
      nearestIndices = [...distances]
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 5)
        .map((d) => d.index);
    }

    // Update Star Opacity
    stars.current.forEach((star, i) => {
      const dx = tx - star.x;
      const dy = ty - star.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      let targetOpacity = 0;
      if (nearestIndices.includes(i)) {
        targetOpacity = 1;
      } else if (dist < radius) {
        targetOpacity = 1 - dist / radius;
      }

      // Smooth fade (0.4s ease equivalent roughly)
      star.opacity += (targetOpacity - star.opacity) * 0.1;

      if (star.opacity > 0.01) {
        activeStars.push(i);
      }
    });

    // Draw Connections
    ctx.lineWidth = 0.8;
    activeStars.forEach((idx) => {
      const star = stars.current[idx];
      const neighbors = activeStars
        .filter((nIdx) => nIdx !== idx)
        .map((nIdx) => ({
          idx: nIdx,
          dist: Math.sqrt(
            Math.pow(star.x - stars.current[nIdx].x, 2) +
              Math.pow(star.y - stars.current[nIdx].y, 2)
          ),
        }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3); // Connect to 2-3 neighbors

      neighbors.forEach((n) => {
        const neighbor = stars.current[n.idx];
        const lineOpacity = Math.min(star.opacity, neighbor.opacity) * (0.4 + clickFlash.current * 0.6);
        ctx.strokeStyle = `rgba(232, 232, 230, ${lineOpacity})`;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(neighbor.x, neighbor.y);
        ctx.stroke();
      });
    });

    // Draw Stars
    activeStars.forEach((idx) => {
      const star = stars.current[idx];
      const starColor = 232; // Bone white
      const finalOpacity = Math.min(1, star.opacity + clickFlash.current);
      
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(255, 255, 255, ${star.opacity * 0.5})`;
      ctx.fillStyle = `rgba(${starColor}, ${starColor}, ${starColor}, ${finalOpacity})`;
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
  };

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
        className="fixed inset-0 z-[1000000] pointer-events-none"
      />
    </>
  );
}
