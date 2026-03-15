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
  
  // Mouse and Meta State
  const mouse = useRef({ x: 0, y: 0 });
  const isHover = useRef(false);
  const totalClicks = useRef(0);
  const clickIdleTimer = useRef(0);
  const burstFlash = useRef(0);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Constants
  const PSIZE = 2.2;
  const GAP = PSIZE * 2 + 3.0; // 7.4px
  const tipX = 4 * GAP;
  const tipY = -4 * GAP;
  
  const BONE = "#FFFFFF";
  const CYAN = "#0ee0c3";
  const BLOOD = "#d91111";

  // Pre-calculate Arrow Slots (↗)
  const arrowSlots = useRef<{x: number, y: number}[]>([]);

  useEffect(() => {
    // Detect Touch
    const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(touchDevice);
    if (touchDevice) return;

    // Initialize Slots
    const slots = [];
    // Diagonal shaft (0-8)
    for (let i = 0; i <= 8; i++) {
      slots.push({
        x: -4 * GAP + (i / 8) * 8 * GAP,
        y: 4 * GAP - (i / 8) * 8 * GAP
      });
    }
    // Horizontal arm (9-13) - tip going LEFT
    for (let i = 1; i <= 5; i++) {
      slots.push({
        x: tipX - i * GAP,
        y: tipY
      });
    }
    // Vertical arm (14-18) - tip going DOWN
    for (let i = 1; i <= 5; i++) {
      slots.push({
        x: tipX,
        y: tipY + i * GAP
      });
    }
    arrowSlots.current = slots;

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
    }

    // Canvas Resize
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Mouse Tracking
    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    // Hover Detection via Delegation
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('a, button, [role="button"], [data-cursor="hover"]') || 
          target.closest('a, button, [role="button"], [data-cursor="hover"]')) {
        isHover.current = true;
      }
    };
    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('a, button, [role="button"], [data-cursor="hover"]') || 
          target.closest('a, button, [role="button"], [data-cursor="hover"]')) {
        isHover.current = false;
        locked.current.fill(0); // Release all locks on exit
      }
    };

    // Click Burst
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
      if (!isScrolling.current) {
        isScrolling.current = true;
      }
      
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
      }, 150); // Threshold to detect scroll end
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("mousedown", onMouseDown);

    // Physics Loop
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

      // 1. Parent Physics
      vx.current[0] += (mouse.current.x - px.current[0]) * 0.20;
      vy.current[0] += (mouse.current.y - py.current[0]) * 0.20;
      vx.current[0] *= 0.68;
      vy.current[0] *= 0.68;
      px.current[0] += vx.current[0];
      py.current[0] += vy.current[0];

      // 2. Click Logic
      if (burstFlash.current > 0) burstFlash.current--;
      clickIdleTimer.current++;
      if (clickIdleTimer.current > 240) totalClicks.current = 0;

      const currentColor = burstFlash.current > 0 ? BLOOD : (isHover.current ? CYAN : BONE);

      // 3. Child Physics
      for (let i = 1; i < 20; i++) {
        if (isHover.current) {
          // HOVER STATE (↗ formation)
          const slot = arrowSlots.current[i - 1];
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
          // IDLE/MOVE STATE
          const dx = px.current[0] - px.current[i];
          const dy = py.current[0] - py.current[i];
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
          const grav = Math.min(9600 / (dist + 10), 144); // 8000 * 1.2 = 9600, 120 * 1.2 = 144

          vx.current[i] += (dx / dist) * grav * 0.016;
          vy.current[i] += (dy / dist) * grav * 0.016;
          vx.current[i] += (-dy / dist) * 0.30;
          vy.current[i] += (dx / dist) * 0.30;
          
          vx.current[i] *= 0.84;
          vy.current[i] *= 0.84;
          px.current[i] += vx.current[i];
          py.current[i] += vy.current[i];
        }
      }

      // 4. Rendering
      for (let i = 0; i < 20; i++) {
        const x = px.current[i];
        const y = py.current[i];

        // Main Body
        ctx.beginPath();
        ctx.arc(x, y, PSIZE, 0, Math.PI * 2);
        ctx.fillStyle = currentColor;
        ctx.fill();

        if (burstFlash.current === 0) {
          // Glass Specular
          ctx.beginPath();
          ctx.arc(x - PSIZE * 0.30, y - PSIZE * 0.30, PSIZE * 0.38, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.70)";
          ctx.fill();

          // Rim Glow
          ctx.beginPath();
          ctx.arc(x, y, PSIZE + 1.1, 0, Math.PI * 2);
          ctx.lineWidth = 0.6;
          ctx.strokeStyle = isHover.current ? "rgba(14, 224, 195, 0.30)" : "rgba(232, 232, 230, 0.09)";
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
