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
// 🎨 SHADERS & UTILS
// ==========================================

const vertexShader = `
uniform float uTime;
uniform float uNoiseFreq;
uniform float uNoiseAmp;
varying vec2 vUv;
varying float vDisplacement;

// Classic Perlin Noise 3D
// (Simplified for performance, usually imported or pasted fully)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  vUv = uv;
  
  // Dynamic displacement
  float noise = snoise(position * uNoiseFreq + uTime * 0.5);
  vDisplacement = noise;
  
  vec3 newPos = position + normal * noise * uNoiseAmp;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
varying float vDisplacement;

void main() {
  // Mix colors based on displacement
  float mixStrength = smoothstep(-1.0, 1.0, vDisplacement);
  vec3 color = mix(uColorA, uColorB, mixStrength);
  
  // Add core glow (fresnel-ish)
  float intensity = 1.5;
  color *= intensity;
  
  gl_FragColor = vec4(color, 1.0);
}
`;

// ==========================================
// 🌀 SINGULARITY ORB
// ==========================================

function SingularityOrb({ timeline }: { timeline: gsap.core.Timeline | null }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Initial State: Unstable energy
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uNoiseFreq: { value: 1.5 },
    uNoiseAmp: { value: 0.2 },
    uColorA: { value: new THREE.Color("#00f0ff") }, // Electric Blue
    uColorB: { value: new THREE.Color("#7000ff") }, // Violet
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    // Idle pulsating rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z += 0.002;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

// ==========================================
// ✨ PARTICLE SYSTEM (SPIRAL -> EXPLODE)
// ==========================================

function ParticleImplosion({ timeline }: { timeline: gsap.core.Timeline | null }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 3000;
  
  // Generate initial spiral positions
  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const init = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Spiral Distribution
        const radius = 5 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI; // Spherical distribution
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;

        init[i * 3] = x;
        init[i * 3 + 1] = y;
        init[i * 3 + 2] = z;
    }
    return [pos, init];
  }, []);

  // Use refs for animation state to avoid re-renders
  const progressRef = useRef(0); // 0 = Spiral, 1 = Contracted
  const explodeRef = useRef(0);  // 0 = Normal, 1 = EXPLODED

  useEffect(() => {
    if (!timeline) return;
    
    // GSAP controls these refs via proxy objects
    const proxy = { progress: 0, explode: 0 };
    
    // Phase 1: Spiral In (0s - 1.5s)
    timeline.to(proxy, {
      progress: 1,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => { progressRef.current = proxy.progress; }
    }, 0);

    // Phase 3: Explode (2.5s) - FAST
    timeline.to(proxy, {
      explode: 1,
      duration: 0.8,
      ease: "expo.out",
      delay: 2.5,
      onUpdate: () => { explodeRef.current = proxy.explode; }
    }, 0);

  }, [timeline]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        const x0 = initialPositions[ix];
        const y0 = initialPositions[iy];
        const z0 = initialPositions[iz];

        // 1. SPIRAL MOTION
        // As progress goes 0->1, radius shrinks
        // Also add swirl rotation
        const suction = 1.0 - progressRef.current * 0.95; // Stays at 5% radius at peak
        const swirlSpeed = 2.0 * progressRef.current;
        const angle = time * swirlSpeed + (i * 0.01);
        
        // Apply rotation around Y axis
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        let tx = (x0 * cos - z0 * sin) * suction;
        let tz = (x0 * sin + z0 * cos) * suction;
        let ty = y0 * suction;

        // 2. EXPLOSION
        // If exploded, blast outward
        if (explodeRef.current > 0) {
            const blastRadius = 15.0 * explodeRef.current;
            const dirX = tx === 0 ? Math.random()-0.5 : tx;
            const dirY = ty === 0 ? Math.random()-0.5 : ty;
            const dirZ = tz === 0 ? Math.random()-0.5 : tz;
            
            // Normalize direction approximation
            const len = Math.sqrt(dirX*dirX + dirY*dirY + dirZ*dirZ);
            
            tx += (dirX/len) * blastRadius;
            ty += (dirY/len) * blastRadius;
            tz += (dirZ/len) * blastRadius;
        }

        positions[ix] = tx;
        positions[iy] = ty;
        positions[iz] = tz;
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
        size={0.03}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
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
