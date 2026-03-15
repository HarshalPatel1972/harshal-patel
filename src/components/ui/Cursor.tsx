"use client";

import { useEffect, useState, useRef } from "react";

export default function Cursor() {
  const [isTouch, setIsTouch] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef(0);
  const pulseScale = useRef(1);
  const pulseTimer = useRef(0);
  const isHovering = useRef(false);
  const clickScale = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    const touchDevice = window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(touchDevice);
  }, []);

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

      isHovering.current = !!interactive;
    };

    const handleMouseDown = () => {
      clickScale.current = 1.0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);

    let animationFrameId: number;

    const render = () => {
      const now = Date.now();
      const dt = now - lastTime.current;
      lastTime.current = now;

      // Calculate velocity
      const dx = mouse.current.x - prevMouse.current.x;
      const dy = mouse.current.y - prevMouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Smooth velocity tracking
      velocity.current += (dist - velocity.current) * 0.1;
      prevMouse.current = { ...mouse.current };

      // Determine Pulse Interval
      // Resting: 1200ms
      // Max Fast: 300ms
      // Hover: 800ms (Fixed)
      let targetInterval = 1200;
      if (isHovering.current) {
        targetInterval = 800;
      } else {
        // Map velocity (roughly 0 to 100 pixels per frame) to interval 1200 -> 300
        const vRatio = Math.min(velocity.current / 50, 1);
        targetInterval = 1200 - (vRatio * 900);
      }

      // Progress pulse timer
      pulseTimer.current += dt / targetInterval;
      
      // Soft ease pulse: 1 -> 1.6 -> 1
      // Sine wave peak at 0.5 cycle
      const pulseEase = Math.sin((pulseTimer.current % 1) * Math.PI);
      const baseScale = isHovering.current ? 1.25 : 1.0; // 10px vs 8px roughly (1.25 * 8 = 10)
      pulseScale.current = baseScale + (pulseEase * 0.6);

      // Handle Click Spike
      if (clickScale.current > 0) {
        pulseScale.current += clickScale.current * 1.2; // Spike to ~2.2+
        clickScale.current -= dt / 400; // Decay over 400ms
        if (clickScale.current < 0) clickScale.current = 0;
      }

      // Update Native DOM
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) scale(${pulseScale.current})`;
        // Glow on expansion peak
        const glowOpacity = pulseEase * 0.5;
        cursorRef.current.style.boxShadow = `0 0 ${10 * pulseEase}px rgba(255,255,255,${glowOpacity})`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
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

      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[1000000] mix-blend-difference -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform, box-shadow' }}
      />
    </>
  );
}
