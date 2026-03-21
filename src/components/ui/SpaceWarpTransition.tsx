"use client";

import { useEffect, useRef, useState } from "react";
import { useFlipTransition } from "@/context/FlipContext";

export function SpaceWarpTransition() {
  const { isActive, redirectUrl, resetTransition } = useFlipTransition();
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
    const numStars = 1000;
    const speed = { val: 0.5 };
    const warpProgress = { val: 0 };

    class Star {
      x: number;
      y: number;
      z: number;
      px: number;
      py: number;
      pz: number;

      constructor() {
        this.px = this.x = Math.random() * w - w / 2;
        this.py = this.y = Math.random() * h - h / 2;
        this.pz = this.z = Math.random() * w;
      }

      update() {
        this.px = this.x;
        this.py = this.y;
        this.pz = this.z;

        // Move closer
        this.z -= speed.val;

        // Reset if passed camera
        if (this.z < 1) {
          this.z = w;
          this.px = this.x = Math.random() * w - w / 2;
          this.py = this.y = Math.random() * h - h / 2;
          this.pz = this.z;
        }
      }

      draw() {
        // Perspective Projection
        const sx = (this.x / this.z) * w + w / 2;
        const sy = (this.y / this.z) * h + h / 2;

        const psx = (this.px / this.pz) * w + w / 2;
        const psy = (this.py / this.pz) * h + h / 2;

        // Brightness based on depth
        const alpha = Math.min(1, 1 - this.z / w);
        
        ctx!.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx!.lineWidth = Math.min(2, 2 * (1 - this.z / w)) * (speed.val / 5);
        ctx!.beginPath();
        ctx!.moveTo(psx, psy);
        ctx!.lineTo(sx, sy);
        ctx!.stroke();
      }
    }

    for (let i = 0; i < numStars; i++) stars.push(new Star());

    const animate = (time: number) => {
      // Clear with trail effect
      ctx.fillStyle = `rgba(0, 0, 0, ${0.1 + (warpProgress.val * 0.4)})`;
      ctx.fillRect(0, 0, w, h);

      // Increase speed over time
      if (warpProgress.val < 1) {
          warpProgress.val += 0.003;
          speed.val = 0.5 + Math.pow(warpProgress.val, 5) * 400; // Exponential surge
      }

      stars.forEach(star => {
        star.update();
        star.draw();
      });

      // Handle redirect at peak speed
      if (warpProgress.val >= 0.99 && !isWarpingOut) {
        setIsWarpingOut(true);
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 300);
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
    <div className="fixed inset-0 z-[1000000] bg-black overflow-hidden pointer-events-auto">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      {/* Radial Bloom Overlay */}
      <div 
        className={`absolute inset-0 bg-white transition-opacity duration-500 pointer-events-none ${isWarpingOut ? 'opacity-100' : 'opacity-0'}`}
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Technical HUD elements for "Pro" feel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className={`border border-white/20 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-1000 ${isActive ? 'scale-[20] opacity-0' : 'scale-1 opacity-100'}`}>
             <div className="w-1 h-1 bg-white rounded-full animate-ping" />
          </div>
      </div>

      <div className="absolute bottom-10 left-10 font-mono text-[10px] text-white/40 tracking-[0.5em] uppercase">
        Engaging_Warp_Drive // Destination: {redirectUrl.split('/').pop() || 'PROJECT'}
      </div>
    </div>
  );
}
