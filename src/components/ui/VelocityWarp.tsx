"use client";

import { useEffect, useRef, useState } from "react";

export function VelocityWarp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isWarping, setIsWarping] = useState(false);
  
  const stateRef = useRef({ 
    direction: 1, 
    isWarpingRef: false,
    isPetrovaMode: false,
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
    let petrovaSwarm: { offsetX: number; y: number; speed: number; radius: number; color: string }[] = [];
    const colors = ['#E8E8E6', '#d91111', '#0ee0c3']; 
    
    // Dynamic Density: Generate lines based on viewport area (Scales perfectly from Mobile to 4K Desktop)
    const generateLines = () => {
      lines = [];
      petrovaSwarm = [];
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

      // Pre-allocate Astrophage Swarm for Zero-Lag (Oily Smooth) running
      const swarmDensity = density * 2.5; 
      for(let i=0; i < swarmDensity; i++) {
          const depth = Math.random(); 
          // 5th power pushes 80% to cluster heavily around the center
          const stretch = Math.pow(depth, 5) * (window.innerWidth / 1.5);
          const directionMap = Math.random() > 0.5 ? 1 : -1;
          
          petrovaSwarm.push({
             offsetX: stretch * directionMap,
             y: Math.random() * window.innerHeight,
             speed: 15 + Math.random() * 30, // Faster than normal lines
             radius: 0.5 + Math.random() * 2.5,
             color: Math.random() > 0.7 ? '#FFFDE7' : (Math.random() > 0.4 ? '#FFD700' : '#FF3300')
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
      ctx.fillStyle = s.isPetrovaMode ? "#000000" : "#050505";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Petrova Central Beam Rendering (The Astrophage line to Tau Ceti)
      if (s.isPetrovaMode) {
        // Render pre-calculated Swarm particles (Oily smooth, no Math.random at runtime)
        // This is purely the tiny glowing Astrophage microorganisms traveling down the line
        const centerX = canvas.width / 2;
        
        petrovaSwarm.forEach(p => {
           const movement = -s.direction * p.speed;
           p.y += movement;
           if (p.y < -50) p.y = canvas.height + 50;
           if (p.y > canvas.height + 50) p.y = -50;

           ctx.beginPath();
           ctx.arc(centerX + p.offsetX, p.y, p.radius, 0, Math.PI * 2);
           ctx.fillStyle = p.color;
           ctx.fill();
        });
      }

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

        // Speed lines styling (Standard Brutalist Colors retained)
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 2.0;
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
        // High visibility for active testing Phase
        s.isPetrovaMode = Math.random() < 0.05;
        
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
