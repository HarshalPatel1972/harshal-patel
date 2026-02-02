"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Html, Environment, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { usePreloader } from "@/lib/preloader-context";
import { APPS } from "@/lib/apps";
import { isMobile } from "react-device-detect";
import { useHandoff } from "@/lib/handoff-context";

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
  // 📐 BUG FIX: Constrain scale by height so text doesn't flow out on short screens
  const scale = Math.min(width * 1.5, height * 0.45); 
  
  // 🎬 ANIMATION STATE REFS
  const materialRef = useRef<any>(null);
  const targetScale = visible ? 1 : 0;
  const currentScale = useRef(1);
  const { invalidate } = useThree(); // 🛑 Fix 5: Grab invalidate handle

  useFrame((state, delta) => {
    let needsUpdate = false;

    // 1. Animate Emissive Pulse
    if (materialRef.current) {
      const targetEmissive = isActive ? 3.0 : 0.0;
      const currentEmissive = materialRef.current.emissiveIntensity;
      
      // Check if we need to animate (Threshold 0.01)
      if (Math.abs(currentEmissive - targetEmissive) > 0.01) {
        materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(currentEmissive, targetEmissive, delta * 6);
        needsUpdate = true;
      } else if (currentEmissive !== targetEmissive) {
        // Snap to final value
        materialRef.current.emissiveIntensity = targetEmissive;
        needsUpdate = true;
      }
    }

    // 2. Animate Scale
    if (Math.abs(currentScale.current - targetScale) > 0.001) {
      currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, delta * 5);
      needsUpdate = true;
    } else if (currentScale.current !== targetScale) {
        currentScale.current = targetScale; // Snap
        needsUpdate = true;
    }

    // 🛑 Smart Sleep: Request next frame ONLY if animating
    if (needsUpdate) invalidate();
  });

  return (
    <group position={[x, 0, 0]} scale={[currentScale.current, currentScale.current, currentScale.current]}>
      {/* 🧊 PILLAR GEOMETRY - Enhanced Bevels for Light Catching */}
      <RoundedBox args={[width, height, depth]} radius={0.05} smoothness={8}>
         {/* 💎 ULTRA-REALISTIC GLASS PHYSICS */}
         {/* 💎 ULTRA-REALISTIC GLASS PHYSICS */}
         {isOptimized ? (
           <meshPhysicalMaterial 
              ref={materialRef}
              color={app.hex}
              transparent
              opacity={0.3}
              roughness={0.2}
              metalness={0.0} // 🚫 Metal Disabled
              emissive={app.hex}
              emissiveIntensity={0.0}
           />
         ) : (
           <>
             {/* 🖥️ DESKTOP: Standard Transmission (Single-Pass Efficient) */}
             <meshPhysicalMaterial 
                ref={materialRef}
                color={app.hex}
                transmission={1.0}           
                thickness={0.5}              
                roughness={0.15}             // 🌫️ Fix 4: Pre-blurred Mip Selection
                anisotropy={0.5}             // 🌫️ Fix 4: Directional Smear
                ior={1.5}                    
                clearcoat={1.0}              
                clearcoatRoughness={0.0}
                attenuationColor={app.hex}
                attenuationDistance={1.0}
                metalness={0.0}              // 🚫 Metal Disabled
                emissive={app.hex}  
                emissiveIntensity={0.0}
                iridescence={1}              // 🌈 Fix 3: Efficient "Vertex/PBR" Rainbows
                iridescenceIOR={1.5}         // Match Glass IOR
                iridescenceThicknessRange={[0, 1400]} // Thin film interference
                toneMapped={false}
             />
           </>
         )}

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
               fontSize: isOptimized ? '12px' : '10px', // 📱 FIX: Larger font on mobile
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

function Scene({ onComplete, onIndexChange, isOptimized }: { onComplete: () => void, onIndexChange: (index: number) => void, isOptimized: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();


  // 📏 PHASE 4: MATH-BASED RESPONSIVENESS
  const maxTotalWidth = viewport.width * 0.9;
  const unitSize = maxTotalWidth / APPS.length;
  
  const pillarWidth = Math.min(0.5, unitSize * 0.75); 
  const gap = Math.min(0.15, unitSize * 0.25);
  // 📐 FIX: Height based on viewport to prevent cutoff on landscape mobile/short screens
  // 📱 MOBILE TWEAK: Cap at 1.8 for mobile (so they don't look like needles), 2.5 for desktop
  const maxH = isOptimized ? 1.8 : 2.5;
  const pillarHeight = Math.min(maxH, viewport.height * 0.5);

  // 🏃‍♂️ ANIMATION LOOP STATE
  // 🏃‍♂️ ANIMATION LOOP STATE
  const [activeIndex, setActiveIndex] = useState(0);

  // 🔀 MASTER SEQUENCER (2 CYCLES)
  // Cycle 1: Loading (Just Glow)
  // Cycle 2: Reveal (Glow + Ripple)
  const { nextStage } = useHandoff();

  useEffect(() => {
    let step = 0;
    const totalSteps = APPS.length * 2; // 14 steps total
    const tempo = 600; // 600ms per beat (Slower for better visual registration)

    const interval = setInterval(() => {
      const cycle = Math.floor(step / APPS.length) + 1; // 1 or 2
      const index = step % APPS.length; // 0 to 6

      // 1. Update Glow
      setActiveIndex(index);
      onIndexChange(index);

      // 2. Trigger Ripple (Cycle 2 Only)
      if (cycle === 2) {
        nextStage();
      }

      // 3. Completion Check
      if (step >= totalSteps - 1) {
        clearInterval(interval);
        setTimeout(onComplete, 1500); // Wait for final washout
      }

      step++;
    }, tempo);

    return () => clearInterval(interval);
  }, [onComplete, nextStage, onIndexChange]);

  return (
    <group ref={groupRef}>
      {/* 🏭 STUDIO LIGHTING - Static Baked HDR (Fix 2: Efficient Sampling) */}
      <Environment preset="city" resolution={256} frames={1} background={false} /> 
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
          visible={true} // 👁️ Pillars ALWAYS visible now (per user request)
          isOptimized={isOptimized} // ⚡ PASS DOWN
        />
      ))}
    </group>
  );
}

// ==========================================
// 🚀 EXPORTED COMPONENT
// ==========================================

import RippleMask from "@/components/effects/RippleMask";

// ... existing imports

// ... imports

export function Preloader() {
  const { setComplete, isComplete } = usePreloader();
  const { nextStage } = useHandoff();
  const [showCanvas, setShowCanvas] = useState(true);
  const [activeColor, setActiveColor] = useState(APPS[0].hex);
  const [isExiting, setIsExiting] = useState(false);
  
  // 🛡️ FORCE OPTIMIZATION: Check Screen Width
  // If User Agent fails (Request Desktop Site), this fallback ensures
  // the phone STILL gets the optimized materials/DPR.
  const [isOptimized, setIsOptimized] = useState(false);

  // 🚀 Fix 6: Staged Boot
  const [isReady, setIsReady] = useState(false);

  // 🚀 Fix 7: Device Capability Ladder
  const [tier, setTier] = useState<'high' | 'low'>('high');

  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 200); // Defer Mount

    const checkSpec = () => {
        // Simple Heuristic: If mobile has low pixel density or potato CPU, downgrade
        const isLowEnd = isMobile && (window.devicePixelRatio < 2 || (navigator.hardwareConcurrency || 4) < 4);
        setTier(isLowEnd ? 'low' : 'high');

        // Force "Mobile Mode" if screen is narrow OR if library says mobile
        const shouldOptimize = window.innerWidth < 1024 || isMobile; 
        setIsOptimized(shouldOptimize);
    };
    
    checkSpec();
    window.addEventListener('resize', checkSpec);
    return () => window.removeEventListener('resize', checkSpec);
  }, []);

  const handleComplete = React.useCallback(() => {
    // ... complete logic
    setIsExiting(true);
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
        
        {/* Tier 2: Static Fallback (Potato Mode) */}
        {tier === 'low' && (
           <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="flex gap-4 opacity-30">
                 {APPS.map((app, i) => (
                    <div key={i} className="w-2 h-16 rounded-full bg-white/20" style={{ backgroundColor: app.hex }} />
                 ))}
              </div>
              <div className="text-white/50 font-mono text-xs tracking-[0.5em] animate-pulse">LOADING</div>
           </div>
        )}

        {/* Tier 1: High-Performance 3D */}
        {isReady && showCanvas && tier === 'high' && (
          <Canvas 
            frameloop="demand"            // 🛑 Fix 5: Event-Driven Rendering (0fps idle)
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} 
            dpr={[1, 1.5]} // ⚡ Performance Cap
            camera={{ position: [0, 0, 8], fov: 35 }}
          >
            <React.Suspense fallback={null}>
               <Scene 
                  onComplete={handleComplete} 
                  onIndexChange={handleIndexChange} 
                  isOptimized={isOptimized} // Pass down
               />
            </React.Suspense>
          </Canvas>
        )}
      </div>
    </>
  );
}
