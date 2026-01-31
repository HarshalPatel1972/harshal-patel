"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  RoundedBox, 
  Text
} from "@react-three/drei";
// REMOVED: Environment, MeshTransmissionMaterial (Network/GPU Risks)
// REMOVED: EffectComposer, Bloom (Compatibility Risks)
import * as THREE from "three";
import { motion } from "framer-motion";
import gsap from "gsap";
import { usePreloader } from "@/lib/preloader-context";
import { APPS } from "@/lib/apps";

// ==========================================
// 🛡️ FAILSAFE CHARGING CELL
// ==========================================

function ChargingCell({ 
  app, 
  index, 
  total, 
  fillProgress,
  isOvercharging
}: { 
  app: any; 
  index: number; 
  total: number; 
  fillProgress: number;
  isOvercharging: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Horizontal layout - centered (taller, slimmer cells)
  const cellWidth = 0.5;
  const cellHeight = 3.5;
  const cellDepth = 0.35;
  const gap = 0.08;
  const x = (index - (total - 1) / 2) * (cellWidth + gap);

  // Light fill position (back to front on Z-axis)
  const lightZ = THREE.MathUtils.lerp(-0.4, 0.3, fillProgress);

  return (
    <group position={[x, 0, 0]}>
      {/* 🔹 GLASS SHELL (Standard Material - Guaranteed Visibility) */}
      <RoundedBox 
        ref={meshRef} 
        args={[cellWidth, cellHeight, cellDepth]} 
        radius={0.03} 
        smoothness={4} 
      >
        <meshStandardMaterial 
          color={app.hex}
          transparent
          opacity={0.3 + fillProgress * 0.5} // Always visible (min 0.3)
          metalness={0.6} 
          roughness={0.2}
          emissive={app.hex}
          emissiveIntensity={0.1 + fillProgress * 0.5} 
        />
      </RoundedBox>

      {/* 💡 THE FILL LIGHT (Moving Plane) */}
      <mesh position={[0, 0, lightZ]}>
        <planeGeometry args={[cellWidth * 0.85, cellHeight * 0.9]} />
        <meshBasicMaterial 
          color={app.hex} 
          transparent 
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 🏷️ APP NAME (Bottom) */}
      <Text
        position={[0, -cellHeight/2 - 0.25, 0]}
        fontSize={0.12}
        font="https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPbF4C_k3HqU.woff2"
        color="white"
        anchorX="center"
        anchorY="top"
        fillOpacity={0.5 + fillProgress * 0.5}
        letterSpacing={0.05}
      >
        {app.name.toUpperCase()}
      </Text>
    </group>
  );
}

// ==========================================
// 🎥 CORE CHARGE SCENE (NO SUSPENSE RISKS)
// ==========================================

function CoreChargeScene({ onComplete }: { onComplete: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [fillProgress, setFillProgress] = useState<number[]>(new Array(APPS.length).fill(0));
  const [phase, setPhase] = useState<"materialize" | "charge" | "overcharge" | "project">("materialize");
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const tl = gsap.timeline();

    // Phase 1: Materialization
    tl.to({}, { duration: 0.5, onComplete: () => setPhase("charge") });

    // Phase 2: The Charge
    APPS.forEach((_, i) => {
      tl.to({}, {
        duration: 0.2, // Faster for debug
        onStart: () => {
          const fill = { val: 0 };
          gsap.to(fill, {
            val: 1,
            duration: 0.4,
            ease: "power2.out",
            onUpdate: () => {
              setFillProgress(prev => {
                const next = [...prev];
                next[i] = fill.val;
                return next;
              });
            }
          });
        }
      }, 0.5 + i * 0.15);
    });

    // Phase 3: Overcharge
    tl.call(() => setPhase("overcharge"), [], 2.0);

    // Phase 4: Projection
    tl.call(() => setPhase("project"), [], 3.0);
    tl.to({ s: 1 }, {
      s: 15,
      duration: 0.5,
      ease: "power4.in",
      onUpdate: function() { setScale(this.targets()[0].s); },
      onComplete: () => onComplete()
    }, 3.0);

    return () => { tl.kill(); };
  }, [onComplete]);

  // Camera shake
  useFrame((state) => {
    if (phase === "overcharge" && groupRef.current) {
      groupRef.current.position.x = (Math.random() - 0.5) * 0.05;
      groupRef.current.position.y = (Math.random() - 0.5) * 0.05;
    }
  });

  return (
    <>
      <color attach="background" args={["#050505"]} />
      
      {/* 💡 SIMPLE LOCAL LIGHTING (No Environment Map) */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[0, 0, 10]} intensity={2} color="white" />
      <pointLight position={[0, 10, 5]} intensity={1} color="#4f46e5" />
      
      {/* 🔋 THE CHARGING CORE */}
      <group ref={groupRef} scale={scale}>
        {APPS.map((app, i) => (
          <ChargingCell 
            key={app.name} 
            app={app} 
            index={i} 
            total={APPS.length} 
            fillProgress={fillProgress[i]}
            isOvercharging={phase === "overcharge" || phase === "project"}
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
    <div className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center">
      
      {/* HTML FALLBACK TEXT (Visible if Canvas fails) */}
      <div className="absolute top-10 left-0 right-0 text-center pointer-events-none z-0">
         <span className="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase">
            SYSTEM_BOOT_SEQUENCE_V4
         </span>
      </div>

      {showCanvas && (
        <Canvas 
          gl={{ antialias: true }} 
          camera={{ position: [0, 0, 8], fov: 35 }}
        >
          {/* SUSPENSE BOUNDARY MUST BE SAFE */}
          <Suspense fallback={null}>
            <CoreChargeScene onComplete={handleComplete} />
          </Suspense>
        </Canvas>
      )}
      
      {/* 🏷️ STATUS */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="font-mono text-[9px] text-white/30 tracking-[0.3em] uppercase text-center">
          CORE_SAFE_MODE // ONLINE
        </div>
      </motion.div>
    </div>
  );
}
