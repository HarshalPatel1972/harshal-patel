"use client";

import { useEffect, useRef, useState } from "react";
import { useFlipTransition } from "@/context/FlipContext";

export function SpaceWarpTransition() {
  const { isActive, redirectUrl } = useFlipTransition();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isWarpingOut, setIsWarpingOut] = useState(false);

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
    const speed = { val: 2.5 }; 
    const warpProgress = { val: 0.1 }; 

    // PALETTE: Blood Red, Cursed Cyan, Bone White, Pure White Flash
    const palette = ["#D91111", "#11D9D9", "#FAF9F6", "#ffffff"];

    class Star {
      x: number;
      y: number;
      z: number;
      px: number;
      py: number;
      pz: number;
      color: string;

      constructor() {
        this.px = this.x = Math.random() * w - w / 2;
        this.py = this.y = Math.random() * h - h / 2;
        this.pz = this.z = Math.random() * w;
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }

      update() {
        this.px = this.x;
        this.py = this.y;
        this.pz = this.z;

        this.z -= speed.val;

        if (this.z < 1) {
          this.z = w;
          this.px = this.x = Math.random() * w - w / 2;
          this.py = this.y = Math.random() * h - h / 2;
          this.pz = this.z;
        }
      }

      draw() {
        const sx = (this.x / this.z) * w + w / 2;
        const sy = (this.y / this.z) * h + h / 2;

        const psx = (this.px / this.pz) * w + w / 2;
        const psy = (this.py / this.pz) * h + h / 2;

        const alpha = Math.min(1, 1 - this.z / w);
        ctx!.strokeStyle = this.color;
        ctx!.globalAlpha = alpha * Math.min(1, warpProgress.val * 3);
        
        // NO THICKNESS INCREASE: Constant 1px for clean streaks
        ctx!.lineWidth = 1;
        
        ctx!.beginPath();
        ctx!.moveTo(psx, psy);
        ctx!.lineTo(sx, sy);
        ctx!.stroke();
      }
    }

    for (let i = 0; i < numStars; i++) stars.push(new Star());

    const animate = () => {
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(10, 10, 10, 0.2)"; // Ink background with slight trail
      ctx.fillRect(0, 0, w, h);

      // Controlled acceleration (Slower surge)
      if (warpProgress.val < 1.6) {
          warpProgress.val += 0.012; 
          speed.val = 2.5 + Math.pow(warpProgress.val, 4) * 120;
      }

      stars.forEach(star => {
        star.update();
        star.draw();
      });

      // Jump peak
      if (warpProgress.val >= 1.2 && !isWarpingOut) {
        setIsWarpingOut(true);
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 350);
      }

      animationFrameId = requestAnimationFrame(animate);
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
    };
  }, [isActive, redirectUrl, isWarpingOut]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[1000000] bg-[#0A0A0A] overflow-hidden pointer-events-auto flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* Subtle chromatic center glow */}
      <div 
        className={`absolute w-[40vw] h-[40vw] bg-white rounded-full blur-[100px] transition-all duration-1000 pointer-events-none mix-blend-screen opacity-10 ${isActive ? 'scale-150' : 'scale-0'}`} 
      />

      {/* Radial Flash-bang Bloom */}
      <div 
        className={`fixed inset-0 bg-white transition-opacity duration-400 pointer-events-none ${isWarpingOut ? 'opacity-100' : 'opacity-0'}`}
        style={{ mixBlendMode: 'screen', zIndex: 1000001 }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-80 pointer-events-none" />
    </div>
  );
}
