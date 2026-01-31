"use client";

import React, { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  RoundedBox, 
  MeshTransmissionMaterial, 
  MeshReflectorMaterial, 
  Environment, 
  Float,
  PerspectiveCamera,
  OrthographicCamera
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { usePreloader } from "@/lib/preloader-context";
import { APPS } from "@/lib/apps";

// ==========================================
// 🏛️ MONOLITH COMPONENT
// ==========================================

function Monolith({ 
  app, 
  index, 
  total, 
  intensity 
}: { 
  app: any; 
  index: number; 
  total: number; 
  intensity: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.RectAreaLight>(null);
  
  // Calculate horizontal position in a slight arc
  const spacing = 1.8;
  const x = (index - (total - 1) / 2) * spacing;
  const z = -Math.pow(Math.abs(x), 1.5) * 0.2; // Convex arc

  return (
    <group position={[x, 0, z]}>
      {/* 🔹 Glass Slab */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <RoundedBox 
          ref={meshRef} 
          args={[1, 6, 0.4]} 
          radius={0.1} 
          smoothness={4}
          position={[0, 3, 0]} // Pivot from bottom
        >
          <MeshTransmissionMaterial
            backside={false}
            samples={4}
            thickness={2}
            chromaticAberration={0.05}
            anisotropy={0.1}
            distortion={0}
            distortionScale={0}
            temporalDistortion={0}
            clearcoat={1}
            attenuationDistance={0.5}
            attenuationColor="#ffffff"
            color="#ffffff"
            transmission={0.95}
            roughness={0.1}
          />
        </RoundedBox>
      </Float>

      {/* 🔹 Internal Glow (RectAreaLight) */}
      <rectAreaLight
        ref={lightRef}
        intensity={intensity * 20}
        width={0.8}
        height={5.8}
        color={app.hex}
        position={[0, 3, 0.1]}
        rotation={[0, 0, 0]}
      />
      
      {/* 🔹 Vertical Beam (Visual Hack using a thin glowing box) */}
      <mesh position={[0, 10, 0]}>
        <boxGeometry args={[0.01, 20, 0.01]} />
        <meshBasicMaterial 
          color={app.hex} 
          transparent 
          opacity={intensity * 0.3} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>
    </group>
  );
}

// ==========================================
// 🎥 LOADER SCENE
// ==========================================

function LoaderScene({ setComplete }: { setComplete: () => void }) {
  const { camera } = useThree();
  const [intensities, setIntensities] = useState<number[]>(new Array(APPS.length).fill(0));
  const [isTopDown, setIsTopDown] = useState(false);
  const canvasOpacity = useRef(1);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Initialize RectAreaLightUniformsLib
    // (In a real app we might need to import and call this once)
    // THREE.RectAreaLightUniformsLib.init();

    const tl = gsap.timeline({
      onComplete: () => {
        // Handoff to DOM happens after transition
        setTimeout(() => {
          setComplete();
        }, 500);
      }
    });

    // Phase 1: Ignition (0s - 1.5s)
    APPS.forEach((_, i) => {
      tl.to({}, {
        duration: 0.15,
        onStart: () => {
          // Animate the state for each monolith intensity
          const update = { val: 0 };
          gsap.to(update, {
            val: 1,
            duration: 0.6,
            ease: "power2.out",
            onUpdate: () => {
              setIntensities(prev => {
                const next = [...prev];
                next[i] = update.val;
                return next;
              });
            }
          });
        }
      }, i * 0.15);
    });

    // Phase 2 & 3: Ascent & Orbital Lock (1.5s - 3.5s)
    tl.to(camera.position, {
      y: 12,
      z: 0.1, // Move almost top-down
      duration: 2,
      ease: "power4.inOut"
    }, 1.5);

    tl.to(camera.rotation, {
      x: -Math.PI / 2,
      duration: 2,
      ease: "power4.inOut",
      onStart: () => setIsTopDown(true)
    }, 1.5);

    // Zoom out slightly at the end to fit the header
    tl.to(camera, {
      zoom: 1.2,
      duration: 1,
      onUpdate: () => camera.updateProjectionMatrix()
    }, 2.5);

    return () => { tl.kill(); };
  }, [camera, setComplete]);

  return (
    <>
      <color attach="background" args={["#050505"]} />
      
      {/* 💡 AMBIENT HINT */}
      <ambientLight intensity={0.1} />
      
      <group ref={groupRef}>
        {/* 🌟 THE MONOLITHS */}
        {APPS.map((app, i) => (
          <Monolith 
            key={app.name} 
            app={app} 
            index={i} 
            total={APPS.length} 
            intensity={intensities[i]}
          />
        ))}

        {/* 🪞 REFLECTION FLOOR */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={512}
            mixBlur={1}
            mixStrength={20}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050505"
            metalness={0.5}
            mirror={1}
          />
        </mesh>
      </group>

      {/* 🎥 POST PROCESSING */}
      <EffectComposer enableNormalPass={false}>
        <Bloom 
          luminanceThreshold={0.1} 
          luminanceSmoothing={0.9} 
          intensity={1.5} 
          mipmapBlur
        />
      </EffectComposer>

      {/* 🌍 ENVIRONMENT */}
      <Environment preset="night" />
    </>
  );
}

// ==========================================
// 🚀 EXPORTED COMPONENT
// ==========================================

export function Preloader() {
  const { setComplete, isComplete } = usePreloader();
  const [fadeOut, setFadeOut] = useState(false);

  const handleComplete = () => {
    setFadeOut(true);
    setTimeout(() => {
      setComplete();
    }, 1000);
  };

  if (isComplete) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-[#050505] transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <Canvas 
        shadows
        gl={{ antialias: false, stencil: false, depth: true }}
        camera={{ position: [0, -2, 8], fov: 60 }}
      >
        <Suspense fallback={null}>
          <LoaderScene setComplete={handleComplete} />
        </Suspense>
      </Canvas>
      
      {/* 🏷️ SYSTEM_INIT OVERLAY (Minimal) */}
      <div className="absolute bottom-10 left-10 font-mono text-[10px] text-white/10 tracking-[0.3em] uppercase pointer-events-none">
        INITIALIZING // PILLARS_OF_CREATION
      </div>
    </div>
  );
}
