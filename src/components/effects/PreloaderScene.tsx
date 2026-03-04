"use client";

import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Html, Environment, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { APPS } from "@/lib/apps";
import { isMobile } from "react-device-detect";
import { useHandoff } from "@/lib/handoff-context";

// ==========================================
// 💎 ISOLATED WEBGL SCENE
// Localized re-renders and logic
// ==========================================

function GlassPillar({ 
  app, 
  index, 
  total, 
  width,     // Dynamic width
  height,    // Dynamic height
  gap,       // Dynamic gap
  isActive,  // Animation State
  visible,   // 🙈 Handoff Visibility
  isOptimized // ⚡ Forced Optimization Flag
}: { 
  app: any; 
  index: number; 
  total: number;
  width: number;
  height: number;
  gap: number;
  isActive: boolean;
  visible: boolean;
  isOptimized: boolean;
}) {
  const depth = width;
  const x = (index - (total - 1) / 2) * (width + gap); // Auto-center based on index

  const Icon = app.icon;
  // Calculate icon/text scale based on pillar width AND height (to prevent overflow)
  const scale = Math.min(width * 1.5, height * 0.45); 
  
    // 🎬 ANIMATION STATE REFS
    const materialRef = useRef<any>(null);
  
    useFrame((state, delta) => {
      if (materialRef.current) {
        const targetEmissive = isActive ? 3.0 : 0.0;
        materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
          materialRef.current.emissiveIntensity, 
          targetEmissive, 
          delta * 6
        );
      }
    });
  
    const targetScale = visible ? 1 : 0;
    const currentScale = useRef(1);
    
    useFrame((state, delta) => {
      // ⚡ FASTER SHRINK (15 instead of 5)
      currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, delta * 15);
    });
  
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state, delta) => {
        if(groupRef.current) {
            const s = currentScale.current;
            groupRef.current.scale.set(s,s,s);
            // If scale is practically 0, set visible to false as optimization
            if (s < 0.01) groupRef.current.visible = false;
            else groupRef.current.visible = true;
        }
    });


  return (
    <group ref={groupRef} position={[x, 0, 0]}>
      {/* 🧊 PILLAR GEOMETRY - Optimized Smoothness */}
      <RoundedBox args={[width, height, depth]} radius={0.05} smoothness={2}>
         {/* 💎 ULTRA-REALISTIC GLASS PHYSICS */}
         {isOptimized ? (
           // 📱 MOBILE: Simple Transparent (No Transmission)
           <meshPhysicalMaterial 
              ref={materialRef}
              color={app.hex}
              transparent
              opacity={0.3} 
              roughness={0.2}
              metalness={0.8}
              emissive={app.hex}
              emissiveIntensity={0.0} 
           />
         ) : (
           // 🖥️ DESKTOP: Native PBR Transmission (Fast & Beautiful)
           // Replaces the heavy MeshTransmissionMaterial (which forced 7x render passes)
           <meshPhysicalMaterial 
              ref={materialRef}
              transmission={1.0}  // 💎 Real PBR Glass
              thickness={1.5}     // Volume
              roughness={0.15}    // Frosted hint
              ior={1.45}          // Glass Index
              clearcoat={1.0}     // Polish
              clearcoatRoughness={0.0}
              color={app.hex}
              transparent={false} // Transmission material handles transparency internally
              emissive={app.hex}
              emissiveIntensity={0.0}
              attenuationColor={app.hex} // Internal glass color
              attenuationDistance={2.0}
           />
         )}

      </RoundedBox>

      {/* 💠 HOLOGRAPHIC CONTENT */}
      <Html 
        transform 
        position={[0, 0, width/2 + 0.01]} 
        style={{
          width: '100px',
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          filter: isActive 
            ? `drop-shadow(0 0 20px ${app.hex}) brightness(1.5)` 
            : `drop-shadow(0 0 5px ${app.hex}) brightness(0.8)`,
          transition: 'all 0.2s ease-in-out'
        }}
        zIndexRange={[100, 0]}
        scale={scale} 
      >
        <div className="flex flex-col items-center gap-4 transform scale-[0.4]">
           
           <div className="animate-spinY [transform-style:preserve-3d]">
              <Icon size={32} color={app.hex} strokeWidth={1} /> 
           </div>

           <div 
             className="font-space font-light tracking-[0.5em] text-center text-white/90" 
             style={{ 
               fontSize: isOptimized ? '12px' : '10px', 
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

export default function PreloaderScene({ 
    onComplete, 
    onIndexChange, 
    isOptimized 
}: { 
    onComplete: () => void, 
    onIndexChange: (index: number) => void, 
    isOptimized: boolean 
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // 📏 PHASE 4: MATH-BASED RESPONSIVENESS
  const maxTotalWidth = viewport.width * 0.9;
  const unitSize = maxTotalWidth / APPS.length;
  
  const pillarWidth = Math.min(0.5, unitSize * 0.75); 
  const gap = Math.min(0.15, unitSize * 0.25);
  // 📐 FIX: Height based on viewport
  const maxH = isOptimized ? 1.8 : 2.5;
  const pillarHeight = Math.min(maxH, viewport.height * 0.5);

  const [activeIndex, setActiveIndex] = useState(0);

  // 🔀 MASTER SEQUENCER
  const { stage, nextStage } = useHandoff();

  useEffect(() => {
    let step = 0;
    const totalSteps = APPS.length * 2; 
    const tempo = 600; 

    const interval = setInterval(() => {
      const cycle = Math.floor(step / APPS.length) + 1; 
      const index = step % APPS.length; 

      setActiveIndex(index);
      onIndexChange(index);

      if (cycle === 2) {
        nextStage();
      }

      if (step >= totalSteps - 1) {
        clearInterval(interval);
        setTimeout(onComplete, 1500); 
      }

      step++;
    }, tempo);

    return () => clearInterval(interval);
  }, [onComplete, nextStage, onIndexChange]);

  return (
    <group ref={groupRef}>
      {/* 🏭 STUDIO LIGHTING */}
      <Environment preset="city" /> 
      <ambientLight intensity={0.5} />
      
      {/* 🔦 RIM LIGHTS */}
      <spotLight position={[10, 10, 10]} intensity={1} color="white" angle={0.5} penumbra={1} />
      <spotLight position={[-10, 10, -10]} intensity={1} color="#c0efff" angle={0.5} penumbra={1} />
      
      {APPS.map((app, i) => (
        <GlassPillar 
          key={i} 
          index={i} 
          total={APPS.length} 
          width={pillarWidth}
          height={pillarHeight}
          gap={gap}
          app={app}
          isActive={i === activeIndex}
          visible={stage === 0 || i >= stage}
          isOptimized={isOptimized} 
        />
      ))}
    </group>
  );
}
