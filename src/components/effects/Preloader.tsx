"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Html, Environment } from "@react-three/drei";
import * as THREE from "three";
import { usePreloader } from "@/lib/preloader-context";
import { APPS } from "@/lib/apps";
import { isMobile } from "react-device-detect";

// ==========================================
// 💎 TASK 1 & 2: GLASSY METALLIC PILLARS
// ==========================================

function GlassPillar({ 
  app, 
  index, 
  total, 
  materialRef 
}: { 
  app: any; 
  index: number; 
  total: number; 
  materialRef: any 
}) {
  // TASK 6: SHORTER PILLARS (3.5 -> 2.5)
  // "make it less taller by at least 20px" (approx 0.5 - 1.0 unit relative to previous 3.5)
  const height = 2.5; 
  const width = isMobile ? 0.35 : 0.5;
  const depth = width;
  const gap = 0.15;
  const x = (index - (total - 1) / 2) * (width + gap);

  const Icon = app.icon;

  return (
    <group position={[x, 0, 0]}>
      {/* 🧊 PILLAR GEOMETRY */}
      <RoundedBox args={[width, height, depth]} radius={0.02} smoothness={4}>
         <primitive object={materialRef} attach="material" />
      </RoundedBox>

      {/* 💠 HOLOGRAPHIC CONTENT */}
      <Html 
        transform 
        occlude="blending"
        position={[0, 0, 0]} 
        style={{
          width: '100px',
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.9
        }}
        zIndexRange={[100, 0]}
      >
        {/* TASK 9: ROTATING ICONS */}
        <div className="flex flex-col items-center gap-4 transform scale-[0.4] animate-[spin_6s_linear_infinite] [transform-style:preserve-3d]">
           {/* TASK 5: SMALLER ICON SIZE */}
           <Icon size={32} color={app.hex} strokeWidth={1} /> 
           
           {/* TASK 4: VERTICAL TEXT */}
           {/* TASK 3: STYLISH FONT (Cinematic Spacing + Weight) */}
           <div 
             className="font-space font-light tracking-[0.5em] text-center text-white/90" 
             style={{ 
               fontSize: '8px',
               writingMode: 'vertical-rl', // Vertical writing
               textOrientation: 'upright', // Letters upright
               textShadow: `0 0 15px ${app.hex}`, // Stylish glow
               height: '120px' // Space for vertical text
             }} 
           >
             {app.name.toUpperCase()}
           </div>
        </div>
      </Html>
    </group>
  );
}

function Scene({ onComplete }: { onComplete: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // 🎨 TASK 1 & 2: METALLIC GLASS PAINT
  // Using MeshPhysicalMaterial for true glass/metal hybrid
  const materials = useMemo(() => {
    return APPS.map(app => new THREE.MeshPhysicalMaterial({
      color: app.hex,          // The "Paint" color
      transmission: 0.6,       // Glassy transparency (Hollow look)
      thickness: 0.5,          // Solid glass volume
      roughness: 0.1,          // Smooth polish
      metalness: 0.8,          // Metallic finish
      clearcoat: 1.0,          // Shiny topcoat
      clearcoatRoughness: 0,
      ior: 1.5,
      transparent: true,
      opacity: 1,              // Base opacity
      emissive: app.hex,
      emissiveIntensity: 0.0,  // Controlled by animation
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const speed = 2.5; 
    const activeIndex = Math.floor((time * speed) % APPS.length);

    materials.forEach((mat, i) => {
      const isTarget = i === activeIndex;
      // Pulse the metal sheen
      const targetEmissive = isTarget ? 0.5 : 0.0;
      const targetMetalness = isTarget ? 1.0 : 0.8;
      
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, 0.1);
      mat.metalness = THREE.MathUtils.lerp(mat.metalness, targetMetalness, 0.1);
    });
  });

  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 4500); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <group ref={groupRef}>
      {/* 💡 LIGHTING + ENV FOR GLASS */}
      <Environment preset="city" /> 
      <ambientLight intensity={0.5} />
      <spotLight position={[0, 0, 10]} intensity={2} color="white" />
      
      {APPS.map((app, i) => (
        <GlassPillar 
          key={i} 
          index={i} 
          total={APPS.length} 
          app={app}
          materialRef={materials[i]} 
        />
      ))}
    </group>
  );
}

// ==========================================
// 🚀 EXPORTED COMPONENT
// ==========================================

export function Preloader() {
  const { setComplete, isComplete } = usePreloader();
  const [showCanvas, setShowCanvas] = useState(true);

  if (isComplete) return null;

  const handleComplete = () => {
    setShowCanvas(false);
    setComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030303] flex items-center justify-center">
      {/* 🛡️ HTML FAILSAFE (Prevents black screen if Env fails) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-0 animate-[fadeIn_0.5s_ease-in_2s_forwards]">
          <span className="font-mono text-[9px] text-white/20 tracking-[0.3em]">LOADING_SYSTEM</span>
      </div>

      {showCanvas && (
        <Canvas 
          gl={{ antialias: true, alpha: false }} 
          camera={{ position: [0, 0, 8], fov: 35 }}
        >
          {/* Suspense is needed for Environment, but we render HTML behind it */}
          <React.Suspense fallback={null}>
             <Scene onComplete={handleComplete} />
          </React.Suspense>
        </Canvas>
      )}
    </div>
  );
}
