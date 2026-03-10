"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface InkSunderProps {
  children: React.ReactNode;
  onProgress?: (progress: number) => void;
  className?: string;
  isRevealing: boolean;
}

export const InkSunder: React.FC<InkSunderProps> = ({ children, onProgress, className = "", isRevealing }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Fill with "The Void"
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add heavy film grain to the cover
      for (let i = 0; i < 50000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const alpha = Math.random() * 0.05;
        ctx.fillStyle = `rgba(232, 232, 230, ${alpha})`;
        ctx.fillRect(x, y, 1, 1);
      }

      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      contextRef.current = ctx;
    };

    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, []);

  const drawSunder = useCallback((x: number, y: number, isStarting: boolean) => {
    const ctx = contextRef.current;
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    
    // MAPPA STYLE BRUSH: Jagged, fluctuating, ink-droplets
    const brushSize = 40 + Math.random() * 80;
    ctx.lineWidth = brushSize;
    
    if (isStarting) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();

      // Drop some "ink splatter" shards
      if (Math.random() > 0.7) {
        const shardSize = Math.random() * 30;
        ctx.beginPath();
        ctx.arc(x + (Math.random() - 0.5) * 100, y + (Math.random() - 0.5) * 100, shardSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isRevealing) return;
    setIsDrawing(true);
    setHasStarted(true);
    drawSunder(e.clientX, e.clientY, true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing) {
      drawSunder(e.clientX, e.clientY, false);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isRevealing) return;
    setIsDrawing(true);
    setHasStarted(true);
    const touch = e.touches[0];
    drawSunder(touch.clientX, touch.clientY, true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDrawing) {
      const touch = e.touches[0];
      drawSunder(touch.clientX, touch.clientY, false);
    }
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden ${className}`}>
      {/* BACKGROUND LAYER: The Secret Narrative */}
      <div className="absolute inset-0 z-0 flex items-center justify-center p-8 md:p-32">
        {children}
      </div>

      {/* FOREGROUND LAYER: The Canvas Sunder Overlay */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className={`absolute inset-0 z-30 w-full h-full cursor-none transition-opacity duration-1000 ${isRevealing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* CUSTOM CURSOR: The "Exorcism" Tool */}
      {isRevealing && (
        <SunderCursor isDrawing={isDrawing} />
      )}
    </div>
  );
};

const SunderCursor = ({ isDrawing }: { isDrawing: boolean }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div 
      className="fixed pointer-events-none z-[100] transition-transform duration-75 mix-blend-difference"
      style={{ 
        left: pos.x, 
        top: pos.y, 
        transform: `translate(-50%, -50%) scale(${isDrawing ? 1.5 : 1})` 
      }}
    >
      {/* The Brush Tip */}
      <div className="w-4 h-4 bg-[var(--accent-blood)] rotate-45 border border-white/20" />
      
      {/* Cursed Energy Aura */}
      <div className={`absolute inset-0 bg-[var(--accent-blood)] blur-xl opacity-40 transition-opacity ${isDrawing ? 'opacity-80' : 'opacity-20'}`} />
      
      {/* Crosshair Lines */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-[1px] bg-white/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-12 bg-white/20" />
    </div>
  );
};


