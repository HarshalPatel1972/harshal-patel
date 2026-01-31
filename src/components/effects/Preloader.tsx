"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  RoundedBox, 
  MeshTransmissionMaterial, 
  Text,
  Float
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import * as THREE from "three";
import { motion } from "framer-motion";
import gsap from "gsap";
import { isMobile } from "react-device-detect";
import { usePreloader } from "@/lib/preloader-context";
import { APPS } from "@/lib/apps";

// ==========================================
// 🔋 CHARGING CELL COMPONENT
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
  const lightRef = useRef<THREE.Mesh>(null);
  
  // Horizontal layout - centered (taller, slimmer cells)
  const cellWidth = 0.5;
  const cellHeight = 3.5;
  const cellDepth = 0.35;
  const gap = 0.08;
  const x = (index - (total - 1) / 2) * (cellWidth + gap);

  // Light fill position (back to front on Z-axis)
  const lightZ = THREE.MathUtils.lerp(-0.4, 0.3, fillProgress);
  const lightIntensity = fillProgress * (isOvercharging ? 3 : 1);

  return (
    <group position={[x, 0, 0]}>
      {/* 🔹 Glass Shell (Taller, Slimmer, Premium) */}
      <RoundedBox 
        ref={meshRef} 
        args={[cellWidth, cellHeight, cellDepth]} 
        radius={0.03} 
        smoothness={8}
      >
        {isMobile ? (
          <meshStandardMaterial 
            color={app.hex}
            transparent
            opacity={0.4 + fillProgress * 0.4} // Higher base opacity
            metalness={0.9} // Slightly less metal to catch light
            roughness={0.1}
            emissive={app.hex}
            emissiveIntensity={0.2 + fillProgress * 0.5} // Base emissive
          />
        ) : (
          <MeshTransmissionMaterial
            backside={false} // Disable backside to save memory
            samples={4} // Reduce samples
            resolution={512} // Cap resolution
            thickness={2}
            chromaticAberration={0.03}
            anisotropy={0.3}
            color="#ffffff"
            transmission={0.95}
            roughness={0.05}
            ior={1.5}
            emissive={app.hex}
            emissiveIntensity={0.2 + fillProgress * 0.6} // Base emissive
          />
        )}
      </RoundedBox>

      {/* 💡 THE FILL LIGHT (Moving Plane) */}
      <mesh ref={lightRef} position={[0, 0, lightZ]}>
        <planeGeometry args={[cellWidth * 0.85, cellHeight * 0.9]} />
        <meshBasicMaterial 
          color={app.hex} 
          transparent 
          opacity={fillProgress * 0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 🏷️ APP NAME (Bottom of Cell - Award Font) */}
      <Text
        position={[0, -cellHeight/2 - 0.25, 0]}
        fontSize={0.12}
        font="https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPbF4C_k3HqU.woff2"
        color="white"
        anchorX="center"
        anchorY="top"
        fillOpacity={0.4 + fillProgress * 0.6} // More visible text
        letterSpacing={0.05}
      >
        {app.name.toUpperCase()}
      </Text>

      {/* ✨ CHARGED INDICATOR GLOW */}
      {fillProgress > 0.9 && (
        <pointLight
          intensity={lightIntensity * 5}
          distance={3}
          color={app.hex}
          position={[0, 0, 0.5]}
        />
      )}
    </group>
  );
}

// ==========================================
// 🎥 CORE CHARGE SCENE
// ==========================================

function CoreChargeScene({ onComplete }: { onComplete: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [fillProgress, setFillProgress] = useState<number[]>(new Array(APPS.length).fill(0));
  const [phase, setPhase] = useState<"materialize" | "charge" | "overcharge" | "project">("materialize");
  const [bloomIntensity, setBloomIntensity] = useState(1.0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const tl = gsap.timeline();

    // Phase 1: Materialization (0s - 0.5s)
    tl.to({}, { duration: 0.5, onComplete: () => setPhase("charge") });

    // Phase 2: The Charge (0.5s - 2.5s)
    APPS.forEach((_, i) => {
      tl.to({}, {
        duration: 0.25,
        onStart: () => {
          const fill = { val: 0 };
          gsap.to(fill, {
            val: 1,
            duration: 0.5,
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
      }, 0.5 + i * 0.25);
    });

    // Phase 3: Overcharge (2.5s - 3.5s)
    tl.call(() => setPhase("overcharge"), [], 2.5);
    tl.to({ b: 1.0 }, {
      b: 3.0,
      duration: 1.0,
      onUpdate: function() { setBloomIntensity(this.targets()[0].b); }
    }, 2.5);

    // Phase 4: Projection (3.5s - 4.0s)
    tl.call(() => setPhase("project"), [], 3.5);
    tl.to({ s: 1 }, {
      s: 15,
      duration: 0.5,
      ease: "power4.in",
      onUpdate: function() { setScale(this.targets()[0].s); }
    }, 3.5);
    tl.to({ b: 3.0 }, {
      b: 20,
      duration: 0.5,
      onUpdate: function() { setBloomIntensity(this.targets()[0].b); },
      onComplete: () => onComplete()
    }, 3.5);

    return () => { tl.kill(); };
  }, [onComplete]);

  // Camera shake during overcharge
  useFrame((state) => {
    if (phase === "overcharge" && groupRef.current) {
      groupRef.current.position.x = (Math.random() - 0.5) * 0.02;
      groupRef.current.position.y = (Math.random() - 0.5) * 0.02;
    }
  });

  return (
    <>
      <color attach="background" args={["#030303"]} />
      <ambientLight intensity={0.5} /> {/* Add ambient light for visibility */}
      <spotLight position={[0, 10, 10]} intensity={1} angle={0.5} penumbra={1} /> {/* Highlight glass edges */}
      
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

      {/* 🎥 POST PROCESSING */}
      <EffectComposer enableNormalPass={false}>
        <Bloom 
          luminanceThreshold={0.1} 
          luminanceSmoothing={0.9} 
          intensity={bloomIntensity} 
          kernelSize={isMobile ? KernelSize.SMALL : KernelSize.LARGE}
          mipmapBlur
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
    <div className="fixed inset-0 z-50 bg-[#030303]">
      {showCanvas && (
        <Canvas 
          gl={{ antialias: false, stencil: false, depth: true }}
          camera={{ position: [0, 0, 8], fov: 35 }}
        >
          <Suspense fallback={null}>
            <CoreChargeScene onComplete={handleComplete} />
          </Suspense>
        </Canvas>
      )}
      
      {/* 🏷️ STATUS */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase text-center">
          CHARGING CORE // {isMobile ? "PERF_MODE" : "ULTRA_MODE"}
        </div>
      </motion.div>
    </div>
  );
}
