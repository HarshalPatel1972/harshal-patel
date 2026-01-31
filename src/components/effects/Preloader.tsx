"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { usePreloader } from "@/lib/preloader-context";
import { APPS } from "@/lib/apps";
import { isMobile } from "react-device-detect";

// ==========================================
// 🛡️ ULTRA SAFE MODE
// ==========================================

function ChasingPillar({ index, total, materialRef }: { index: number, total: number, materialRef: any }) {
  const width = isMobile ? 0.3 : 0.45;
  const height = 6;
  const gap = 0.2;
  const x = (index - (total - 1) / 2) * (width + gap);

  return (
    <group position={[x, 0, 0]}>
      {/* 🟥 PURE GEOMETRY - NO FANCY MATERIALS INITIALIZED HERE */}
      <RoundedBox args={[width, height, width]} radius={0.05} smoothness={4}>
         <primitive object={materialRef} attach="material" />
      </RoundedBox>
    </group>
  );
}

function Scene({ onComplete }: { onComplete: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // 🎨 CREATE MATERIALS ONCE (Standard Material - Bulletproof)
  const materials = useMemo(() => {
    return APPS.map(app => new THREE.MeshStandardMaterial({
      color: "#333", // Dark Grey Base
      emissive: app.hex,
      emissiveIntensity: 0.1, // Start Dim
      roughness: 0.1,
      metalness: 0.8
    }));
  }, []);

  // 🔄 ANIMATION LOOP
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // 1. Chasing Light Logic
    const speed = 5;
    const activeIndex = Math.floor((time * speed) % APPS.length);

    materials.forEach((mat, i) => {
      const isTarget = i === activeIndex;
      // Instant switch: High vs Low
      const targetEmissive = isTarget ? 3.0 : 0.1;
      const targetColor = isTarget ? new THREE.Color("white") : new THREE.Color("#333");
      
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, 0.3);
      mat.color.lerp(targetColor, 0.3);
    });

    // 2. Float
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time) * 0.1;
      groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.05;
    }
  });

  // 🏁 EXIT TIMER
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(); // Just finish. No complex exit animation that might crash.
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={3} />
      <pointLight position={[0, 0, 10]} intensity={5} color="white" />
      {APPS.map((app, i) => (
        <ChasingPillar 
          key={i} 
          index={i} 
          total={APPS.length} 
          materialRef={materials[i]} 
        />
      ))}
    </group>
  );
}

// ==========================================
// 🚀 HYBRID HTML/WEBGL PRELOADER
// ==========================================

export function Preloader() {
  const { setComplete, isComplete } = usePreloader();
  const [showCanvas, setShowCanvas] = useState(true);

  // Failsafe: If WebGL dies, this HTML ensures we see SOMETHING
  if (isComplete) return null;

  const handleComplete = () => {
    setShowCanvas(false);
    setComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center">
      
      {/* 🔴 HTML FAILSAFE LOADER (Always Visible) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="flex flex-col items-center gap-4">
            {/* Pulsing Text */}
            <div className="font-mono text-xs text-white/50 tracking-[0.5em] animate-pulse">
              SYSTEM_INITIALIZING
            </div>
            {/* CSS Progress Bar */}
            <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-1/2 animate-[shimmer_1s_infinite_linear]" />
            </div>
          </div>
      </div>

      {/* 🟦 CANVAS LAYER (Overlays HTML) */}
      {showCanvas && (
        <Canvas 
          gl={{ antialias: true, alpha: true }} // Transparent canvas to see HTML bg
          camera={{ position: [0, 0, 8], fov: 45 }}
          className="z-10" // Canvas on top of text
        >
          {/* NO SUSPENSE - RENDER IMMEDIATELY */}
          <Scene onComplete={handleComplete} />
        </Canvas>
      )}

      {/* DEBUG BUILD TAG IN LOADER */}
      <div className="absolute bottom-10 font-mono text-[9px] text-white/20">
        BUILD_V3 // SAFE_MODE
      </div>
    </div>
  );
}
