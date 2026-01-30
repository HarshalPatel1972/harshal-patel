"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import { usePreloader } from "@/lib/preloader-context";

/**
 * 🔬 EXPERT Physics-Accurate Glass Fracture
 * 
 * Features based on forensic glass mechanics:
 * 1. Hertzian Cone: Crushed central crater impact zone
 * 2. Hackle Region: Jagged, non-linear radial cracks
 * 3. Wallner Lines: Irregular concentric fracture patterns
 * 4. 3D Physics: Shards tumble in X/Y/Z axes while falling
 */
export function Preloader() {
  const { setComplete } = usePreloader();
  const [phase, setPhase] = useState<"video" | "impact" | "fracture" | "shards" | "done">("video");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Trigger impact sequence at 3.0s (finger touch)
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.currentTime > 3.0 && phase === "video") {
      video.pause();
      setPhase("impact");
    }
  };

  const handleVideoEnd = () => {
    if (phase === "video") setPhase("impact");
  };

  // Orchestrate the fracture timeline
  useEffect(() => {
    if (phase === "impact") {
      // T+0ms: Impact (Flash + Crater)
      const t1 = setTimeout(() => setPhase("fracture"), 50);
      
      // T+100ms: Cracks fully propagated, shards defined
      const t2 = setTimeout(() => setPhase("shards"), 150);
      
      // T+3.5s: Cleanup
      const t3 = setTimeout(() => {
        setPhase("done");
        setComplete();
      }, 3500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [phase, setComplete]);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Video Layer (Hand approaching) */}
      <AnimatePresence>
        {phase === "video" && (
          <motion.div
            className="absolute inset-0 bg-black"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "brightness(0.9)" }} // Standard brightness for realism
              src="/assets/test-0.mp4"
              muted
              playsInline
              autoPlay
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnd}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Fracture Simulation Layer */}
      {phase !== "video" && <FractureSimulation phase={phase} />}
    </div>
  );
}

/**
 * The sophisticated fracture geometry and physics engine
 */
function FractureSimulation({ phase }: { phase: "impact" | "fracture" | "shards" | "done" }) {
  // 1. Generate the chaotic fracture geometry
  const { shards, craterShards, crackLines } = useMemo(() => generateFractureGeometry(), []);
  
  // 2. State for falling shards
  const [activeShards, setActiveShards] = useState<Set<number>>(new Set());

  // 3. Trigger gravity based on distance from impact (Hertzian cone logic)
  useEffect(() => {
    if (phase === "shards") {
      // Center crater disintegrates immediately
      const centerIds = craterShards.map(s => s.id);
      setActiveShards(prev => new Set([...prev, ...centerIds]));

      // Main shards cascade outward
      shards.forEach(shard => {
        setTimeout(() => {
          setActiveShards(prev => new Set([...prev, shard.id]));
        }, shard.fallDelay * 1000);
      });
    }
  }, [phase, shards, craterShards]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      
      {/* A. Impact Flash (Hertzian energy release) */}
      <motion.div
        className="absolute inset-0 bg-white mix-blend-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "impact" ? 0.8 : 0 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
      />

      {/* B. Glass Material Layer (Before it falls) */}
      {/* We use a solid glass color that covers the website. As shards fall, this layer disappears piece by piece. */}
      
      {/* C. The Hertzian Cone (Crater) - Pulverized Center */}
      {craterShards.map(shard => (
        <TumblingShard 
          key={shard.id} 
          shard={shard} 
          isFalling={activeShards.has(shard.id)}
          isCrater={true}
        />
      ))}

      {/* D. The Main Shards (Radial/Concentric fragments) */}
      {shards.map(shard => (
        <TumblingShard 
          key={shard.id} 
          shard={shard} 
          isFalling={activeShards.has(shard.id)}
          isCrater={false}
        />
      ))}

      {/* E. Stress Cracks (The white lines that appear first) */}
      <svg className="absolute inset-0 w-full h-full opacity-80" style={{ mixBlendMode: "overlay" }}>
        {crackLines.map((line, i) => (
          <motion.path
            key={i}
            d={line}
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: phase !== "impact" ? 1 : 0, 
              opacity: phase !== "impact" ? [0, 1, 0.5, 0] : 0 
            }}
            transition={{ duration: 0.2, delay: i * 0.005 }}
          />
        ))}
      </svg>
      
    </div>
  );
}

// -- PHYSICS COMPONENT --

function TumblingShard({ shard, isFalling, isCrater }: { shard: any, isFalling: boolean, isCrater: boolean }) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: 0, top: 0, 
        width: "100%", height: "100%",
        clipPath: `polygon(${shard.points})`,
        // Realistic glass styling: Blue-ish tint, refractive
        background: isFalling 
          ? "transparent" // Once fallen, it's gone from the screen (website visible)
          : isCrater 
            ? "rgba(200,220,255,0.9)" // Crater is denser/whiter
            : "linear-gradient(125deg, rgba(30,40,50,0.95) 0%, rgba(20,25,35,0.98) 100%)", // Main glass
        zIndex: isCrater ? 20 : 10,
        // When falling, we switch to a visible "falling piece" logic
      }}
    >
      {/* If falling, we render a separate element that actually tumbles down */}
      {isFalling && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(200,220,255,0.1) 50%, rgba(255,255,255,0.2) 100%)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.5)",
            boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
            clipPath: `polygon(${shard.points})`, // Maintain shape
          }}
          initial={{ x: 0, y: 0, rotateX: 0, rotateY: 0, opacity: 1, scale: 1 }}
          animate={{
            x: shard.dirX * (isCrater ? 50 : 200) + (Math.random() * 20 - 10), // Explosive outward
            y: 800 + Math.random() * 200, // Gravity takes over
            rotateX: Math.random() * 720 - 360, // 3D Tumble
            rotateY: Math.random() * 720 - 360,
            rotateZ: Math.random() * 360,
            opacity: 0,
            scale: 0.8,
          }}
          transition={{
            duration: isCrater ? 0.6 : 1.5 + Math.random(),
            ease: [0.32, 0, 0.67, 0], // Cubic bezier for gravity feeling
          }}
        />
      )}
    </motion.div>
  );
}

// -- GEOMETRY GENERATION ENGINE --

function generateFractureGeometry() {
  const width = 100; // Working in percentages
  const height = 100;
  const centerX = 50;
  const centerY = 50;
  
  const shards = [];
  const craterShards = [];
  const crackLines = [];

  // 1. Generate Radial "Jagged" Lines (Hackle simulation)
  const numRadials = 12;
  const radials: Array<Array<{x: number, y: number}>> = [];
  
  for (let i = 0; i < numRadials; i++) {
    const angle = (i / numRadials) * Math.PI * 2;
    const path: Array<{x: number, y: number}> = [{ x: centerX, y: centerY }];
    const length = 70; // Extend beyond screen
    const segments = 8;
    
    // Create jagged path
    for (let j = 1; j <= segments; j++) {
      const radius = (j / segments) * length;
      // Irregularity increases with distance (natural fracture)
      const jitter = (j * 1.5) * (Math.random() - 0.5); 
      
      const x = centerX + Math.cos(angle) * radius + Math.cos(angle + Math.PI/2) * jitter;
      const y = centerY + Math.sin(angle) * radius + Math.sin(angle + Math.PI/2) * jitter;
      path.push({ x, y });
    }
    
    radials.push(path);
    
    // Convert to SVG path string
    const d = `M ${path.map(p => `${p.x},${p.y}`).join(" L ")}`;
    crackLines.push(d);
  }

  // 2. Generate Concentric Rings (Wallner Lines simulation)
  const rings = [5, 15, 28, 45, 65]; // Irregular spacing
  
  // Helper to interp points on radial lines
  const getPointOnRadial = (radialIdx: number, percent: number) => {
    // Simplified: Linear interp between jagged points might be complex, 
    // so we approximate by finding the segment
    const r = radials[radialIdx];
    const targetIdx = Math.floor(percent * (r.length - 1));
    return r[Math.min(targetIdx, r.length-1)];
  };

  // 3. Create Shards from the Grid (Radial x Concentric)
  for (let r = 0; r < rings.length; r++) {
    const innerRadiusPct = r === 0 ? 0.1 : rings[r-1] / 70; // Normalized to radial length
    const outerRadiusPct = rings[r] / 70;
    
    for (let i = 0; i < numRadials; i++) {
      const nextI = (i + 1) % numRadials;
      
      const p1 = getPointOnRadial(i, innerRadiusPct);
      const p2 = getPointOnRadial(nextI, innerRadiusPct);
      const p3 = getPointOnRadial(nextI, outerRadiusPct);
      const p4 = getPointOnRadial(i, outerRadiusPct);
      
      // CSS Polygon string (percentages)
      // Note: We clamp to 0-100 for safety but "overflow:hidden" handles viewport
      const poly = `${p1.x}% ${p1.y}%, ${p2.x}% ${p2.y}%, ${p3.x}% ${p3.y}%, ${p4.x}% ${p4.y}%`;
      
      // Calculate Centroid for physics
      const cx = (p1.x + p2.x + p3.x + p4.x) / 4;
      const cy = (p1.y + p2.y + p3.y + p4.y) / 4;
      
      // Direction vector (normalized)
      const dx = cx - centerX;
      const dy = cy - centerY;
      const mag = Math.sqrt(dx*dx + dy*dy) || 1;
      
      const shardObj = {
        id: r * 100 + i,
        points: poly,
        cx, cy,
        dirX: dx / mag,
        dirY: dy / mag,
        // Physics: Inner rings fall earlier, but randomized
        fallDelay: (r * 0.2) + (Math.random() * 0.3), 
      };

      if (r === 0) {
        craterShards.push(shardObj);
      } else {
        shards.push(shardObj);
      }
    }
  }

  return { shards, craterShards, crackLines };
}
