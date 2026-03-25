import React, { useEffect, useRef } from 'react';

const AbstractBinaryVeil: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -100);
    
    // Characters to use (Binary + Hex snippets)
    const chars = "01ABCDEF";
    const specialStrings = ["0xDEBT", "0xNULL", "0xCORE", "0xINIT", "0xVOID"];

    const draw = () => {
      // Semi-transparent black background to create trail effect
      ctx.fillStyle = 'rgba(5, 5, 5, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Determination of "Purification Zone" (Center of screen)
        const centerX = canvas.width / 2;
        const distFromCenter = Math.abs(x - centerX);
        const inCenter = distFromCenter < 180; // The threshold for the purified zone

        // Selection of char/string
        let text = chars[Math.floor(Math.random() * chars.length)];
        if (Math.random() > 0.98) {
          text = specialStrings[Math.floor(Math.random() * specialStrings.length)];
        }

        // Color Logic
        if (inCenter) {
          // Purified Zone: Stable White/Bone with Glow
          ctx.fillStyle = '#E8E8E6';
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(232, 232, 230, 0.5)';
        } else {
          // Debt/Chaos Zone: Flickering Blood Red
          const flick = Math.random() > 0.1 ? 'var(--accent-blood)' : '#4a0000';
          ctx.fillStyle = flick;
          ctx.shadowBlur = 0;
        }

        ctx.fillText(text, x, y);

        // Reset to top when off screen or randomly
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Falling speed depends on depth/zone
        const speed = inCenter ? 0.35 : 0.65;
        drops[i] += speed;
      }

      requestAnimationFrame(draw);
    };

    const animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      {/* Brutalist Gradient Overlay to fade the top/bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)] via-transparent to-[var(--color-bg)] opacity-80" />
      
      {/* Central Purification Beam Highlight */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[400px] bg-white/[0.02] blur-[100px]" />
    </div>
  );
};

export default AbstractBinaryVeil;
