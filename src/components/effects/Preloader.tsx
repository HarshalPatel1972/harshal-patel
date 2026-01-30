"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import { usePreloader } from "@/lib/preloader-context";

export function Preloader() {
  const { setComplete } = usePreloader();
  const [phase, setPhase] = useState<"video" | "impact" | "shards" | "done">("video");
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.currentTime > 3.0 && phase === "video") {
      video.pause();
      setPhase("impact");
    }
  };

  useEffect(() => {
    if (phase === "impact") {
      // Immediate Transition: Impact -> Shards
      const t1 = setTimeout(() => setPhase("shards"), 50);
      const t2 = setTimeout(() => {
        setPhase("done");
        setComplete();
      }, 4000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [phase, setComplete]);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Video Layer */}
      <AnimatePresence>
        {phase === "video" && (
          <motion.div className="absolute inset-0 bg-black">
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src="/assets/test-0.mp4"
              muted playsInline autoPlay
              onTimeUpdate={handleTimeUpdate}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Physics Glass Layer */}
      {phase !== "video" && <GlassSimulation phase={phase} />}
    </div>
  );
}

function GlassSimulation({ phase }: { phase: "impact" | "shards" | "done" }) {
  const { shards, crackLines } = useMemo(() => generateChaoticGeometry(), []);
  const [activeShards, setActiveShards] = useState<Set<number>>(new Set());

  // Cascade Logic
  useEffect(() => {
    if (phase === "shards") {
      // Immediate center release
      shards.filter(s => s.ring === 0).forEach(s => setActiveShards(prev => new Set([...prev, s.id])));

      // Cascade rest
      shards.filter(s => s.ring > 0).forEach(s => {
        setTimeout(() => {
          setActiveShards(prev => new Set([...prev, s.id]));
        }, s.fallDelay * 1000);
      });
    }
  }, [phase, shards]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 1. Flash */}
      {phase === "impact" && (
        <motion.div 
          className="absolute inset-0 bg-white z-[100]"
          initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.1 }}
        />
      )}

      {/* 2. Shards */}
      {shards.map(shard => (
        <GlassShard 
          key={shard.id}
          shard={shard}
          isFalling={activeShards.has(shard.id)}
        />
      ))}

      {/* 3. Glowing Cracks (Only visible briefly before falling) */}
      <svg className="absolute inset-0 w-full h-full z-[50]" style={{ mixBlendMode: "screen" }}>
        {crackLines.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="white"
            strokeWidth={Math.random() * 2 + 0.5}
            fill="none"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: [1, 0], pathLength: 1 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </svg>
    </div>
  );
}

function GlassShard({ shard, isFalling }: { shard: any, isFalling: boolean }) {
  return (
    <motion.div
      className="absolute"
      style={{
        inset: 0,
        clipPath: `polygon(${shard.points})`,
        // MATERIAL: Semi-transparent, bright edges, refractive look
        background: isFalling 
          ? "transparent" // Gone when falling (replaced by tumble)
          : "rgba(255, 255, 255, 0.05)", // Subtle tint while static
        border: "1px solid rgba(255,255,255,0.3)", // Subtle crack definition
        zIndex: 10,
      }}
    >
      {/* The Falling 3D Shard */}
      {isFalling && (
        <motion.div
          className="absolute inset-0"
          style={{
            clipPath: `polygon(${shard.points})`,
            // SHARD VISUAL: Sharp, shiny, reflective
            background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(200,230,255,0.1) 50%, rgba(255,255,255,0.3) 100%)",
            boxShadow: "inset 0 0 20px rgba(255,255,255,0.5)", // Inner glow
            backdropFilter: "blur(2px)", // Distortion
          }}
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{
            x: shard.dirX * (100 + Math.random() * 200),
            y: 800 + Math.random() * 300,
            rotateX: Math.random() * 1000,
            rotateY: Math.random() * 1000,
            rotateZ: Math.random() * 360,
            opacity: 0,
          }}
          transition={{ duration: 1.5, ease: [0.32, 0, 0.67, 0] }}
        />
      )}
    </motion.div>
  );
}

// CHAOTIC GEOMETRY GENERATOR
function generateChaoticGeometry() {
  const shards = [];
  const crackLines = [];
  const cx = 50; 
  const cy = 50;

  // 1. Irregular Radials
  // Instead of perfect 360/12, we use random spans
  const radials: Array<Array<{x: number, y: number}>> = [];
  let currentAngle = 0;
  while (currentAngle < 360) {
    const span = 15 + Math.random() * 35; // Random wedge size 15-50 deg
    currentAngle += span;
    const radAngle = (currentAngle * Math.PI) / 180;
    
    // Jagged Line
    const path: Array<{x: number, y: number}> = [{x: cx, y: cy}];
    const len = 80;
    const segs = 6;
    for (let j = 1; j <= segs; j++) {
      const dist = (j/segs) * len;
      // Perpendicular noise
      const perp = radAngle + Math.PI/2;
      const noise = (Math.random() - 0.5) * (j * 2); // Noise increases with distance
      
      path.push({
        x: cx + Math.cos(radAngle) * dist + Math.cos(perp) * noise,
        y: cy + Math.sin(radAngle) * dist + Math.sin(perp) * noise,
      });
    }
    radials.push(path);
    crackLines.push(`M ${path.map(p => `${p.x},${p.y}`).join(" L ")}`);
  }

  // 2. Irregular Rings
  const numRings = 5;
  const rings = [6, 18, 35, 55, 80]; // Base radii
  
  // Helper to interpolate on jagged line
  const getPos = (radIdx: number, pct: number) => {
    const r = radials[radIdx % radials.length];
    const idx = Math.min(Math.floor(pct * (r.length-1)), r.length-2);
    // Return point at index (simplified)
    return r[Math.min(idx < 0 ? 0 : idx, r.length-1)];
  };

  for (let r = 0; r < rings.length; r++) {
    const rPct = rings[r] / 80;
    const prevRPct = r===0 ? 0 : rings[r-1] / 80;
    
    for (let i = 0; i < radials.length; i++) {
      const nextI = (i+1) % radials.length;
      
      const p1 = getPos(i, prevRPct); // Top Left
      const p2 = getPos(nextI, prevRPct); // Top Right
      const p3 = getPos(nextI, rPct); // Bottom Right
      const p4 = getPos(i, rPct); // Bottom Left
      
      // Centroid
      const shCx = (p1.x+p2.x+p3.x+p4.x)/4;
      const shCy = (p1.y+p2.y+p3.y+p4.y)/4;
      
      // Explosion vector
      const dx = shCx - cx;
      const dy = shCy - cy;
      const mag = Math.sqrt(dx*dx + dy*dy) || 1;

      shards.push({
        id: r * 100 + i,
        points: `${p1.x}% ${p1.y}%, ${p2.x}% ${p2.y}%, ${p3.x}% ${p3.y}%, ${p4.x}% ${p4.y}%`,
        dirX: dx/mag,
        dirY: dy/mag,
        ring: r,
        fallDelay: (r * 0.1) + (Math.random() * 0.2), // Chaos timing
      });
    }
  }

  return { shards, crackLines };
}
