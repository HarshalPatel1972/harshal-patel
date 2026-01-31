"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Html } from "@react-three/drei";
import * as THREE from "three";
import { usePreloader } from "@/lib/preloader-context";
import { APPS } from "@/lib/apps";
import { isMobile } from "react-device-detect";

// ==========================================
// 🛡️ REFINED GLASS MONOLITHS (SAFE)
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
  // Shorter, Taller, Slimmer as requested
  // "make it less taller" -> Height 3.5 (was 6)
  const width = isMobile ? 0.35 : 0.5;
  const height = 3.5; 
  const depth = width;
  const gap = 0.15;
  const x = (index - (total - 1) / 2) * (width + gap);

  const Icon = app.icon;

  return (
    <group position={[x, 0, 0]}>
      {/* 🧊 THE GLASS PILLAR */}
      <RoundedBox args={[width, height, depth]} radius={0.02} smoothness={4}>
         <primitive object={materialRef} attach="material" />
      </RoundedBox>

      {/* 💠 HOLOGRAPHIC CONTENT (Inside the Glass) */}
      <Html 
        transform 
        occlude="blending" // Occlude behind other objects
        position={[0, 0, 0]} // Dead center
        style={{
          width: '100px',
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.8 // Slightly transparent internal hologram
        }}
      >
        <div className="flex flex-col items-center gap-4 transform scale-[0.4]">
           {/* ICON */}
           <Icon size={64} color={app.hex} strokeWidth={1.5} />
           
           {/* NAME */}
           <span 
             className="font-space font-bold tracking-widest text-center text-white" 
             style={{ fontSize: '10px' }} // Tiny tech text
           >
             {app.name.toUpperCase()}
           </span>
        </div>
      </Html>
    </group>
  );
}

function Scene({ onComplete }: { onComplete: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // 🎨 COLORLESS GLASS MATERIALS
  const materials = useMemo(() => {
    return APPS.map(app => new THREE.MeshStandardMaterial({
      color: "#ffffff", // Colorless base
      transparent: true,
      opacity: 0.15, // Very transparent (Glass look)
      roughness: 0.05, // Smooth
      metalness: 0.9, // Reflective/Shiny
      emissive: app.hex,
      emissiveIntensity: 0.0, // Start OFF
    }));
  }, []);

  // 🔄 LOOP
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Slower Speed as requested
    const speed = 2.5; 
    const activeIndex = Math.floor((time * speed) % APPS.length);

    materials.forEach((mat, i) => {
      const isTarget = i === activeIndex;
      
      // Target: Light up slightly with color
      // Others: Fade to colorless glass
      const targetEmissive = isTarget ? 1.5 : 0.0;
      const targetOpacity = isTarget ? 0.3 : 0.15; // Pulse opacity slightly
      
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, 0.1);
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
    });
    
    // "not move up and down" -> REMOVED POSITION Y UPDATE
  });

  // 🏁 EXIT
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4500); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <group ref={groupRef}>
      {/* 💡 LIGHTING (Crucial for glass look) */}
      <ambientLight intensity={1} />
      {/* Backlight to show transparency */}
      <spotLight position={[0, 0, -5]} intensity={5} color="cyan" angle={1} /> 
      {/* Front reflection */}
      <spotLight position={[0, 5, 5]} intensity={3} color="white" angle={0.5} /> 

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
      
      {/* 🔴 CLEAN - NO TEXT. JUST CANVAS */}
      
      {showCanvas && (
        <Canvas 
          gl={{ antialias: true, alpha: false }} 
          camera={{ position: [0, 0, 8], fov: 35 }}
        >
          <Scene onComplete={handleComplete} />
        </Canvas>
      )}
    </div>
  );
}
