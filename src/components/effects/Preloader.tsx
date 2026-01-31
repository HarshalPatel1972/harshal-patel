"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  RoundedBox, 
  Text
} from "@react-three/drei";
// 🛡️ SAFE MODE: Standard Materials only
import * as THREE from "three";
import { motion } from "framer-motion";
import gsap from "gsap";
import { isMobile } from "react-device-detect";
import { usePreloader } from "@/lib/preloader-context";
import { APPS } from "@/lib/apps";

// ==========================================
// 🛡️ THE SENTINELS (SAFE MODE)
// ==========================================

function SentinelPillar({ 
  app, 
  index, 
  total, 
  active
}: { 
  app: any; 
  index: number; 
  total: number; 
  active: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Vertical Column - Desktop: Taller, Mobile: Dynamic
  const spacing = isMobile ? 1.0 : 1.5;
  const x = (index - (total - 1) / 2) * spacing;
  
  return (
    <group position={[x, 0, 0]}>
      {/* 🔹 MONOLITH (Standard Material w/ High Visibility) */}
      <RoundedBox 
        ref={meshRef} 
        args={[0.8, 5, 0.8]} 
        radius={0.05} 
        smoothness={4} 
      >
        <meshStandardMaterial 
          color={app.hex}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.6} // Guaranteed visible against black
          emissive={app.hex}
          emissiveIntensity={active ? 2.5 : 0.2} // Flash on active
        />
      </RoundedBox>

      {/* 🏷️ BRANDING (Text + Icon Placeholder) */}
      <group position={[0, -2, 0.5]}>
        <Text
          fontSize={0.25}
          font="https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPbF4C_k3HqU.woff2"
          color="white"
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, Math.PI / 2]}
          letterSpacing={0.15}
        >
          {app.name.toUpperCase()}
        </Text>
      </group>
    </group>
  );
}

// ==========================================
// 🎥 SCENE
// ==========================================

function SentinelsScene({ onComplete }: { onComplete: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const tl = gsap.timeline();

    // 1. Activation Ripple
    APPS.forEach((_, i) => {
      tl.call(() => setActiveIndex(i), [], "+=0.1");
    });

    // 2. All Active
    tl.call(() => setActiveIndex(99), [], "+=0.2");

    // 3. Convergence (Warp)
    tl.to({}, {
      duration: 1.0,
      onUpdate: function() {
        const p = this.progress();
        setScale(1 + p * 15); // Scale explosion
      },
      onComplete: () => onComplete()
    }, "+=0.5");

    return () => { tl.kill(); };
  }, [onComplete]);

  useFrame((state) => {
    if (groupRef.current) {
        // Subtle levitation
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />
      
      {/* 💡 LIGHTING (No Environment Map to crash) */}
      <ambientLight intensity={3} />
      <spotLight position={[0, 10, 10]} intensity={5} color="white" angle={0.5} />
      <pointLight position={[-10, 0, 5]} intensity={2} color="cyan" />
      <pointLight position={[10, 0, 5]} intensity={2} color="hotpink" />

      <group ref={groupRef} scale={scale}>
        {APPS.map((app, i) => (
          <SentinelPillar 
            key={app.name} 
            app={app} 
            index={i} 
            total={APPS.length} 
            active={activeIndex === i || activeIndex === 99}
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
      
      {/* FALLBACK HTML (Visible if Canvas fails) */}
      <div className="absolute top-10 left-0 right-0 text-center pointer-events-none z-0 opacity-50">
         <span className="font-mono text-[10px] text-white tracking-[0.3em] uppercase">
            SENTINELS // SAFE_MODE
         </span>
      </div>

      {showCanvas && (
        <Canvas 
          gl={{ antialias: true }} 
          camera={{ position: [0, 0, 10], fov: 45 }}
        >
          {/* SAFE SUSPENSE (No networking) */}
          <Suspense fallback={null}>
            <SentinelsScene onComplete={handleComplete} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
