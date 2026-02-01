"use client";

import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { usePreloader } from "@/lib/preloader-context";
import { APPS } from "@/lib/apps";
import { isMobile } from "react-device-detect";
import { useHandoff } from "@/lib/handoff-context";
import RippleMask from "@/components/effects/RippleMask";
import dynamic from "next/dynamic";

// 🏎️ OPTIMIZATION: Dynamic Import for WebGL Content
// This ensures SSR never touches the heavy 3D logic
const PreloaderScene = dynamic(() => import("@/components/effects/PreloaderScene"), { 
    ssr: false,
    loading: () => null // Optional: Add spinner if needed
});

export function Preloader() {
  const { setComplete, isComplete } = usePreloader();
  const { nextStage } = useHandoff();
  const [showCanvas, setShowCanvas] = useState(true);
  const [activeColor, setActiveColor] = useState(APPS[0].hex);
  const [isExiting, setIsExiting] = useState(false);
  
  // 🛡️ FORCE OPTIMIZATION: Check Screen Width
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    const checkSpec = () => {
        // Force "Mobile Mode" if screen is narrow OR if library says mobile
        const shouldOptimize = window.innerWidth < 1024 || isMobile; 
        setIsOptimized(shouldOptimize);
    };
    
    checkSpec();
    window.addEventListener('resize', checkSpec);
    return () => window.removeEventListener('resize', checkSpec);
  }, []);

  const handleComplete = React.useCallback(() => {
    // 1. Start Fade Out
    setIsExiting(true);
    // 2. Unmount after fade
    setTimeout(() => {
        setShowCanvas(false);
        setComplete();
    }, 1000);
  }, [setComplete]);

  const handleIndexChange = React.useCallback((i: number) => {
      setActiveColor(APPS[i].hex);
  }, []);

  if (isComplete) return null;

  return (
    <>
      <RippleMask />

      {/* 🧠 ARCHITECTURE FIX: SEPARATE LAYERS = 60FPS */}
      
      {/* LAYER 3 (Top): WebGL Scene - UNMASKED 
          The 3D pillars float ABOVE the floor. 
          The browser doesn't have to re-cut them every frame. */}
      {showCanvas && (
        <div className={`fixed inset-0 z-[101] pointer-events-none transition-opacity duration-1000 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
          <Canvas 
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} 
            dpr={[1, 1.5]} 
            camera={{ position: [0, 0, 8], fov: 35 }}
          >
            <React.Suspense fallback={null}>
               <PreloaderScene 
                  onComplete={handleComplete} 
                  onIndexChange={handleIndexChange} 
                  isOptimized={isOptimized} 
               />
            </React.Suspense>
          </Canvas>
        </div>
      )}

      {/* LAYER 2 (Middle): The Floor - MASKED 
          This blocks the website content. 
          Ripples cut holes in THIS layer only. */}
      <div 
        className={`fixed inset-0 z-[100] bg-[#050507] flex items-center justify-center overflow-hidden transition-opacity duration-1000 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
        style={{ 
          maskImage: 'url(#ripple-mask)', 
          WebkitMaskImage: 'url(#ripple-mask)' 
        }}
      > 
        {/* 🌈 AMBIENT GLOW */}
        <div 
          className="absolute inset-0 transition-colors duration-500 ease-linear opacity-20 blur-[100px] scale-[2.0]" 
          style={{
            background: `radial-gradient(circle at center, ${activeColor} 0%, transparent 70%)`,
          }}
        />
      </div>
    </>
  );
}
