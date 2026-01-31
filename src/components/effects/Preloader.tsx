"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Html, Environment, MeshTransmissionMaterial } from "@react-three/drei";
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
      const targetEmissive = isActive ? 3.0 : 0.0; // 🤘 FIX: Hotter Metallic Glow (Was 1.5)
      
      // Animate uniform/props if available
      // Let's do a simple direct ref update for performance (avoiding re-render)
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        materialRef.current.emissiveIntensity, 
        targetEmissive, 
        delta * 6 // ⚡ FASTER PULSE
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
            attenuationColor={app.hex}   // 🌈 FIX: Match Color Core (No white sun)
            attenuationDistance={1.0}    // Smooth attenuation
            roughness={0.1}              // 🌫️ FIX: Slight diffusion to kill sharp sun glare
            metalness={0.5}              // 🤘 FIX: Metallic Glow (Polished look)
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
               fontSize: isMobile ? '12px' : '10px', // 📱 FIX: Larger font on mobile for readability
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

function Scene({ onComplete, onIndexChange }: { onComplete: () => void, onIndexChange: (index: number) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();


  // 📏 PHASE 4: MATH-BASED RESPONSIVENESS
  const maxTotalWidth = viewport.width * 0.9;
  const unitSize = maxTotalWidth / APPS.length;
  
  const pillarWidth = Math.min(0.5, unitSize * 0.75); 
  const gap = Math.min(0.15, unitSize * 0.25);
  // 📐 FIX: Height based on viewport to prevent cutoff on landscape mobile/short screens
  // 📱 MOBILE TWEAK: Cap at 1.8 for mobile (so they don't look like needles), 2.5 for desktop
  const maxH = isMobile ? 1.8 : 2.5;
  const pillarHeight = Math.min(maxH, viewport.height * 0.5);

  // 🏃‍♂️ ANIMATION LOOP STATE
  const [activeIndex, setActiveIndex] = useState(0);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const speed = 3.0; // 🚀 SUPER FAST (Butter Oily)
    const index = Math.floor((time * speed) % APPS.length);
    if (index !== activeIndex) {
        setActiveIndex(index);
        onIndexChange(index); // 🌈 Notify parent for ambient color change
    }
  });

  useEffect(() => {
    // ⚡ FASTER LOADING TIME (Since animation is fast)
    const timer = setTimeout(() => onComplete(), 5500); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <group ref={groupRef}>
      {/* 🏭 STUDIO LIGHTING - Back to Clean Reflections */}
      <Environment preset="city" /> 
      <ambientLight intensity={0.5} />
      {/* 🚫 FRONTAL LIGHT REMOVED to prevent "Sun Glare" reflection */}
      
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
  const [activeColor, setActiveColor] = useState(APPS[0].hex);

  if (isComplete) return null;

  const handleComplete = () => {
    setShowCanvas(false);
    setComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030303] flex items-center justify-center overflow-hidden">
      
      {/* 🌈 AMBIENT GLOW BACKDROP (YouTube Style) */}
      <div 
        className="absolute inset-0 transition-colors duration-500 ease-linear opacity-20 blur-[100px] scale-[2.0]" // 🌬️ FIX: More Spread, Less Strong
        style={{
          background: `radial-gradient(circle at center, ${activeColor} 0%, transparent 70%)`,
        }}
      />
      
      {/* 🛡️ FAILSAFE REMOVED */}
      
      {showCanvas && (
        <Canvas 
          gl={{ antialias: true, alpha: true }} // Alpha true for background
          camera={{ position: [0, 0, 8], fov: 35 }}
        >
          <React.Suspense fallback={null}>
             <Scene onComplete={handleComplete} onIndexChange={(i) => setActiveColor(APPS[i].hex)} />
          </React.Suspense>
        </Canvas>
      )}
    </div>
  );
}
