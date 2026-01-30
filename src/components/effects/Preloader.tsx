"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Html, PerspectiveCamera, Environment, useProgress } from "@react-three/drei";
import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { usePreloader } from "@/lib/preloader-context";

/**
 * 🖥️ "Wireframe to Render" Preloader
 * 
 * Concept:
 * 1. Starts as technical wireframe blueprint (3D)
 * 2. "Bakes" textures/lighting in real-time
 * 3. Transitions to immersive view
 */
export function Preloader() {
  const { setComplete } = usePreloader();
  const [loadingStep, setLoadingStep] = useState(0); // 0-100 logic
  const [complete, setInternalComplete] = useState(false);

  // Simulated Loading Process
  useEffect(() => {
    // Phase 1: Geometry (0-30%) - Fast
    const t1 = setTimeout(() => setLoadingStep(30), 800);
    // Phase 2: Lighting/Shaders (30-70%) - Medium
    const t2 = setTimeout(() => setLoadingStep(70), 2000);
    // Phase 3: Textures/Liquid Fill (70-100%) - Slow
    const t3 = setTimeout(() => setLoadingStep(100), 3500);
    
    // Transition Out
    const t4 = setTimeout(() => {
      setInternalComplete(true);
      setTimeout(setComplete, 1000); // Allow camera swoosh time
    }, 4500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [setComplete]);

  if (complete && loadingStep === 100) return null; // Unmount after swoosh

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]">
      <Canvas shadows dpr={[1, 2]}>
        <Scene loadingStep={loadingStep} onComplete={() => setInternalComplete(true)} />
      </Canvas>
      
      {/* HUD Overlay */}
      <HUD loadingStep={loadingStep} />
    </div>
  );
}

function Scene({ loadingStep, onComplete }: { loadingStep: number, onComplete: () => void }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  // Camera Animation "Swoosh"
  useFrame((state) => {
    if (!cameraRef.current) return;
    
    // Target positions
    // Start: High Oblique (Blueprint view)
    const startPos = new THREE.Vector3(0, 8, 12);
    const startLook = new THREE.Vector3(0, -2, 0);
    
    // End: Frontal (Immersive view)
    const endPos = new THREE.Vector3(0, 0, 8);
    const endLook = new THREE.Vector3(0, 0, 0);

    // Progress 0-100 -> 0-1
    const progress = loadingStep / 100;
    
    // Interpolate
    // Standard lerp for most of it, but final swoosh at 100%
    if (loadingStep < 100) {
      // Subtle float during loading
      const float = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
      cameraRef.current.position.lerp(new THREE.Vector3(0, 8 + float, 12), 0.05);
      cameraRef.current.lookAt(0, -2, 0);
    } else {
      // THE SWOOSH (Rapid transition to front)
      cameraRef.current.position.lerp(endPos, 0.15); // Fast lerp
      
      // LookAt transition manually
      const currentLook = new THREE.Vector3().lerpVectors(startLook, endLook, 0.1); 
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 8, 12]} ref={cameraRef} fov={45} />
      
      {/* Lighting - "Baking" activates lights */}
      <ambientLight intensity={loadingStep > 30 ? 0.5 : 0.1} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={loadingStep > 30 ? 1.5 : 0} 
        castShadow 
      />
      <pointLight 
        position={[-10, 5, -5]} 
        intensity={loadingStep > 50 ? 2 : 0} 
        color="#4f46e5" 
      />

      {/* Environment */}
      <Environment preset="city" environmentIntensity={loadingStep > 60 ? 1 : 0} />

      {/* The "Blueprint" Content */}
      <group position={[0, 0, 0]}>
        
        {/* HERO TITLE: HARSHAL */}
        <HeroText text="HARSHAL" position={[0, 1, 0]} step={loadingStep} delay={0} />
        <HeroText text="PATEL" position={[0, -0.5, 0]} step={loadingStep} delay={10} />

        {/* Abstract UI Elements (representing nav, buttons) */}
        {/* Nav Bar placeholder */}
        <UIBlock position={[0, 3.5, 0]} args={[8, 0.5, 0.2]} step={loadingStep} delay={20} />
        
        {/* CTA Buttons */}
        <UIBlock position={[-1.5, -2.5, 0]} args={[2, 0.8, 0.2]} step={loadingStep} delay={40} />
        <UIBlock position={[1.5, -2.5, 0]} args={[2, 0.8, 0.2]} step={loadingStep} delay={45} />

        {/* Decorative Grid Floor */}
        <gridHelper 
          args={[30, 30, 0x444444, 0x222222]} 
          position={[0, -5, 0]} 
          rotation={[0, 0, 0]} 
        />
        
      </group>
    </>
  );
}

// 🧱 Reusable "Liquid Fill" Block
function UIBlock({ position, args, step, delay }: { position: [number, number, number], args: [number, number, number], step: number, delay: number }) {
  // Logic: 
  // 0-30%: Wireframe only
  // 30-100%: Liquid fills up (scale.y or shader)
  
  // Calculate fill percentage for THIS specific block
  // It starts filling after 'delay' offset
  const localProgress = Math.min(Math.max((step - delay) / (100 - delay), 0), 1); // 0 to 1

  return (
    <group position={position}>
      {/* 1. Wireframe Skeleton (Always visible, fades out at end) */}
      <mesh>
        <boxGeometry args={args} />
        <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.3} />
      </mesh>

      {/* 2. Liquid Core (Scales up) */}
      <mesh scale={[1, localProgress, 1]} position={[0, -args[1]/2 + (args[1]*localProgress)/2, 0]}>
        <boxGeometry args={args} />
        <meshStandardMaterial 
          color={step > 80 ? "#ffffff" : "#4f46e5"} 
          roughness={0.2}
          metalness={0.8}
          emissive="#4f46e5"
          emissiveIntensity={step > 80 ? 0 : 0.5}
        />
      </mesh>
    </group>
  );
}

// 🔤 3D Text Component
function HeroText({ text, position, step, delay }: { text: string, position: [number, number, number], step: number, delay: number }) {
  const localProgress = Math.min(Math.max((step - delay) / (100 - delay), 0), 1);
  
  return (
    <group position={position}>
      <Suspense fallback={null}>
        <Text
          fontSize={1.5}
          // font prop removed to use default fallback
          anchorX="center"
          anchorY="middle"
        >
          {text}
          {/* Wireframe Material */}
          <meshBasicMaterial attach="material" color="#00ffff" wireframe transparent opacity={0.3} />
        </Text>

        {/* Solid Overlay (Transition) */}
        {/* Text geometry doesn't support 'scaling fill' easily without custom shader. 
            We'll use opacity fade for text or a duplicate text that reveals. */}
        {localProgress > 0.1 && (
            <Text
            fontSize={1.5}
            anchorX="center"
            anchorY="middle"
            fillOpacity={localProgress}
            >
            {text}
            <meshStandardMaterial 
                attach="material"
                color="white" 
                roughness={0.1}
                metalness={0.9}
            />
            </Text>
        )}
      </Suspense>
    </group>
  );
}

// 📟 HUD Overlay
function HUD({ loadingStep }: { loadingStep: number }) {
  // Retro Terminal Text
  const statusText = useMemo(() => {
    if (loadingStep < 30) return "GENERATING GEOMETRY...";
    if (loadingStep < 60) return "BAKING LIGHTMAPS...";
    if (loadingStep < 90) return "COMPILING SHADERS...";
    return "RENDER COMPLETE";
  }, [loadingStep]);

  return (
    <div className="absolute bottom-10 left-10 font-mono text-cyan-400 text-sm md:text-base pointer-events-none">
      <div className="flex flex-col gap-2">
        <div className="border border-cyan-500/30 bg-black/50 p-4 rounded-sm backdrop-blur-sm">
          <div className="flex justify-between gap-8 mb-2">
            <span>STATUS</span>
            <span className={loadingStep === 100 ? "text-green-400" : "animate-pulse"}>
              {loadingStep === 100 ? "ONLINE" : "PROCESSING"}
            </span>
          </div>
          
          <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden mb-2">
            <motion.div 
              className="h-full bg-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${loadingStep}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          
          <div className="text-xs text-cyan-400/70">
            {`> ${statusText}`}
          </div>
          <div className="text-xs text-cyan-400/50 mt-1">
            {`> MEM: ${Math.floor(loadingStep * 42.5)}MB / 4096MB`}
          </div>
        </div>
      </div>
    </div>
  );
}
