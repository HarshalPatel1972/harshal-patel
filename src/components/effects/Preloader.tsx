"use client";

import React, { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { usePreloader } from "@/lib/preloader-context";

// ==========================================
// 🌟 NEUTRON STAR SHADER
// ==========================================

const starVertexShader = `
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vNormal = normalize(normalMatrix * normal);
  vViewPosition = -mvPosition.xyz;
}
`;

const starFragmentShader = `
varying vec3 vNormal;
varying vec3 vViewPosition;
uniform vec3 uColor;
uniform float uIntensity;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition); // View direction in camera space
  
  // Fresnel Glow
  float fresnel = dot(normal, viewDir);
  fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
  fresnel = pow(fresnel, 2.0); // Sharpness of rim
  
  // Visual tweaks for Neutron Star:
  // - Dark center (optional) or just additive
  // - Color is multiplied heavily
  
  gl_FragColor = vec4(uColor * uIntensity * fresnel, fresnel);
}
`;

function NeutronStar({ timeline }: { timeline: gsap.core.Timeline | null }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color("#00f0ff") },
    uIntensity: { value: 4.0 },
  }), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Animate uniforms if needed? Or just constant.
    // Rotate the atmosphere
    meshRef.current.rotation.y = t * 0.2;
    
    // Instability pulse
    const instability = Math.sin(t * 15) * 0.005;
    meshRef.current.scale.setScalar(1.0 + instability);
  });

  return (
    <group>
      {/* 🔹 The Star Core (Dense, White-Blue) */}
      <mesh>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>

      {/* 🔹 The Atmosphere (Fresnel Glow) */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.0, 64, 64]} />
        <shaderMaterial
          vertexShader={starVertexShader}
          fragmentShader={starFragmentShader}
          uniforms={uniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false} 
          side={THREE.FrontSide}
        />
      </mesh>
      
      {/* 🔹 Accretion Disk Rings */}
       <mesh rotation={[Math.PI / 1.8, 0, 0]}>
         <torusGeometry args={[2.0, 0.02, 16, 100]} />
         <meshBasicMaterial color="#00f0ff" transparent opacity={0.4} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
       </mesh>
       <mesh rotation={[Math.PI / 2.2, 0, 0]}>
         <torusGeometry args={[2.8, 0.01, 16, 100]} />
         <meshBasicMaterial color="#7000ff" transparent opacity={0.3} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
       </mesh>
    </group>
  );
}

// ==========================================
// 🌌 GRAVITY PARTICLE SYSTEM
// ==========================================

function ParticleImplosion({ timeline }: { timeline: gsap.core.Timeline | null }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 5000; 
  
  // Initial positions
  const [positions, data] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const d = { 
        initial: new Float32Array(count * 3),
        phase: new Float32Array(count), // Random start phase
        speed: new Float32Array(count),  // Random orbit speed
        radius: new Float32Array(count)
    };
    
    for (let i = 0; i < count; i++) {
        // Distribute in a thick shell 15-30 units away
        const r = 15 + Math.random() * 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        
        pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z;
        d.initial[i*3] = x; d.initial[i*3+1] = y; d.initial[i*3+2] = z;
        d.phase[i] = Math.random() * Math.PI * 2;
        d.speed[i] = 0.5 + Math.random();
        d.radius[i] = r;
    }
    return [pos, d];
  }, []);

  const progressRef = useRef(0); // 0 -> 1 (Suction)
  const explodeRef = useRef(0);  // 0 -> 1 (Explosion)

  useEffect(() => {
    if (!timeline) return;
    const proxy = { p: 0, e: 0 };
    
    // SUCTION: 0 -> 1
    // Matches the "Accumulation" phase
    timeline.to(proxy, {
      p: 1, duration: 4.0, ease: "power3.in", // accelerating suction
      onUpdate: () => { progressRef.current = proxy.p; }
    }, 0);
    
    // EXPLOSION
    timeline.to(proxy, {
      e: 1, duration: 2.0, ease: "expo.out",
      onUpdate: () => { explodeRef.current = proxy.e; }
    }, 4.0);
  }, [timeline]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    
    for(let i=0; i<count; i++) {
        const i3 = i*3;
        const ix = data.initial[i3];
        const iy = data.initial[i3+1];
        const iz = data.initial[i3+2];
        
        // 1. Gravity Logic (Suction)
        // We map progress (0-1) to radius scale (1 -> 0)
        // But we want it to look like they are being pulled in with conservation of momentum (spiraling faster)
        
        const p = progressRef.current;
        // Radius contracts: 1.0 -> 0.0 (Singularity)
        // Gravity is exponential
        const gravity = 1.0 - p; 
        
        // Swirl increases as gravity pulls them in
        const orbitSpeed = data.speed[i] * (1.0 + p * 8.0); // Spin 8x faster near center
        const angle = t * orbitSpeed + data.phase[i];
        
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        // Rotate (Orbiting Y axis for accretion look mostly, but full 3D)
        // Let's do 3D rotation based on spherical coords if we wanted correct orbits, 
        // but simple Y-axis spin looks cool for an accretion disk forming.
        // Actually since they are initialized spherically, Y-rotation rotates the whole sphere.
        
        // Apply rotation to initial vector
        let rx = (ix * cos - iz * sin);
        let rz = (ix * sin + iz * cos);
        let ry = iy;
        
        // Apply Gravity (Scale down towards 0,0,0)
        // Add some noise to Y to flatten into a disk?
        // Let's flatten them into a disk as they approach! 
        // flattenFactor goes 1 -> 0.1
        const flatten = 1.0 - (p * 0.9);
        
        let tx = rx * gravity;
        let ty = ry * gravity * flatten; // Flatten into disk
        let tz = rz * gravity;
        
        // 2. Explosion
        // If exploded, push OUT from center violently
        if (explodeRef.current > 0) {
            const blast = 60.0 * explodeRef.current;
            
            // Blast direction: 
            // If they are near center, blast outwards randomly or along their current trajectory?
            // Let's use their Initial Position for direction to scatter them back out to universe
            // or just random direction.
            
            // Let's use a stored random direction to save compute? 
            // Or just use initial pos normalized.
            const blastDirX = ix; 
            const blastDirY = iy; 
            const blastDirZ = iz;
            const len = Math.sqrt(blastDirX*blastDirX + blastDirY*blastDirY + blastDirZ*blastDirZ) + 0.0001;
            
            tx += (blastDirX/len) * blast;
            ty += (blastDirY/len) * blast;
            tz += (blastDirZ/len) * blast;
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
        size={0.06} 
        color="#00ffff" 
        transparent 
        opacity={0.6} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ==========================================
// 🎬 SCENE & COMPOSITION
// ==========================================

function Scene({ loadingStep, setTimelineRef }: { loadingStep: number, setTimelineRef: (tl: gsap.core.Timeline) => void }) {
  const { camera } = useThree();
  const orbGroup = useRef<THREE.Group>(null);
  
  const [chromaOffset, setChromaOffset] = useState(new THREE.Vector2(0, 0));
  const [bloomIntensity, setBloomIntensity] = useState(2.0);
  
  useEffect(() => {
    const tl = gsap.timeline({ paused: true });
    setTimelineRef(tl);

     // Phase 1: Accumulation (0-4.0s)
    // Orb scales UP slightly as it feeds
    tl.to(orbGroup.current!.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 3.5, ease: "power1.inOut" }, 0);
    
    // Phase 2: Contraction (3.5s - 4.0s) - The Collapse
    // Supernova/Blackhole collapse
    tl.to(orbGroup.current!.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 0.5, ease: "expo.in" }, 3.5);
    
    // Phase 3: The Drop / Explosion (4.0s)
    tl.to(camera.position, { 
      z: 5, 
      duration: 0.1, 
      ease: "rough({ template: none.out, strength: 2, points: 20, taper: 'none', randomize: true, clamp: false})" 
    }, 3.9);

    tl.play();
    return () => { tl.kill(); };
  }, [camera, setTimelineRef]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (time < 3.5) {
        setChromaOffset(new THREE.Vector2(time * 0.001, 0));
    } else if (time >= 3.5 && time < 4.0) {
        // High distortion before pop
        setChromaOffset(new THREE.Vector2(0.01 + Math.random()*0.005, 0));
    } else {
        setChromaOffset(new THREE.Vector2(0.002, 0.002));
    }
    
    // Bloom
    if (time > 3.8 && time < 4.2) {
        setBloomIntensity(8.0); // SUPER BRIGHT FLASH
    } else {
        // Pulsate bloom
        setBloomIntensity(2.0 + Math.sin(time*10)*0.5);
    }
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />
      
      {/* 💡 LIGHTING */}
      <ambientLight intensity={1} />
      <pointLight position={[5, 0, 5]} intensity={5} color="#00f0ff" />
      <pointLight position={[-5, 0, -5]} intensity={5} color="#7000ff" />
      
      {/* 🌟 NEUTRON STAR */}
      <group ref={orbGroup}>
        <NeutronStar timeline={null} />
      </group>

      {/* ✨ GRAVITY PARTICLES */}
      <ParticleImplosion timeline={null} />

      {/* 🎥 POST PROCESSING */}
      <EffectComposer enableNormalPass={false}>
        <Bloom luminanceThreshold={0.5} mipmapBlur intensity={bloomIntensity} radius={0.8} />
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
  
  useEffect(() => {
    // Total duration 6s
    const t = setTimeout(() => {
      setInternalComplete(true);
      setComplete();
    }, 6000);

    // Flash Overlay (DOM) at 4.0s
    const flashTimer = setTimeout(() => {
        const flashEl = document.getElementById("flash-overlay");
        if (flashEl) {
            flashEl.style.opacity = "1";
            setTimeout(() => { flashEl.style.opacity = "0"; }, 300); // Slower fade out
        }
    }, 4000);

    return () => { clearTimeout(t); clearTimeout(flashTimer); };
  }, [setComplete]);

  if (complete) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <Canvas 
        camera={{ position: [0, 0, 18], fov: 60 }} // Further back start
        gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping }}
      >
        <SceneWrapper />
      </Canvas>
      
      <div 
        id="flash-overlay"
        className="absolute inset-0 bg-white pointer-events-none opacity-0 transition-opacity duration-300 ease-out z-[60]"
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
