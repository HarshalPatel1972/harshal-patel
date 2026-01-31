"use client";

import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import gsap from "gsap";
import { usePreloader } from "@/lib/preloader-context";
import { APPS } from "@/lib/apps";
import { isMobile } from "react-device-detect";

// ==========================================
// 🛡️ SAFE MODE: STANDARD MATERIALS ONLY
// ==========================================

function ChasingPillar({ 
  app, 
  index, 
  total, 
  lightRef
}: { 
  app: any; 
  index: number; 
  total: number; 
  lightRef: React.MutableRefObject<THREE.MeshStandardMaterial | null>;
}) {
  // Slimmer, Taller Geometry as requested
  const width = isMobile ? 0.3 : 0.4;
  const height = isMobile ? 4 : 5;
  const depth = width;
  const gap = 0.2;
  
  // Centered Layout
  const x = (index - (total - 1) / 2) * (width + gap);

  return (
    <group position={[x, 0, 0]}>
      <RoundedBox 
        args={[width, height, depth]} 
        radius={0.05} 
        smoothness={4} 
      >
        <meshStandardMaterial 
          ref={lightRef} // Ref controlled by parent useFrame
          color={app.hex}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.3} // Dim when inactive
          emissive={app.hex}
          emissiveIntensity={0.2} // Base glow
        />
      </RoundedBox>

      {/* Label */}
      <group position={[0, -height/2 - 0.4, 0]}>
         <Text
          fontSize={0.12}
          font="https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPbF4C_k3HqU.woff2"
          color="white"
          anchorX="center"
          anchorY="top"
          letterSpacing={0.05}
        >
          {app.name.toUpperCase()}
        </Text>
      </group>
    </group>
  );
}

// ==========================================
// 🔁 THE LOOPING SCENE
// ==========================================

function ChasingScene({ onComplete }: { onComplete: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Refs for materials to update them without re-rendering React components
  const materialRefs = useMemo(() => 
    APPS.map(() => React.createRef<THREE.MeshStandardMaterial>()), 
  []);

  const [isExiting, setIsExiting] = useState(false);

  // 🔄 THE PULSE LOOP
  useFrame((state) => {
    if (isExiting) return; // Stop animation during exit

    const time = state.clock.elapsedTime;
    const speed = 4; // Speed of the chase
    
    // Calculate which index is "active" based on time
    // The " % APPS.length" creates the loop
    const rawIndex = (time * speed) % APPS.length;
    const activeIndex = Math.floor(rawIndex);
    
    // Update materials directly
    materialRefs.forEach((ref, i) => {
      if (ref.current) {
        const isTarget = i === activeIndex;
        
        // Target: High Opacity + High Emissive
        // Others: Low Opacity + Low Emissive
        // Lerp for smoothness? No, user asked for "one lights up... previous turns off" -> Instant or fast decay
        
        const targetOpacity = isTarget ? 1.0 : 0.2;
        const targetEmissive = isTarget ? 3.0 : 0.1;

        // Smoothly interpolate for a "breathing" chase effect
        ref.current.opacity = THREE.MathUtils.lerp(ref.current.opacity, targetOpacity, 0.2);
        ref.current.emissiveIntensity = THREE.MathUtils.lerp(ref.current.emissiveIntensity, targetEmissive, 0.2);
      }
    });

    // Gentle float
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    }
  });

  // 🚪 EXIT SEQUENCE
  useEffect(() => {
    const timer = setTimeout(() => {
      // For now, infinite loop. 
      // In a real app, this would trigger when assets are loaded.
      // We simulate a load time of 4 seconds then exit?
      // User said: "keeps on loop while the page loads up"
      
      // We need a trigger to actually finish.
      // We'll use a delayed call to onComplete for now to simulate loading finishing.
      runExit();
    }, 4500);

    const runExit = () => {
      setIsExiting(true);
      
      // Flash all
      const tl = gsap.timeline({
         onComplete: () => onComplete()
      });

      // Flash all ON
      tl.to(materialRefs.map(r => r.current), {
        emissiveIntensity: 5.0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.05
      });
      
      // Scale out
      tl.to(groupRef.current?.scale || {}, {
        x: 15, y: 15, z: 15,
        duration: 1,
        ease: "power2.in"
      }, "<");
    };

    return () => clearTimeout(timer);
  }, [onComplete, materialRefs]);

  return (
    <>
      <color attach="background" args={["#000000"]} />
      
      {/* 💡 SAFE LIGHTING */}
      <ambientLight intensity={2} />
      <directionalLight position={[0, 0, 10]} intensity={3} />
      
      <group ref={groupRef}>
        {APPS.map((app, i) => (
          <ChasingPillar 
            key={app.name} 
            app={app} 
            index={i} 
            total={APPS.length} 
            lightRef={materialRefs[i]}
          />
        ))}
      </group>
    </>
  );
}

// ==========================================
// 🚀 EXPORTED COMPONENT
// ==========================================

export function Preloader() {
  const { setComplete, isComplete } = usePreloader();
  const [showCanvas, setShowCanvas] = useState(true);

  const handleComplete = () => {
    setShowCanvas(false);
    setTimeout(() => setComplete(), 100);
  };

  if (isComplete) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      
      {/* FALLBACK HTML */}
      <div className="absolute top-10 left-0 right-0 text-center pointer-events-none z-0 opacity-50">
         <span className="font-mono text-[10px] text-white tracking-[0.3em] uppercase">
            SYSTEM_LOADING // VER 2.0
         </span>
      </div>

      {showCanvas && (
        <Canvas 
          gl={{ antialias: true }} 
          camera={{ position: [0, 0, 8], fov: 45 }}
        >
          <Suspense fallback={null}>
            <ChasingScene onComplete={handleComplete} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
