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
  const wasHovering = useRef(false);
  const clickScale = useRef(0);
  const lastTime = useRef(Date.now());
  const lastMoveTime = useRef(Date.now());
  
  // Waveform state
  const history = useRef<number[]>(new Array(80).fill(0));
  const clickFlatlineStartTime = useRef<number | null>(null);
  const hoverTransition = useRef(0); // 0 (idle/bone) to 1 (cursed cyan)
  const scanLineProgress = useRef(-1); // -1 to 1 (sweep)

  const BONE = { r: 232, g: 232, b: 230 };
  const CYAN = { r: 14, g: 224, b: 195 };
  const BLOOD = { r: 217, g: 17, b: 17 };

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

  // Change 2: Brutal Angular EKG Shape
  const getBrutalECGValue = (t: number) => {
    const cycle = t % 1;
    // P-wave (angular bump)
    if (cycle < 0.1) return (cycle / 0.1) * 8;
    if (cycle < 0.2) return 8 - ((cycle - 0.1) / 0.1) * 8;
    // QRS complex (hard angles)
    if (cycle >= 0.25 && cycle < 0.28) return (cycle - 0.25) * -150; // Q-dip
    if (cycle >= 0.28 && cycle < 0.32) return -4.5 + ((cycle - 0.28) / 0.04) * 80; // R-spike
    if (cycle >= 0.32 && cycle < 0.36) return 35.5 - ((cycle - 0.32) / 0.04) * 90; // S-dip
    if (cycle >= 0.36 && cycle < 0.4) return -14.5 + ((cycle - 0.36) / 0.04) * 14.5; // return
    // T-wave (angular bump)
    if (cycle >= 0.5 && cycle < 0.65) return (cycle - 0.5) * 12;
    if (cycle >= 0.65 && cycle < 0.8) return 1.8 - ((cycle - 0.65) / 0.15) * 1.8;
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
      const interactive = !!(
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("interactive") ||
        window.getComputedStyle(target).cursor === "pointer"
      );

      if (interactive && !wasHovering.current) {
        // Change 3: Trigger scan line sweep on hover entry
        scanLineProgress.current = 0;
      }
      isHovering.current = interactive;
      wasHovering.current = interactive;
    };

    const handleMouseDown = () => {
      clickScale.current = 1.0;
      clickFlatlineStartTime.current = Date.now();
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

      // 1. Calculations
      const dx = mouse.current.x - prevMouse.current.x;
      const dy = mouse.current.y - prevMouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      velocity.current += (dist - velocity.current) * 0.1;
      prevMouse.current = { ...mouse.current };

      const isClickFlatlining = clickFlatlineStartTime.current && (now - clickFlatlineStartTime.current < 200);

      let targetInterval = 1200;
      if (isHovering.current) {
        targetInterval = 800;
        hoverTransition.current = Math.min(1, hoverTransition.current + dt / 150);
      } else {
        const vRatio = Math.min(velocity.current / 50, 1);
        targetInterval = 1200 - (vRatio * 900);
        hoverTransition.current = Math.max(0, hoverTransition.current - dt / 150);
      }
      pulseTimer.current += dt / targetInterval;

      if (clickFlatlineStartTime.current && !isClickFlatlining) {
        clickFlatlineStartTime.current = null;
        history.current[0] = -50; // Violent restart spike
      }

      // Handle Scan Line Progress
      if (scanLineProgress.current >= 0 && scanLineProgress.current <= 1) {
        scanLineProgress.current += dt / 300;
      }

      // Color Interpolation (Idle Bone to Hover Cyan)
      const r = Math.round(BONE.r + (CYAN.r - BONE.r) * hoverTransition.current);
      const g = Math.round(BONE.g + (CYAN.g - BONE.g) * hoverTransition.current);
      const b = Math.round(BONE.b + (CYAN.b - BONE.b) * hoverTransition.current);
      let currentColor = `rgb(${r}, ${g}, ${b})`;
      let currentWaveColor = { r, g, b };

      if (isClickFlatlining) {
        currentColor = `rgb(${BLOOD.r}, ${BLOOD.g}, ${BLOOD.b})`;
        currentWaveColor = BLOOD;
      }

      // Pulse scaling
      const pulseEase = Math.sin((pulseTimer.current % 1) * Math.PI);
      const baseScale = isHovering.current ? 1.25 : 1.0;
      pulseScale.current = baseScale + (pulseEase * 0.6);

      if (clickScale.current > 0) {
        if (!isClickFlatlining) {
          pulseScale.current += clickScale.current * 1.2;
          clickScale.current -= dt / 400;
        } else {
          pulseScale.current = baseScale;
        }
      }

      // Waveform update (Robotic Angular)
      let nextY = 0;
      const timeSinceMove = now - lastMoveTime.current;

      if (isClickFlatlining) {
        nextY = 0;
      } else if (hoverTransition.current > 0.5) {
        // High amplitude lock-on ECG
        nextY = -getBrutalECGValue(pulseTimer.current) * (1.5 + hoverTransition.current);
      } else if (timeSinceMove > 300) {
        nextY = 0;
      } else {
        // Angular velocity spikes
        const amp = velocity.current * (Math.random() > 0.7 ? 3.0 : 0.5);
        nextY = -amp;
      }

      history.current.unshift(nextY);
      if (history.current.length > 80) history.current.pop();

      // 2. DOM Updates (Dot)
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) scale(${pulseScale.current})`;
        cursorRef.current.style.backgroundColor = currentColor;
        
        // Change 4: Brutal shadow on click (200ms)
        if (isClickFlatlining) {
          cursorRef.current.style.boxShadow = `8px 8px 0px ${currentColor}`;
          cursorRef.current.style.opacity = "1";
        } else {
          const glowOpacity = pulseEase * 0.4;
          cursorRef.current.style.boxShadow = `0 0 ${10 * pulseEase}px rgba(${r},${g},${b},${glowOpacity})`;
          cursorRef.current.style.opacity = "1";
        }
      }

      // 3. Canvas Drawing (Waveform)
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const timeSinceMove = now - lastMoveTime.current;
        if (timeSinceMove < 1500) {
          ctx.beginPath();
          ctx.lineWidth = 1.2;
          ctx.lineJoin = "miter"; // Sharp corners for Change 2
          
          let lastX = mouse.current.x;
          let lastY = mouse.current.y;
          
          for (let i = 0; i < history.current.length; i++) {
            const x = mouse.current.x - i * 1.5;
            const y = mouse.current.y + history.current[i];
            
            // Change 2: Hard Opacity Bands
            let alpha = 0.1;
            if (i < 27) alpha = 0.6;
            else if (i < 54) alpha = 0.3;
            if (isHovering.current) alpha *= 1.2;

            ctx.strokeStyle = `rgba(${currentWaveColor.r}, ${currentWaveColor.g}, ${currentWaveColor.b}, ${alpha})`;
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(x, y);
            }
          }
        }

        // Change 3: Scan Line Sweep on Hover
        if (scanLineProgress.current >= 0 && scanLineProgress.current <= 1) {
          const sweepY = mouse.current.y - 20 + (scanLineProgress.current * 40);
          ctx.beginPath();
          ctx.lineWidth = 1.0;
          ctx.strokeStyle = `rgba(${CYAN.r}, ${CYAN.g}, ${CYAN.b}, 0.4)`;
          ctx.moveTo(mouse.current.x - 20, sweepY);
          ctx.lineTo(mouse.current.x + 20, sweepY);
          ctx.stroke();
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
        className="fixed inset-0 pointer-events-none z-[9998]"
      />

      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[1000000] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform, box-shadow, background-color' }}
      />
    </>
  );
}
