"use client";

import React, { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { usePreloader } from "@/lib/preloader-context";

// ==========================================
// 🌀 SINGULARITY ORB (ROBUST VERSION)
// ==========================================

function SingularityOrb({ timeline }: { timeline: gsap.core.Timeline | null }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animate: Pulse and rotate
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Rotation
    meshRef.current.rotation.y = t * 0.5;
    meshRef.current.rotation.z = t * 0.2;
    
    // Scale pulse (if not controlled by timeline yet)
    // We let timeline control scale, but we can add noise to position for "instability"
    const noise = Math.sin(t * 10) * 0.02;
    meshRef.current.position.x = noise;
    meshRef.current.position.y = Math.cos(t * 12) * 0.02;
  });

  return (
    <group>
      {/* Core Glowing Sphere */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 1]} /> {/* Low poly tech look */}
        <meshStandardMaterial 
          color="#000000" 
          emissive="#00f0ff"
          emissiveIntensity={2}
          roughness={0.1}
          metalness={0.8}
          wireframe
        />
      </mesh>
      
      {/* Inner Solid Core */}
      <mesh scale={[0.8, 0.8, 0.8]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Outer Halo (Fake Glow) */}
      <mesh scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
            color="#7000ff" 
            transparent 
            opacity={0.1} 
            blending={THREE.AdditiveBlending} 
            side={THREE.BackSide} // Inverted shell
        />
      </mesh>
    </group>
  );
}

// ==========================================
// ✨ PARTICLE SYSTEM (ROBUST)
// ==========================================

function ParticleImplosion({ timeline }: { timeline: gsap.core.Timeline | null }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 2000;
  
  // Initial random positions largely spread out
  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const init = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Sphere distribution radius 5 to 15
        const r = 5 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        
        pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z;
        init[i*3] = x; init[i*3+1] = y; init[i*3+2] = z;
    }
    return [pos, init];
  }, []);

  const progressRef = useRef(0);
  const explodeRef = useRef(0);

  useEffect(() => {
    if (!timeline) return;
    const proxy = { p: 0, e: 0 };
    
    // Spiral in
    timeline.to(proxy, {
      p: 1, duration: 2.0, ease: "power3.in",
      onUpdate: () => { progressRef.current = proxy.p; }
    }, 0);
    
    // Explode
    timeline.to(proxy, {
      e: 1, duration: 1.0, ease: "expo.out",
      onUpdate: () => { explodeRef.current = proxy.e; }
    }, 2.5);
  }, [timeline]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    
    for(let i=0; i<count; i++) {
        const i3 = i*3;
        const ix = initialPositions[i3];
        const iy = initialPositions[i3+1];
        const iz = initialPositions[i3+2];
        
        // Suction Logic
        // Progress 0 -> 1 : Radius 100% -> 5%
        const suction = 1.0 - (progressRef.current * 0.95); 
        
        // Swirl
        const angle = (t * 2.0) + (i * 0.01);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        // Rotate initial pos then scale
        // Simple Y-axis rotation
        let rx = (ix * cos - iz * sin);
        let rz = (ix * sin + iz * cos);
        let ry = iy;
        
        let tx = rx * suction;
        let ty = ry * suction;
        let tz = rz * suction;
        
        // Explosion
        if (explodeRef.current > 0) {
            const blast = 20.0 * explodeRef.current;
            // Direction from center
            const dist = Math.sqrt(tx*tx + ty*ty + tz*tz) + 0.001;
            tx += (tx/dist) * blast;
            ty += (ty/dist) * blast;
            tz += (tz/dist) * blast;
        }
        
        positions[i3] = tx;
        positions[i3+1] = ty;
        positions[i3+2] = tz;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
         <bufferAttribute 
            attach="attributes-position" 
            args={[positions, 3]} 
         />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        color="#00f0ff" 
        transparent 
        opacity={0.8} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ==========================================
// 🎬 MAIN SCENE & COMPOSITION
// ==========================================

function Scene({ loadingStep, setTimelineRef }: { loadingStep: number, setTimelineRef: (tl: gsap.core.Timeline) => void }) {
  const { camera } = useThree();
  const orbGroup = useRef<THREE.Group>(null);
  const textGroup = useRef<THREE.Group>(null);
  
  // Post-Processing Refs (We can't animate props directly easily, need a ref or controlled inputs)
  // R3F-Postprocessing effects are tricky to animate imperatively. 
  // We'll use React state for the easy ones or Refs if exposed.
  // For Sakuga, let's use global uTime or frame loop adjustments?
  // Actually, we can use <EffectComposer> children and props.

  const [chromaOffset, setChromaOffset] = useState(new THREE.Vector2(0, 0));
  const [bloomIntensity, setBloomIntensity] = useState(1.5);
  
  // Initialize Master Timeline
  useEffect(() => {
    const tl = gsap.timeline({ paused: true });
    setTimelineRef(tl);

     // Phase 1: Accumulation (0-1.5s)
    tl.to(orbGroup.current!.scale, { x: 0.1, y: 0.1, z: 0.1, duration: 1.5, ease: "power2.in" }, 0);
    // Chromatic Aberration increase visually manually via onUpdate or state
    // We'll simulate via state updates in a separate effect or useFrame.
    
    // Phase 2: Contraction (The Silence) (1.5s-2.0s)
    tl.to(orbGroup.current!.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.5, ease: "expo.in" }, 1.5);
    
    // Phase 3: The Drop (2.5s)
    // Camera Shake
    tl.to(camera.position, { 
      z: 8, // slight zoom out or shake
      duration: 0.1, 
      ease: "rough({ template: none.out, strength: 1, points: 20, taper: 'none', randomize: true, clamp: false})" 
    }, 2.4);

    // Text Reveal (2.5s) // The Bang
    tl.set(textGroup.current, { visible: true }, 2.5);
    tl.from(textGroup.current!.scale, { x: 3, y: 3, z: 3, duration: 0.4, ease: "elastic.out(1, 0.3)" }, 2.5);
    
    // Start playback
    tl.play();

    return () => { tl.kill(); };
  }, [camera, setTimelineRef]);

  // Animation Loop for Post-Processing & Camera Shake logic
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Manual Choma Logic based on timeline time could be here, 
    // but simpler to map roughly to phases.
    if (time < 1.5) {
        // Build up
        setChromaOffset(new THREE.Vector2(time * 0.002, time * 0.002));
    } else if (time >= 1.5 && time < 2.5) {
        // TENSION (High aberration)
        setChromaOffset(new THREE.Vector2(0.005 + Math.sin(time * 50)*0.002, 0.005));
    } else {
        // Release
        setChromaOffset(new THREE.Vector2(0.001, 0.001));
    }
    
    // Bloom
    if (time > 2.0 && time < 2.5) {
        setBloomIntensity(5.0); // Flare up
    } else {
        setBloomIntensity(1.5);
    }
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />
      
      {/* 🔴 THE SINGULARITY */}
      <group ref={orbGroup}>
        <SingularityOrb timeline={null} />
      </group>

      {/* ✨ PARTICLES */}
      <ParticleImplosion timeline={null} /> {/* We passed null but we need the REAL timeline. We can context or prop drill. */}
      {/* Actually, let's just make particles mostly autonomous or controlled by same timeline ref if lifted */}
      
      {/* 📝 TEXT REVEAL */}
      <group ref={textGroup} visible={false}>
        <Text
          position={[0, 0, 0]}
          fontSize={1.5}
          font="/fonts/Inter-Bold.woff" // Ensure font exists or use default
          anchorX="center"
          anchorY="middle"
        >
          HARSHAL PATEL
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
        </Text>
      </group>

      {/* 🎥 POST PROCESSING */}
      <EffectComposer enableNormalPass={false}>
        <Bloom luminanceThreshold={0.2} mipmapBlur intensity={bloomIntensity} />
        <ChromaticAberration offset={chromaOffset} radialModulation={false} modulationOffset={0} />
        <Noise opacity={0.05} />
      </EffectComposer>
    </>
  );
}

// ==========================================
// 🚀 EXPORTED COMPONENT
// ==========================================

export function Preloader() {
  const { setComplete } = usePreloader();
  const [complete, setInternalComplete] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Re-inject timeline to children (hacky but functional for R3F context separation)
  // Better approach: State management or Context. 
  // Let's rely on the internal logic of Scene to drive everything or pass refs down.
  // Actually, Scene creates the timeline. We can expose it via ref? 
  // For simplicity: The main animation runs 0-4.5s.
  
  useEffect(() => {
    // Hard transition to site at 4.5s
    const t = setTimeout(() => {
      setInternalComplete(true);
      setComplete();
    }, 4500);

    // Flash at 2.5s (White Overlay DOM)
    const flashTimer = setTimeout(() => {
        const flashEl = document.getElementById("flash-overlay");
        if (flashEl) {
            flashEl.style.opacity = "1";
            setTimeout(() => { flashEl.style.opacity = "0"; }, 200);
        }
    }, 2500);

    return () => { clearTimeout(t); clearTimeout(flashTimer); };
  }, [setComplete]);

  if (complete) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* R3F Canvas */}
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping }}>
        {/* We need to pass timeline so particles can use it? 
            Actually, let Scene handle timeline creation and bind it to everything.
        */}
        <SceneWrapper />
      </Canvas>
      
      {/* ⚡ IMPACT FLASH OVERLAY (DOM) */}
      <div 
        id="flash-overlay"
        className="absolute inset-0 bg-white pointer-events-none opacity-0 transition-opacity duration-200 ease-out z-[60]"
      />
    </div>
  );
}

function SceneWrapper() {
  const [tl, setTl] = useState<gsap.core.Timeline | null>(null);
  
  return (
    <>
      <Scene loadingStep={0} setTimelineRef={setTl} />
      {tl && <ParticleImplosion timeline={tl} />}
    </>
  );
}
