"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Html, Environment, MeshTransmissionMaterial, MeshReflectorMaterial, Box } from "@react-three/drei";
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
  isActive,   // Animation State
}: { 
  app: any; 
  index: number; 
  total: number;
  width: number;
  height: number;
  gap: number;
  isActive: boolean;
}) {
  const depth = width;
  const x = (index - (total - 1) / 2) * (width + gap); // Auto-center based on index

  const Icon = app.icon;
  // Calculate icon/text scale based on pillar width
  const scale = width * 1.5; 
  
  // 🎬 ANIMATION STATE REFS
  const materialRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (materialRef.current) {
      // Smoothly interp values based on 'isActive' prop
      const targetEmissive = isActive ? 1.5 : 0.0;
      
      // Animate uniform/props if available
      // Let's do a simple direct ref update for performance (avoiding re-render)
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        materialRef.current.emissiveIntensity, 
        targetEmissive, 
        delta * 6 // ⚡ FASTER PULSE (Was 3)
      );
    }
  });

  return (
    <group position={[x, 0, 0]}>
      {/* 🧊 PILLAR GEOMETRY - Enhanced Bevels for Light Catching */}
      <RoundedBox args={[width, height, depth]} radius={0.05} smoothness={8}>
         {/* 💎 ULTRA-REALISTIC GLASS PHYSICS */}
         <MeshTransmissionMaterial 
            ref={materialRef}
            backside={true}
            samples={6}                  // ⚡ PERFORMANCE FIX: Reduced from 16 -> 6
            resolution={512}             // ⚡ PERFORMANCE FIX: Cap resolution
            thickness={0.2}              // Thinner glass = less refraction cost
            chromaticAberration={0.3}    // Reduced for performance
            anisotropy={0.1}             // ⚡ PERFORMANCE FIX: Reduced from 0.5
            distortion={0.0}             // Keep it straight
            distortionScale={0.0}
            temporalDistortion={0.0}
            ior={1.5}                    // Standard Glass
            color={app.hex}              // Base Color
            attenuationColor="#ffffff"   // Volumetric Tint
            attenuationDistance={0.5}
            emissive={app.hex}
            emissiveIntensity={0.0}      // Controlled by Ref
            toneMapped={false}
         />
      </RoundedBox>

      {/* 💠 HOLOGRAPHIC CONTENT */}
      <Html 
        transform 
        position={[0, 0, width/2 + 0.01]} // 📍 FIX: Move slightly in FRONT of glass surface
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
          // 💡 DYNAMIC BRIGHTNESS: when active, boost brightness to punch through glass
          filter: isActive 
            ? `drop-shadow(0 0 20px ${app.hex}) brightness(1.5)` 
            : `drop-shadow(0 0 5px ${app.hex}) brightness(0.8)`,
          transition: 'all 0.2s ease-in-out'
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
  const maxTotalWidth = viewport.width * 0.9;
  const unitSize = maxTotalWidth / APPS.length;
  
  const pillarWidth = Math.min(0.5, unitSize * 0.75); 
  const gap = Math.min(0.15, unitSize * 0.25);
  const pillarHeight = isMobile ? 2.0 : 2.5;

  // 🏃‍♂️ ANIMATION LOOP STATE
  const [activeIndex, setActiveIndex] = useState(0);

  // 🔦 THE TORCH: Dynamic Light Follower
  const lightRef = useRef<THREE.PointLight>(null);
  // Calculate Target X for light
  const targetX = (activeIndex - (APPS.length - 1) / 2) * (pillarWidth + gap);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const speed = 3.0; // 🚀 SUPER FAST (Butter Oily)
    const index = Math.floor((time * speed) % APPS.length);
    if (index !== activeIndex) {
        setActiveIndex(index);
    }
    
    // Animate Torch Position
    if (lightRef.current) {
      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, targetX, delta * 5);
      // Pulse intensity based on beat
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 10 + Math.sin(time * 10) * 5, 0.1);
      lightRef.current.color.set(APPS[activeIndex].hex);
    }
  });

  useEffect(() => {
    // ⚡ FASTER LOADING TIME (Since animation is fast)
    const timer = setTimeout(() => onComplete(), 5500); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <group ref={groupRef}>
      {/* 🏭 STUDIO LIGHTING - Darker Environment for Light Reveal */}
      <Environment preset="night" /> 
      <fog attach="fog" args={['#050505', 5, 20]} /> 

      {/* 🔦 THE TORCH: Paints the room */}
      <pointLight 
        ref={lightRef}
        position={[0, 2, 2]} 
        distance={10} 
        decay={2}
      />
      
      {/* 🔮 THE VAULT: Glass Room */}
      <group position={[0, -pillarHeight/2 - 0.05, 0]}>
         {/* Floor */}
         <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={1024}
              mixBlur={1}
              mixStrength={40}
              roughness={0.5}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#101010"
              metalness={0.5}
              mirror={0} // Disable pure mirror for performance, rely on mixStrength
            />
         </mesh>
      </group>

      {/* 🔦 RIM LIGHTS - Subtle edge catchers */}
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
      {/* 🛡️ FAILSAFE REMOVED */}
      
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
