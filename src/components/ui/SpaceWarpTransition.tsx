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
    const speed = { val: 2.0 }; // Faster initial speed
    const warpProgress = { val: 0.1 }; // Start already moving

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
        
        // Slight tinting
        const tints = ["#ffffff", "#e0f2fe", "#f0f9ff"];
        this.color = tints[Math.floor(Math.random() * tints.length)];
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
        ctx!.globalAlpha = alpha * Math.min(1, warpProgress.val * 2);
        
        // Width increases with speed
        ctx!.lineWidth = (1 + speed.val / 20) * (1 - this.z / w);
        
        ctx!.beginPath();
        ctx!.moveTo(psx, psy);
        ctx!.lineTo(sx, sy);
        ctx!.stroke();
      }
    }

    for (let i = 0; i < numStars; i++) stars.push(new Star());

    const animate = () => {
      // Darker clear with heavy motion trail
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, w, h);

      // Rapid acceleration (shorter duration feel)
      if (warpProgress.val < 1.5) {
          warpProgress.val += 0.02; 
          speed.val = 2.0 + Math.pow(warpProgress.val, 4) * 180;
      }

      stars.forEach(star => {
        star.update();
        star.draw();
      });

      // Redirect peak
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
    <div className="fixed inset-0 z-[1000000] bg-black overflow-hidden pointer-events-auto flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* Central Glow Core */}
      <div 
        className={`absolute w-[60vw] h-[60vw] bg-white rounded-full blur-[100px] transition-all duration-700 pointer-events-none mix-blend-screen opacity-10 ${isActive ? 'scale-150' : 'scale-0'}`} 
      />

      {/* Screen White-Out Flash */}
      <div 
        className={`fixed inset-0 bg-white transition-opacity duration-400 pointer-events-none ${isWarpingOut ? 'opacity-100' : 'opacity-0'}`}
        style={{ mixBlendMode: 'screen', zIndex: 1000001 }}
      />

      {/* Extreme Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-80 pointer-events-none" />
    </div>
  );
}
