"use client";

import { useEffect, useState, useRef } from "react";

export default function Cursor() {
  const [isTouch, setIsTouch] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Constants
  const BONE = "#E8E8E6";
  const CYAN = "#0ee0c3";
  const BLOOD = "#d91111";

  // Mouse & Physics
  const mouse = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const velocityBuffer = useRef<number[]>([]);
  const currentVelocity = useRef(0);
  const currentAngle = useRef(0);

  // States
  const isHovering = useRef(false);
  const lastIsHovering = useRef(false);
  const isClicking = useRef(false);
  const showDot = useRef(true);
  const hoverStartTime = useRef(0);
  const clickStartTime = useRef(0);
  const scanLineProgress = useRef(-1); // -1: off, 0-1: sweeping

  useEffect(() => {
    const checkTouch = () => {
      const isTd = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouch(isTd);
      return isTd;
    };

    if (!checkTouch()) {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
      window.addEventListener("resize", handleResize);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResize = () => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
  };

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

      if (interactive && !lastIsHovering.current) {
        hoverStartTime.current = Date.now();
        scanLineProgress.current = 0;
      }
      isHovering.current = interactive;
      lastIsHovering.current = interactive;
    };

    const onMouseDown = () => {
      isClicking.current = true;
      clickStartTime.current = Date.now();
      showDot.current = true;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mousedown", onMouseDown);

    let animationFrameId: number;

    const render = () => {
      const now = Date.now();

      // PHYSICS: Calculate velocity and angle
      const dx = mouse.current.x - prevMouse.current.x;
      const dy = mouse.current.y - prevMouse.current.y;
      const velocity = Math.hypot(dx, dy);

      // Rolling average for smooth lines (5 frames)
      velocityBuffer.current.push(velocity);
      if (velocityBuffer.current.length > 5) velocityBuffer.current.shift();
      currentVelocity.current = velocityBuffer.current.reduce((a, b) => a + b) / velocityBuffer.current.length;

      // Only update angle if moving significantly to prevent jitter
      if (velocity > 0.5) {
        currentAngle.current = Math.atan2(dy, dx);
      }
      prevMouse.current = { ...mouse.current };

      // STATE LOGIC: Click & Dot removal timing
      let clickFactor = 0;
      let impactWindow = false;
      if (isClicking.current) {
        const elapsed = now - clickStartTime.current;
        if (elapsed < 150) {
          impactWindow = true;
          clickFactor = 1;
        } else if (elapsed < 150 + 80) {
          impactWindow = false;
          showDot.current = false;
        } else {
          isClicking.current = false;
          showDot.current = true;
        }
      }

      // DOT RENDER
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%) rotate(45deg) scale(${isClicking.current && impactWindow ? 1.8 : (isHovering.current ? 1.5 : 1)})`;
        dotRef.current.style.display = showDot.current ? "block" : "none";
        
        if (impactWindow) {
          dotRef.current.style.backgroundColor = BLOOD;
          dotRef.current.style.boxShadow = `8px 8px 0px ${BLOOD}`;
        } else if (isHovering.current) {
          dotRef.current.style.backgroundColor = CYAN;
          dotRef.current.style.boxShadow = "none";
        } else {
          // Idle Pulse
          const pulse = 1 + Math.sin(now / 318) * 0.15; // roughly 2s cycle
          dotRef.current.style.transform += ` scale(${pulse})`;
          dotRef.current.style.backgroundColor = BONE;
          dotRef.current.style.boxShadow = "none";
        }
      }

      // CANVAS RENDER (SPEED LINES)
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const v = currentVelocity.current;
        const angle = currentAngle.current;

        if (impactWindow) {
          // CLICK EXPLOSION
          ctx.strokeStyle = BLOOD;
          ctx.lineWidth = 1.5;
          for (let i = 0; i < 8; i++) {
            const explodeAngle = (Math.PI / 4) * i;
            ctx.beginPath();
            ctx.moveTo(mouse.current.x, mouse.current.y);
            ctx.lineTo(
              mouse.current.x + Math.cos(explodeAngle) * 60,
              mouse.current.y + Math.sin(explodeAngle) * 60
            );
            ctx.stroke();
          }
        } else if (isHovering.current) {
          // HOVER TIGHT BURST
          const elapsed = now - hoverStartTime.current;
          const collapse = Math.max(0, 1 - elapsed / 200);
          const lineLength = 6 + collapse * 10;
          ctx.strokeStyle = CYAN;
          ctx.lineWidth = 1;
          for (let i = 0; i < 4; i++) {
            const burstAngle = (Math.PI / 2) * i + Math.PI / 4;
            ctx.beginPath();
            ctx.moveTo(mouse.current.x, mouse.current.y);
            ctx.lineTo(
              mouse.current.x + Math.cos(burstAngle) * lineLength,
              mouse.current.y + Math.sin(burstAngle) * lineLength
            );
            ctx.stroke();
          }

          // Scan line sweep
          if (scanLineProgress.current >= 0 && scanLineProgress.current <= 1) {
            scanLineProgress.current += 16.7 / 300; // rough 60fps dt
            const sweepY = mouse.current.y - 20 + scanLineProgress.current * 40;
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = `rgba(14, 224, 195, 0.35)`;
            ctx.moveTo(mouse.current.x - 20, sweepY);
            ctx.lineTo(mouse.current.x + 20, sweepY);
            ctx.stroke();
          }
        } else if (v > 0.5) {
          // MOVEMENT LINES
          let lineCount = 4;
          let opacity = 0.3;
          let length = 12;
          
          if (v > 3) {
            const factor = Math.min((v - 3) / 5, 1); // interpolating 3 to 8
            lineCount = 4 + Math.floor(factor * 4);
            opacity = 0.3 + factor * 0.4;
            length = 12 + factor * 28;
          }

          ctx.strokeStyle = `rgba(232, 232, 230, ${opacity})`;
          ctx.lineWidth = v > 8 ? 1.5 : 1;

          for (let i = 0; i < lineCount; i++) {
             // Lines extend BEHIND the dot
             const spread = (Math.PI / 6) * (i - (lineCount - 1) / 2);
             const lineAngle = angle + Math.PI + spread;
             
             ctx.beginPath();
             ctx.moveTo(mouse.current.x, mouse.current.y);
             ctx.lineTo(
               mouse.current.x + Math.cos(lineAngle) * length,
               mouse.current.y + Math.sin(lineAngle) * length
             );
             ctx.stroke();
          }
        }
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
        className="fixed inset-0 pointer-events-none z-[9998]"
      />

      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1 h-1 pointer-events-none z-[9999]"
        style={{ willChange: "transform, background-color, box-shadow" }}
      />
    </>
  );
}
