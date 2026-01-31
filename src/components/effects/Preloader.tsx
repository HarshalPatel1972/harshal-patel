"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Html, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { usePreloader } from "@/lib/preloader-context";
import { APPS } from "@/lib/apps";
import { isMobile } from "react-device-detect";

// ==========================================
// 💎 TASK 2-5: DYNAMIC VIEWPORT SCALED PILLARS
// ==========================================

function GlassPillar({ 
  app, 
  index, 
  total, 
  width,     // Dynamic width
  height,    // Dynamic height
  gap,       // Dynamic gap
  materialRef 
}: { 
  app: any; 
  index: number; 
  total: number;
  width: number;
  height: number;
  gap: number;
  materialRef: any 
}) {
  const depth = width;
  const x = (index - (total - 1) / 2) * (width + gap);

  const Icon = app.icon;
  // Calculate icon/text scale based on pillar width
  const scale = width * 1.5; 

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
          filter: `drop-shadow(0 0 10px ${app.hex}) brightness(1.5)` 
        }}
        zIndexRange={[100, 0]}
        scale={scale} // Scale content with pillar size
      >
        <div className="flex flex-col items-center gap-4 transform scale-[0.4]">
           
           <div className="animate-spinY [transform-style:preserve-3d]">
              <Icon size={32} color={app.hex} strokeWidth={1} /> 
           </div>

           <div 
             className="font-space font-light tracking-[0.5em] text-center text-white/90" 
             style={{ 
               fontSize: '8px',
               writingMode: 'vertical-rl', 
               textOrientation: 'upright', 
               textShadow: `0 0 20px ${app.hex}`,
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
  const { viewport } = useThree();


  // 📏 PHASE 4: MATH-BASED RESPONSIVENESS
  // Calculate pillar dimensions to ALWAYS fit within 90% of screen width
  const maxTotalWidth = viewport.width * 0.9;
  const unitSize = maxTotalWidth / APPS.length;
  
  // Constrain maximums so they don't get huge on ultra-wides
  const pillarWidth = Math.min(0.5, unitSize * 0.75); 
  const gap = Math.min(0.15, unitSize * 0.25);

  const pillarHeight = isMobile ? 2.0 : 2.5;

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
      toneMapped: false        // IMPORTANT for Bloom to work
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const speed = 0.8; // 🐢 SLOWER SPEED (Was 2.5) -> ~3x slower scan
    const activeIndex = Math.floor((time * speed) % APPS.length);

    materials.forEach((mat, i) => {
      const isTarget = i === activeIndex;
      // 🌟 GLOW EFFECT INCREASED
      const targetEmissive = isTarget ? 3.0 : 0.0; // Was 0.8, now 3.0 for BLOOM
      const targetMetalness = isTarget ? 1.0 : 0.9;
      
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, 0.1);
      mat.metalness = THREE.MathUtils.lerp(mat.metalness, targetMetalness, 0.1);
    });
  });

  useEffect(() => {
    // 🐢 SLOWER LOADING TIME
    const timer = setTimeout(() => onComplete(), 7000); // Was 4500ms -> 7000ms (~1.5x slower total)
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <group ref={groupRef}>
      <Environment preset="city" /> 
      <ambientLight intensity={0.5} />
      <spotLight position={[0, 0, 10]} intensity={2} color="white" />
      
      {/* ✨ POST PROCESSING BLOOM */}
      <EffectComposer>
        <Bloom 
           luminanceThreshold={1.0} 
           mipmapBlur 
           intensity={1.5} 
           radius={0.4}
        />
      </EffectComposer>
      
      {APPS.map((app, i) => (
        <GlassPillar 
          key={i} 
          index={i} 
          total={APPS.length} 
          width={pillarWidth}
          height={pillarHeight}
          gap={gap}
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
