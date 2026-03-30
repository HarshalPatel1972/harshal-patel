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
        // Outer glowing aura
        ctx.shadowBlur = 40;
        ctx.shadowColor = "#FFD700";
        ctx.fillStyle = "rgba(255, 215, 0, 0.1)";
        ctx.fillRect(canvas.width / 2 - 50, 0, 100, canvas.height);
        
        // Scorching inner core
        ctx.shadowBlur = 80;
        ctx.shadowColor = "#FFFFFF";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(canvas.width / 2 - 8, 0, 16, canvas.height);
        
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
            if (line.color === '#d91111') strokeColor = '#FFD700'; // Gold
            else if (line.color === '#0ee0c3') strokeColor = '#FFAA00'; // Deep Orange
            else strokeColor = '#FFFDE7'; // Blinding white
        }

        // Speed lines styling
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.isPetrovaMode ? 4.0 : 2.0;    // Astrophage lines are thicker and emit more light
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(renderedX, line.y);
        ctx.lineTo(renderedX, line.y + (movement > 0 ? line.length : -line.length));
        ctx.stroke();
      });
      
      // Hidden UI Elements for the Hail Mary Easter Egg
      if (s.isPetrovaMode) {
         ctx.font = "bold 20px monospace";
         ctx.fillStyle = "rgba(255, 215, 0, 0.8)";
         ctx.textAlign = "center";
         ctx.fillText("[TAU CETI TRAJECTORY ENGAGED]", canvas.width / 2, canvas.height - 110);
         
         ctx.font = "bold 14px monospace";
         ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
         ctx.fillText("ASTROPHAGE SWARM DETECTED ON PETROVA LINE", canvas.width / 2, canvas.height - 80);

         // The unmistakably iconic Rocky (Eridian) reference
         ctx.font = "bold 22px 'Arial', sans-serif"; // Using Arial for music note support
         ctx.fillStyle = "#0ee0c3"; // Cyan for contrast
         ctx.fillText("♫ ♪ ♬ 「 AMAZE! HAPPY HAPPY HAPPY! 」 ♬ ♪ ♫", canvas.width / 2, canvas.height - 40);
      }

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
