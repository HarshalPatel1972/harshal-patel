"use client";

import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  RoundedBox, 
  MeshTransmissionMaterial, 
  MeshReflectorMaterial, 
  Environment, 
  Float,
  Text,
  PerspectiveCamera,
  Billboard
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { isMobile } from "react-device-detect";
import { usePreloader } from "@/lib/preloader-context";
import { APPS } from "@/lib/apps";

// ==========================================
// 🏛️ MONOLITH COMPONENT (THE SENTINEL)
// ==========================================

function Monolith({ 
  app, 
  index, 
  total, 
  intensity,
  isWarping 
}: { 
  app: any; 
  index: number; 
  total: number; 
  intensity: number;
  isWarping: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  
  // Calculate horizontal position
  const spacing = 2.2;
  const x = (index - (total - 1) / 2) * spacing;
  const z = -Math.pow(Math.abs(x), 1.5) * 0.3;

  // Warp acceleration
  useFrame((state, delta) => {
    if (isWarping && groupRef.current) {
        groupRef.current.position.z += delta * 50; // Fly towards camera
        groupRef.current.scale.y += delta * 5;     // Stretch
    }
  });

  return (
    <group ref={groupRef} position={[x, 0, z]}>
      {/* 🔹 Glass Sentinel */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <RoundedBox 
          ref={meshRef} 
          args={[1.2, 8, 0.5]} 
          radius={0.05} 
          smoothness={4}
          position={[0, 4, 0]}
        >
          {isMobile ? (
            <meshStandardMaterial 
              color={app.hex}
              transparent
              opacity={0.4}
              metalness={1}
              roughness={0}
              emissive={app.hex}
              emissiveIntensity={intensity * 0.5}
            />
          ) : (
            <MeshTransmissionMaterial
              backside={false}
              samples={4}
              thickness={2}
              chromaticAberration={0.05}
              anisotropy={0.1}
              color="#ffffff"
              transmission={1}
              roughness={0.1}
              emissive={app.hex}
              emissiveIntensity={intensity * 0.5}
            />
          )}
        </RoundedBox>

        {/* 🏷️ INTERNAL BRANDING (Vertical) */}
        <group position={[0, 5, 0.3]} rotation={[0, 0, Math.PI / 2]}>
          <Text
            fontSize={0.4}
            color="white"
            anchorX="center"
            anchorY="middle"
            fillOpacity={intensity}
          >
            {app.name.toUpperCase()}
          </Text>
        </group>
      </Float>

      {/* 💡 INTENSE CORE LIGHT */}
      <pointLight
        ref={lightRef}
        intensity={intensity * (isWarping ? 100 : 25)}
        distance={15}
        color={app.hex}
        position={[0, 4, 0.6]}
      />

      {/* 🎨 VOLUMETRIC BEAM */}
      <mesh position={[0, 15, 0]}>
        <boxGeometry args={[0.02, 30, 0.02]} />
        <meshBasicMaterial 
          color={app.hex} 
          transparent 
          opacity={intensity * 0.2} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>
    </group>
  );
}

// ==========================================
// 🎥 SENTINEL SCENE
// ==========================================

function LoaderScene({ setComplete }: { setComplete: () => void }) {
  const { camera } = useThree();
  const [intensities, setIntensities] = useState<number[]>(new Array(APPS.length).fill(0));
  const [isWarping, setIsWarping] = useState(false);
  const [bloomIntensity, setBloomIntensity] = useState(1.5);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Warp transition
        setIsWarping(true);
        gsap.to({ b: 1.5 }, {
            b: 15,
            duration: 0.8,
            onUpdate: function() { setBloomIntensity(this.targets()[0].b); },
            onComplete: () => {
                setComplete();
            }
        });
      }
    });

    // Phase 1: Ignition (0s - 1.5s)
    APPS.forEach((_, i) => {
      tl.to({}, {
        duration: 0.2,
        onStart: () => {
          const update = { val: 0 };
          gsap.to(update, {
            val: 1,
            duration: 0.8,
            onUpdate: () => {
              setIntensities(prev => {
                const next = [...prev];
                next[i] = update.val;
                return next;
              });
            }
          });
        }
      }, i * 0.2);
    });

    // Phase 2: The Ascent (1.5s - 3.5s)
    tl.to(camera.position, {
      y: 15,
      z: 5,
      duration: 2.5,
      ease: "power2.inOut"
    }, 1.5);

    tl.to(camera.rotation, {
      x: -Math.PI / 2.2,
      duration: 2.5,
      ease: "power2.inOut"
    }, 1.5);

    return () => { tl.kill(); };
  }, [camera, setComplete]);

  return (
    <>
      <color attach="background" args={["#030303"]} />
      
      {/* 🌟 THE SENTINELS */}
      {APPS.map((app, i) => (
        <Monolith 
          key={app.name} 
          app={app} 
          index={i} 
          total={APPS.length} 
          intensity={intensities[i]}
          isWarping={isWarping}
        />
      ))}

      {/* 🪞 PERFORMANCE TIERED FLOOR */}
      {!isMobile && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <planeGeometry args={[100, 100]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={512}
            mixBlur={1}
            mixStrength={15}
            roughness={1}
            depthScale={1.2}
            color="#050505"
            metalness={0.5}
            mirror={1}
          />
        </mesh>
      )}
      
      {isMobile && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#050505" roughness={1} />
        </mesh>
      )}

      {/* 🎥 POST PROCESSING */}
      <EffectComposer enableNormalPass={false}>
        <Bloom 
          luminanceThreshold={0.1} 
          luminanceSmoothing={0.9} 
          intensity={bloomIntensity} 
          kernelSize={isMobile ? KernelSize.VERY_SMALL : KernelSize.LARGE}
          mipmapBlur
        />
      </EffectComposer>

      <Environment preset="night" />
    </>
  );
}

// ==========================================
// 🚀 EXPORTED COMPONENT
// ==========================================

export function Preloader() {
  const { setComplete, isComplete } = usePreloader();
  const [showCanvas, setShowCanvas] = useState(true);

  if (isComplete) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#030303]">
      {showCanvas && (
        <Canvas 
          shadows
          gl={{ antialias: false, stencil: false, depth: true }}
          camera={{ position: [0, 2, 10], fov: 60 }}
        >
          <Suspense fallback={null}>
            <LoaderScene setComplete={() => {
                setShowCanvas(false);
                setComplete();
            }} />
          </Suspense>
        </Canvas>
      )}
      
      {/* 🏷️ STATUS */}
      <div className="absolute top-10 left-10 overflow-hidden">
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-mono text-[9px] text-white/20 tracking-[0.5em] uppercase"
        >
            Establishing Sentinel Cluster // Tier: {isMobile ? "Mobile_Perf" : "Desktop_Ultra"}
        </motion.div>
      </div>
    </div>
  );
}
