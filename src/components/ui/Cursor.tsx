"use client";

import { useEffect, useState, useRef } from "react";

export default function Cursor() {
  const [isTouch, setIsTouch] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const mouse = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef(0);
  const pulseScale = useRef(1);
  const pulseTimer = useRef(0);
  const isHovering = useRef(false);
  const clickScale = useRef(0);
  const lastTime = useRef(Date.now());
  const lastMoveTime = useRef(Date.now());
  
  // Waveform state
  const history = useRef<number[]>(new Array(80).fill(0));
  const clickFlatlineStartTime = useRef<number | null>(null);
  const hoverTransition = useRef(0); // 0 (velocity) to 1 (ECG lock)

  useEffect(() => {
    const touchDevice = window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(touchDevice);
    
    if (!touchDevice && canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getECGValue = (t: number) => {
    const cycle = t % 1;
    // P-wave
    if (cycle < 0.1) return Math.sin((cycle / 0.1) * Math.PI) * 4;
    // QRS complex
    if (cycle > 0.15 && cycle < 0.18) return (cycle - 0.15) * -50; 
    if (cycle >= 0.18 && cycle < 0.22) return -1.5 + ((cycle - 0.18) / 0.04) * 35; // R-spike
    if (cycle >= 0.22 && cycle < 0.25) return 33.5 - ((cycle - 0.22) / 0.03) * 38; // S-dip
    if (cycle >= 0.25 && cycle < 0.28) return -4.5 + ((cycle - 0.25) / 0.03) * 4.5;
    // T-wave
    if (cycle > 0.4 && cycle < 0.6) return Math.sin(((cycle - 0.4) / 0.2) * Math.PI) * 7;
    return 0;
  };

  useEffect(() => {
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      lastMoveTime.current = Date.now();
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
      clickFlatlineStartTime.current = Date.now();
      // Drop waveform to flatline instantly
      history.current.fill(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);

    let animationFrameId: number;

    const render = () => {
      const now = Date.now();
      const dt = now - lastTime.current;
      lastTime.current = now;

      // 1. Physics & Calculations
      const dx = mouse.current.x - prevMouse.current.x;
      const dy = mouse.current.y - prevMouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      velocity.current += (dist - velocity.current) * 0.1;
      prevMouse.current = { ...mouse.current };

      let targetInterval = 1200;
      if (isHovering.current) {
        targetInterval = 800;
        hoverTransition.current = Math.min(1, hoverTransition.current + dt / 200);
      } else {
        const vRatio = Math.min(velocity.current / 50, 1);
        targetInterval = 1200 - (vRatio * 900);
        hoverTransition.current = Math.max(0, hoverTransition.current - dt / 200);
      }
      pulseTimer.current += dt / targetInterval;

      // Handle Click Flatline (200ms)
      const isClickFlatlining = clickFlatlineStartTime.current && (now - clickFlatlineStartTime.current < 200);
      if (clickFlatlineStartTime.current && !isClickFlatlining) {
        clickFlatlineStartTime.current = null;
        // Waveform restart spike
        history.current[0] = -40; 
      }

      // Pulse scaling
      const pulseEase = Math.sin((pulseTimer.current % 1) * Math.PI);
      const baseScale = isHovering.current ? 1.25 : 1.0;
      pulseScale.current = baseScale + (pulseEase * 0.6);

      if (clickScale.current > 0) {
        // Dot spike effect (after flatline)
        if (!isClickFlatlining) {
          pulseScale.current += clickScale.current * 1.2;
          clickScale.current -= dt / 400;
        } else {
          pulseScale.current = baseScale; // Keep dot calm during flatline crash
        }
      }

      // Waveform update
      let nextY = 0;
      const timeSinceMove = now - lastMoveTime.current;

      if (isClickFlatlining) {
        nextY = 0;
      } else if (hoverTransition.current > 0) {
        const ecgVal = -getECGValue(pulseTimer.current);
        const velVal = -(velocity.current * (Math.random() > 0.8 ? 1.5 : 0.4));
        nextY = velVal * (1 - hoverTransition.current) + ecgVal * hoverTransition.current;
      } else if (timeSinceMove > 300) {
        nextY = 0;
      } else {
        // Spiky velocity wave
        nextY = -(velocity.current * (Math.random() > 0.8 ? 2.5 : 0.6));
      }

      history.current.unshift(nextY);
      if (history.current.length > 80) history.current.pop();

      // 2. DOM Updates (Dot)
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) scale(${pulseScale.current})`;
        const glowOpacity = pulseEase * (isClickFlatlining ? 0 : 0.5);
        cursorRef.current.style.boxShadow = `0 0 ${10 * pulseEase}px rgba(255,255,255,${glowOpacity})`;
        cursorRef.current.style.opacity = isClickFlatlining ? "0.4" : "1";
      }

      // 3. Canvas Drawing (Waveform)
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let canvasOpacity = 1;
        if (timeSinceMove > 1300) {
           canvasOpacity = Math.max(0, 1 - (timeSinceMove - 1300) / 500);
        }

        if (canvasOpacity > 0) {
          ctx.beginPath();
          ctx.lineWidth = 1.2;
          ctx.lineJoin = "round";
          
          for (let i = 0; i < history.current.length; i++) {
            const x = mouse.current.x - i * 1.2;
            const y = mouse.current.y + history.current[i];
            
            // Fade opacity towards the tail
            const alpha = (0.6 * (1 - i / 80)) * canvasOpacity;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            
            if (i === 0) ctx.moveTo(x, y);
            else {
               ctx.lineTo(x, y);
               ctx.stroke();
               ctx.beginPath();
               ctx.moveTo(x, y);
            }
          }
        }
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

      <canvas 
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998] mix-blend-difference"
      />

      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[1000000] mix-blend-difference -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform, box-shadow, opacity' }}
      />
    </>
  );
}
