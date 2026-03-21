"use client";

import { useEffect, useRef, useState } from "react";
import { useFlipTransition } from "@/context/FlipContext";

export function SpaceWarpTransition() {
  const { isActive, redirectUrl } = useFlipTransition();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Timing state
  const startTimeRef = useRef<number | null>(null);
  const DURATION = 3200; // Strictly 3.2 seconds

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const stars: Star[] = [];
    const numStars = 600;
    
    const palette = ["#D91111", "#11D9D9", "#FAF9F6", "#ffffff"];

    class Star {
      x: number; y: number; z: number;
      px: number; py: number; pz: number;
      color: string;

      constructor() {
        this.px = this.x = Math.random() * w - w / 2;
        this.py = this.y = Math.random() * h - h / 2;
        this.pz = this.z = Math.random() * w;
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }

      update(speed: number) {
        this.px = this.x; this.py = this.y; this.pz = this.z;
        this.z -= speed;

        if (this.z < 1) {
          this.z = w;
          this.px = this.x = Math.random() * w - w / 2;
          this.py = this.y = Math.random() * h - h / 2;
          this.pz = this.z;
        }
      }

      draw(progress: number) {
        const sx = (this.x / this.z) * w + w / 2;
        const sy = (this.y / this.z) * h + h / 2;
        const psx = (this.px / this.pz) * w + w / 2;
        const psy = (this.py / this.pz) * h + h / 2;

        const alpha = Math.min(1, 1 - this.z / w);
        ctx!.strokeStyle = this.color;
        // Fade in alpha over initial progress
        ctx!.globalAlpha = alpha * Math.min(1, progress * 4);
        ctx!.lineWidth = 1;
        
        ctx!.beginPath();
        ctx!.moveTo(psx, psy);
        ctx!.lineTo(sx, sy);
        ctx!.stroke();
      }
    }

    for (let i = 0; i < numStars; i++) stars.push(new Star());

    const animate = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const progress = Math.min(1, elapsed / DURATION);

      // Black clear with slight trail
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgba(10, 10, 10, ${0.15 + (progress * 0.1)})`;
      ctx.fillRect(0, 0, w, h);

      // Velocity curve: 2.5s strictly
      const speed = 2.0 + Math.pow(progress, 5) * 150;

      stars.forEach(star => {
        star.update(speed);
        star.draw(progress);
      });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // EXACTLY AT 2.5s -> Jump
        window.location.href = redirectUrl;
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      startTimeRef.current = null;
    };
  }, [isActive, redirectUrl]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[1000000] bg-[#0A0A0A] overflow-hidden pointer-events-none flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* Central Shine core */}
      <div 
        className={`absolute w-[45vw] h-[45vw] bg-white rounded-full blur-[140px] pointer-events-none mix-blend-screen opacity-10 transition-transform duration-[3.2s] ${isActive ? 'scale-[2.5]' : 'scale-0'}`} 
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-60 pointer-events-none" />
    </div>
  );
}
