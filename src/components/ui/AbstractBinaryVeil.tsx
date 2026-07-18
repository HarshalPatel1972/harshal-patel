import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const AbstractBinaryVeil: React.FC = () => {
  const { language } = useLanguage();
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
    
    const isEridian = language === 'eridian';
    
    // Characters to use (Binary + Hex snippets)
    const chars = isEridian ? "♩♫♫♩" : "01ABCDEF";
    const specialStrings = isEridian 
      ? ["AMAZE!", "ROCKY", "HUMAN", "SIGNAL", "SPACE"] 
      : ["0xDEBT", "0xNULL", "0xCORE", "0xINIT", "0xVOID"];

    let animId: number;
    let isInView = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        if (isInView) {
          animId = requestAnimationFrame(draw);
        } else {
          cancelAnimationFrame(animId);
        }
      },
      { threshold: 0.01 }
    );

    const draw = () => {
      if (!isInView) return;

      // Semi-transparent black background to create trail effect
      ctx.fillStyle = 'rgba(5, 5, 5, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const centerX = canvas.width / 2;
        const distFromCenter = Math.abs(x - centerX);
        const inCenter = distFromCenter < 180;

        let text = chars[Math.floor(Math.random() * chars.length)];
        if (Math.random() > 0.98) {
          text = specialStrings[Math.floor(Math.random() * specialStrings.length)];
        }

        if (inCenter) {
          ctx.fillStyle = '#E8E8E6';
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(232, 232, 230, 0.5)';
        } else {
          const flick = Math.random() > 0.1 
            ? 'var(--accent-blood)' 
            : (isEridian ? '#0033aa' : '#4a0000');
          ctx.fillStyle = flick;
          ctx.shadowBlur = isEridian ? 4 : 0;
          ctx.shadowColor = isEridian ? 'rgba(0, 85, 255, 0.3)' : 'transparent';
        }

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        const speed = inCenter ? 0.35 : 0.65;
        drops[i] += speed;
      }

      animId = requestAnimationFrame(draw);
    };

    observer.observe(canvas);
    animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      observer.disconnect();
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
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] opacity-80" />
      
      {/* Central Purification Beam Highlight */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[400px] bg-white/[0.02] blur-[100px]" />
    </div>
  );
};

export default AbstractBinaryVeil;
