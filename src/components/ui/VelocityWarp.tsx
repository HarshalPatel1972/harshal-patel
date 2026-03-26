"use client";

import { useEffect, useRef, useState } from "react";

export function VelocityWarp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isWarping, setIsWarping] = useState(false);
  
  const stateRef = useRef({ 
    direction: 1, 
    isWarpingRef: false,
    warpTimer: null as ReturnType<typeof setTimeout> | null
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use state-bound lines so they can be regenerated dynamically or use normalized horizontal placement
    let lines: { xNorm: number; y: number; length: number; speed: number; color: string }[] = [];
    const colors = ['#E8E8E6', '#d91111', '#0ee0c3']; 
    
    // Dynamic Density: Generate lines based on viewport area (Scales perfectly from Mobile to 4K Desktop)
    const generateLines = () => {
      lines = [];
      const density = Math.floor((window.innerWidth * window.innerHeight) / 7000); 
      // e.g. 1920x1080 -> ~296 lines (immersion on desktop). 375x812 -> ~43 lines. (immersion on mobile).
      
      for (let i = 0; i < density; i++) {
          lines.push({
              xNorm: Math.random(), // 0 to 1
              y: Math.random() * window.innerHeight,
              length: 100 + Math.random() * 250, // Cinematic length
              speed: 10 + Math.random() * 20, // Cinematic speed
              color: colors[Math.floor(Math.random() * colors.length)]
          });
      }
    };
    
    generateLines();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateLines(); // Regenerate density on structural viewport shift
    };
    window.addEventListener("resize", resize);
    resize();

    let rafId: number;

    const animate = () => {
      const s = stateRef.current;
      
      // SOLID BRUTALIST BACKGROUND - Hides everything underneath
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ALWAYS render lines so they continue to fly during the CSS fade out!
      // This prevents the abrupt vanishing of the kinetic lines.
        lines.forEach(line => {
        // Lines flow strongly in opposite direction of the jump
        const movement = -s.direction * line.speed;
        line.y += movement;

        // Wrap around seamlessly
        if (line.y < -line.length) line.y = canvas.height + line.length;
        if (line.y > canvas.height + line.length) line.y = -line.length;

        const renderedX = line.xNorm * canvas.width;

        // Speed lines styling
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 2.0;    // Thicker lines for higher visibility
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(renderedX, line.y);
        ctx.lineTo(renderedX, line.y + (movement > 0 ? line.length : -line.length));
        ctx.stroke();
      });

      rafId = requestAnimationFrame(animate);
    };

    // Event Listener for Navbar Jumps
    const handleWarpJump = (e: Event) => {
      const customEvent = e as CustomEvent;
      const s = stateRef.current;
      
      const dir = customEvent.detail?.direction || 1;
      s.direction = dir;
      
      if (!s.isWarpingRef) {
        s.isWarpingRef = true;
        setIsWarping(true);
      }
      
      // Keep warping active for the duration of the smooth scroll (~800ms)
      if (s.warpTimer) clearTimeout(s.warpTimer);
      s.warpTimer = setTimeout(() => {
        s.isWarpingRef = false;
        setIsWarping(false); 
      }, 700); 
    };

    window.addEventListener("WARP_JUMP", handleWarpJump);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("WARP_JUMP", handleWarpJump);
      cancelAnimationFrame(rafId);
      if (stateRef.current.warpTimer) clearTimeout(stateRef.current.warpTimer);
    };
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[9999999] pointer-events-none transition-opacity ${isWarping ? 'opacity-100 duration-700 ease-in' : 'opacity-0 duration-[1500ms] ease-out'}`}
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
    </div>
  );
}
