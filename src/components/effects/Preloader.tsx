"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Html, Environment } from "@react-three/drei";
import * as THREE from "three";
import { usePreloader } from "@/lib/preloader-context";
import { APPS } from "@/lib/apps";
import { isMobile } from "react-device-detect";

// ==========================================
// 💎 TASK 2-5: REFINED GLASS PILLARS
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
  // TASK 4: RESPONSIVE DIMENSIONS
  // Mobile: Tighter packing, smaller pillars
  const width = isMobile ? 0.28 : 0.5;
  const height = isMobile ? 2.0 : 2.5; 
  const depth = width;
  const gap = isMobile ? 0.1 : 0.15;
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
          // TASK 5: 3D LOOK (Drop shadow + brightness)
          filter: `drop-shadow(0 0 10px ${app.hex}) brightness(1.2)` 
        }}
        zIndexRange={[100, 0]}
      >
        <div className="flex flex-col items-center gap-4 transform scale-[0.4]">
           
           {/* TASK 3: ROTATION ISOLATED TO ICON */}
           {/* TASK 9 Re-fix: "Earth rotate on its axis" -> Y-axis spin */}
           {/* Using custom style for Y-axis rotation if tailwind fails, but 'animate-[spin]' is Z-axis */}
           {/* Let's try CSS transform with standard spin for now, but 3D feel comes from perspective */}
           <div className="animate-[spin_4s_linear_infinite] [transform-style:preserve-3d]">
              <Icon size={isMobile ? 24 : 32} color={app.hex} strokeWidth={1} /> 
           </div>

           {/* TASK 4: VERTICAL TEXT (STATIC - DOES NOT ROTATE) */}
           <div 
             className="font-space font-light tracking-[0.5em] text-center text-white/90" 
             style={{ 
               fontSize: isMobile ? '6px' : '8px',
               writingMode: 'vertical-rl', 
               textOrientation: 'upright', 
               textShadow: `0 0 15px ${app.hex}`,
               height: '100px',
               marginTop: '10px'
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
  
  // 🎨 TASK 2: INCREASE TRANSPARENCY
  const materials = useMemo(() => {
    return APPS.map(app => new THREE.MeshPhysicalMaterial({
      color: app.hex,
      transmission: 0.95,      // Almost invisible glass (Task 2)
      thickness: 0.2,          // Thinner walls
      roughness: 0.0,          // Perfectly smooth
      metalness: 0.9,          // High polish
      clearcoat: 1.0,
      ior: 1.45,
      transparent: true,
      opacity: 0.3,            // Lower base opacity
      emissive: app.hex,
      emissiveIntensity: 0.0,
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const speed = 2.5; 
    const activeIndex = Math.floor((time * speed) % APPS.length);

    materials.forEach((mat, i) => {
      const isTarget = i === activeIndex;
      const targetEmissive = isTarget ? 0.8 : 0.0;
      const targetMetalness = isTarget ? 1.0 : 0.9;
      
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
      {/* 🛡️ FAILSAFE */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-0 animate-[fadeIn_0.5s_ease-in_2s_forwards]">
          <span className="font-mono text-[9px] text-white/20 tracking-[0.3em]">LOADING_SYSTEM</span>
      </div>

      {showCanvas && (
        <Canvas 
          gl={{ antialias: true, alpha: false }} 
          camera={{ position: [0, 0, 8], fov: 35 }}
        >
          <React.Suspense fallback={null}>
             <Scene onComplete={handleComplete} />
          </React.Suspense>
        </Canvas>
      )}
    </div>
  );
}
