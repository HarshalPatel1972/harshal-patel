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
      ctx.fillStyle = s.isPetrovaMode ? "#000000" : "#050505";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.globalCompositeOperation = s.isPetrovaMode ? "screen" : "source-over";

      // Petrova Central Beam Rendering (The Astrophage line to Tau Ceti)
      if (s.isPetrovaMode) {
        // Astrophage swarm mechanics: Hundreds of overlapping, blinding pulses
        
        // Deep Outer glowing aura (Infrared heat bleed)
        ctx.shadowBlur = 60;
        ctx.shadowColor = "#FF3300"; // Deep burning red
        ctx.fillStyle = "rgba(255, 30, 0, 0.05)";
        ctx.fillRect(canvas.width / 2 - 80, 0, 160, canvas.height);

        // Inner golden aura (Astrophage light emission)
        ctx.shadowBlur = 30;
        ctx.shadowColor = "#FFD700";
        ctx.fillStyle = "rgba(255, 215, 0, 0.15)";
        ctx.fillRect(canvas.width / 2 - 30, 0, 60, canvas.height);
        
        // Scorching inner core (Pure light)
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#FFFFFF";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(canvas.width / 2 - 5, 0, 10, canvas.height);
        
        // Minor Astrophage clusters around the main beam
        for(let j=0; j<15; j++) {
           const clusterX = (canvas.width / 2) + ((Math.random() - 0.5) * 120);
           const clusterY = Math.random() * canvas.height;
           ctx.beginPath();
           ctx.arc(clusterX, clusterY, Math.random() * 3 + 1, 0, Math.PI * 2);
           ctx.fillStyle = Math.random() > 0.5 ? '#FFFDE7' : '#FFAA00';
           ctx.fill();
        }

        // Reset Shadow for minor lines
        ctx.shadowBlur = 0;
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

        // Determine color
        let strokeColor = line.color;
        if (s.isPetrovaMode) {
            // Convert to Astrophage intense heat colors
            if (line.color === '#d91111') strokeColor = '#FF3300'; // Deep Heat
            else if (line.color === '#0ee0c3') strokeColor = '#FFD700'; // Pure Gold
            else strokeColor = '#FFFDE7'; // Blinding white
        }

        // Speed lines styling
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.isPetrovaMode ? 6.0 : 2.0;    // Astrophage lines are thick pulses of light
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
        s.isPetrovaMode = Math.random() < 0.90;
        
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
