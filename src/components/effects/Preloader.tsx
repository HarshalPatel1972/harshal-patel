"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import * as THREE from "three";
import { motion } from "framer-motion";
import gsap from "gsap";
import { usePreloader } from "@/lib/preloader-context";
import { APPS } from "@/lib/apps";
import { isMobile } from "react-device-detect";

// ==========================================
// 🛡️ THE SENTINELS: VERTICAL MONOLITHS (SAFE MODE)
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
  
  // Vertical Column Layout
  // Spread across X axis, taller Y
  const spacing = 1.5;
  const x = (index - (total - 1) / 2) * spacing;
  
  return (
    <group position={[x, 0, 0]}>
      {/* 🔹 GLASS MONOLITH (Standard Material) */}
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
          opacity={0.6} // High visibility
          emissive={app.hex}
          emissiveIntensity={active ? 2 : 0.2} // Bright flash when active
        />
      </RoundedBox>

      {/* 🏷️ VERTICAL BRANDING */}
      <group position={[0, -2, 0.5]}>
        <Text
          fontSize={0.2}
          font="https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPbF4C_k3HqU.woff2"
          color="white"
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, Math.PI / 2]} // Vertical text
          letterSpacing={0.1}
        >
          {app.name.toUpperCase()}
        </Text>
      </group>
    </group>
  );
}

// ==========================================
// 🎥 SENTINEL SCENE
// ==========================================

function SentinelsScene({ onComplete }: { onComplete: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [scale, setScale] = useState(1);
  const [bloomIntensity, setBloomIntensity] = useState(0.5);

  useEffect(() => {
    const tl = gsap.timeline();

    // 1. Activation Sequence (Rapid Fire)
    APPS.forEach((_, i) => {
      tl.call(() => setActiveIndex(i), [], "+=0.15");
    });

    // 2. All Active
    tl.call(() => setActiveIndex(99), [], "+=0.5");

    // 3. Warp Speed Transition (Ascent)
    tl.to({}, {
      duration: 1.0,
      onStart: () => {
         // Custom animation via state/refs if needed
      },
      onUpdate: function() {
        const prog = this.progress();
        setBloomIntensity(0.5 + prog * 5); // Ramp bloom
        setScale(1 + prog * 10); // Warp scale
      },
      onComplete: () => onComplete()
    });

    return () => { tl.kill(); };
  }, [onComplete]);

  useFrame((state) => {
    if (groupRef.current) {
        // Subtle floating
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />
      
      {/* 💡 GUARANTEED VISIBILITY LIGHTS */}
      <ambientLight intensity={2} />
      <pointLight position={[0, 5, 5]} intensity={5} color="white" />
      <pointLight position={[0, -5, 5]} intensity={2} color="blue" />

      {/* 🏛️ THE PILLARS */}
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

       {/* 🎥 POST PROCESSING (Safe Bloom) */}
       <EffectComposer enableNormalPass={false}>
        <Bloom 
          luminanceThreshold={0.5} 
          luminanceSmoothing={0.9} 
          intensity={bloomIntensity} 
          kernelSize={KernelSize.LARGE}
        />
      </EffectComposer>
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
      
      {/* FALLBACK TEXT */}
      <div className="absolute top-10 left-0 right-0 text-center pointer-events-none z-0">
         <span className="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase">
            SENTINELS_PROTOCOL // INITIALIZING
         </span>
      </div>

      {showCanvas && (
        <Canvas 
          gl={{ antialias: true }} 
          camera={{ position: [0, 0, 10], fov: 45 }}
        >
          <Suspense fallback={null}>
            <SentinelsScene onComplete={handleComplete} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
