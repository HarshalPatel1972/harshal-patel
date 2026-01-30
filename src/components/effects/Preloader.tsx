"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import { usePreloader } from "@/lib/preloader-context";

/**
 * Physics-Accurate Glass Breaking Preloader
 * 
 * Based on forensic glass fracture mechanics:
 * 1. Radial cracks shoot outward from impact (first)
 * 2. Concentric cracks form connecting radials (second)
 * 3. Triangular shards form between crack intersections
 * 4. Shards fall progressively, revealing website behind
 */
export function Preloader() {
  const { setComplete } = usePreloader();
  const [phase, setPhase] = useState<"video" | "cracking" | "done">("video");
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.currentTime > 3.0 && phase === "video") {
      video.pause();
      setPhase("cracking");
    }
  };

  const handleVideoEnd = () => {
    if (phase === "video") setPhase("cracking");
  };

  const handleGlassComplete = () => {
    setPhase("done");
    setComplete();
  };

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-50">
      <AnimatePresence>
        {phase === "video" && (
          <motion.div
            className="absolute inset-0 bg-black"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "brightness(0.8)" }}
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

      {phase === "cracking" && (
        <PhysicsGlassBreak onComplete={handleGlassComplete} />
      )}
    </div>
  );
}

interface PhysicsGlassBreakProps {
  onComplete: () => void;
}

/**
 * Physics-based glass fracture animation
 */
function PhysicsGlassBreak({ onComplete }: PhysicsGlassBreakProps) {
  const [showRadialCracks, setShowRadialCracks] = useState(false);
  const [showConcentricCracks, setShowConcentricCracks] = useState(false);
  const [showShards, setShowShards] = useState(false);
  const [fallenShards, setFallenShards] = useState<Set<number>>(new Set());

  // Timing sequence
  useEffect(() => {
    // Phase 1: Flash + Radial cracks (immediate)
    setShowRadialCracks(true);

    // Phase 2: Concentric cracks (after radials start)
    const concentricTimer = setTimeout(() => {
      setShowConcentricCracks(true);
    }, 200);

    // Phase 3: Shards become visible and start falling
    const shardsTimer = setTimeout(() => {
      setShowShards(true);
    }, 400);

    // Phase 4: Complete
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(concentricTimer);
      clearTimeout(shardsTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Generate crack geometry
  const numRadialCracks = 14;
  const numConcentricRings = 5;
  const impactX = 50; // Center of screen (%)
  const impactY = 50;

  // Generate radial crack lines
  const radialCracks = useMemo(() => {
    return Array.from({ length: numRadialCracks }, (_, i) => {
      const baseAngle = (i / numRadialCracks) * 360;
      // Add slight randomness to angle
      const angle = baseAngle + (Math.random() - 0.5) * 15;
      const length = 48 + Math.random() * 5; // Almost to edge
      
      // Create jagged path points
      const segments = 4;
      const points = [{ x: impactX, y: impactY }];
      
      for (let s = 1; s <= segments; s++) {
        const progress = s / segments;
        const dist = length * progress;
        // Add small perpendicular offset for jagged effect
        const perpOffset = (Math.random() - 0.5) * 3;
        const perpAngle = angle + 90;
        
        const x = impactX + 
          Math.cos((angle * Math.PI) / 180) * dist +
          Math.cos((perpAngle * Math.PI) / 180) * perpOffset;
        const y = impactY + 
          Math.sin((angle * Math.PI) / 180) * dist +
          Math.sin((perpAngle * Math.PI) / 180) * perpOffset;
        
        points.push({ x, y });
      }
      
      return {
        id: i,
        angle,
        points,
        delay: i * 0.015, // Stagger crack appearance
      };
    });
  }, []);

  // Generate concentric crack arcs
  const concentricCracks = useMemo(() => {
    const cracks: Array<{
      id: string;
      ring: number;
      startAngle: number;
      endAngle: number;
      radius: number;
      delay: number;
    }> = [];

    for (let ring = 1; ring <= numConcentricRings; ring++) {
      const radius = (ring / numConcentricRings) * 45;
      // Create arc segments between radial cracks
      for (let i = 0; i < numRadialCracks; i++) {
        const startAngle = radialCracks[i].angle;
        const endAngle = radialCracks[(i + 1) % numRadialCracks].angle;
        
        cracks.push({
          id: `${ring}-${i}`,
          ring,
          startAngle,
          endAngle: endAngle < startAngle ? endAngle + 360 : endAngle,
          radius,
          delay: 0.15 + ring * 0.08 + i * 0.01,
        });
      }
    }
    return cracks;
  }, [radialCracks]);

  // Generate triangular shards (between radial and concentric cracks)
  const shards = useMemo(() => {
    const result: Array<{
      id: number;
      points: string;
      centerX: number;
      centerY: number;
      fallDelay: number;
      fallAngle: number;
      fallDistance: number;
      rotation: number;
    }> = [];

    let shardId = 0;

    for (let ring = 0; ring < numConcentricRings; ring++) {
      const innerRadius = ring === 0 ? 2 : (ring / numConcentricRings) * 45;
      const outerRadius = ((ring + 1) / numConcentricRings) * 45;

      for (let i = 0; i < numRadialCracks; i++) {
        const angle1 = radialCracks[i].angle;
        const angle2 = radialCracks[(i + 1) % numRadialCracks].angle;
        const midAngle = (angle1 + (angle2 < angle1 ? angle2 + 360 : angle2)) / 2;

        // Calculate 4 corners of the shard (trapezoid)
        const p1 = {
          x: impactX + Math.cos((angle1 * Math.PI) / 180) * innerRadius,
          y: impactY + Math.sin((angle1 * Math.PI) / 180) * innerRadius,
        };
        const p2 = {
          x: impactX + Math.cos((angle1 * Math.PI) / 180) * outerRadius,
          y: impactY + Math.sin((angle1 * Math.PI) / 180) * outerRadius,
        };
        const p3 = {
          x: impactX + Math.cos((angle2 * Math.PI) / 180) * outerRadius,
          y: impactY + Math.sin((angle2 * Math.PI) / 180) * outerRadius,
        };
        const p4 = {
          x: impactX + Math.cos((angle2 * Math.PI) / 180) * innerRadius,
          y: impactY + Math.sin((angle2 * Math.PI) / 180) * innerRadius,
        };

        const centerX = (p1.x + p2.x + p3.x + p4.x) / 4;
        const centerY = (p1.y + p2.y + p3.y + p4.y) / 4;

        // Fall direction: outward from center + downward (gravity)
        const distFromCenter = Math.sqrt(
          Math.pow(centerX - impactX, 2) + Math.pow(centerY - impactY, 2)
        );

        result.push({
          id: shardId++,
          points: `${p1.x}% ${p1.y}%, ${p2.x}% ${p2.y}%, ${p3.x}% ${p3.y}%, ${p4.x}% ${p4.y}%`,
          centerX,
          centerY,
          // Inner shards fall first (pushed by impact), then cascade outward
          fallDelay: 0.5 + ring * 0.25 + Math.random() * 0.3,
          fallAngle: midAngle,
          fallDistance: 30 + Math.random() * 40,
          rotation: (Math.random() - 0.5) * 180,
        });
      }
    }

    return result;
  }, [radialCracks]);

  // Handle shard falling
  const handleShardFall = (shardId: number) => {
    setFallenShards((prev) => new Set([...prev, shardId]));
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Impact flash */}
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none"
        style={{ zIndex: 100 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ duration: 0.12, ease: "easeOut" }}
      />

      {/* Glass overlay - blocks view until shards fall */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(20,20,30,0.98) 0%, rgba(10,10,15,0.99) 100%)",
          zIndex: 10,
        }}
      />

      {/* SVG Crack Pattern */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ zIndex: 30 }}
      >
        {/* Radial cracks */}
        {showRadialCracks &&
          radialCracks.map((crack) => (
            <motion.path
              key={`radial-${crack.id}`}
              d={`M ${crack.points.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="0.15"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 0.15,
                delay: crack.delay,
                ease: "easeOut",
              }}
            />
          ))}

        {/* Concentric cracks */}
        {showConcentricCracks &&
          concentricCracks.map((crack) => {
            const startRad = (crack.startAngle * Math.PI) / 180;
            const endRad = (crack.endAngle * Math.PI) / 180;
            const x1 = impactX + Math.cos(startRad) * crack.radius;
            const y1 = impactY + Math.sin(startRad) * crack.radius;
            const x2 = impactX + Math.cos(endRad) * crack.radius;
            const y2 = impactY + Math.sin(endRad) * crack.radius;
            const largeArc = crack.endAngle - crack.startAngle > 180 ? 1 : 0;

            return (
              <motion.path
                key={`concentric-${crack.id}`}
                d={`M ${x1} ${y1} A ${crack.radius} ${crack.radius} 0 ${largeArc} 1 ${x2} ${y2}`}
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="0.12"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.1,
                  delay: crack.delay,
                  ease: "easeOut",
                }}
              />
            );
          })}

        {/* Impact point */}
        <motion.circle
          cx={impactX}
          cy={impactY}
          r="0.8"
          fill="white"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 2, 1], opacity: [1, 1, 0.5] }}
          transition={{ duration: 0.2 }}
        />
      </svg>

      {/* Falling shards */}
      {showShards &&
        shards.map((shard) => (
          <FallingShard
            key={shard.id}
            shard={shard}
            onFall={() => handleShardFall(shard.id)}
            hasFallen={fallenShards.has(shard.id)}
          />
        ))}
    </div>
  );
}

interface FallingShardProps {
  shard: {
    id: number;
    points: string;
    centerX: number;
    centerY: number;
    fallDelay: number;
    fallAngle: number;
    fallDistance: number;
    rotation: number;
  };
  onFall: () => void;
  hasFallen: boolean;
}

function FallingShard({ shard, onFall, hasFallen }: FallingShardProps) {
  const [isFalling, setIsFalling] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFalling(true);
      onFall();
    }, shard.fallDelay * 1000);
    return () => clearTimeout(timer);
  }, [shard.fallDelay, onFall]);

  // Calculate fall trajectory (outward + down due to gravity)
  const fallX = Math.cos((shard.fallAngle * Math.PI) / 180) * shard.fallDistance;
  const fallY = Math.sin((shard.fallAngle * Math.PI) / 180) * shard.fallDistance + 60; // Add gravity

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        clipPath: `polygon(${shard.points})`,
        // Glass appearance
        background: isFalling
          ? "transparent"
          : "linear-gradient(135deg, rgba(180,190,220,0.85) 0%, rgba(140,150,180,0.9) 50%, rgba(160,170,200,0.85) 100%)",
        boxShadow: isFalling ? "none" : "inset 0 0 20px rgba(255,255,255,0.15)",
        zIndex: 20,
      }}
      animate={
        isFalling
          ? {
              x: `${fallX}vw`,
              y: `${fallY}vh`,
              rotate: shard.rotation,
              opacity: 0,
              scale: 0.7,
            }
          : {}
      }
      transition={{
        duration: 1.2,
        ease: [0.36, 0, 0.66, -0.56], // Gravity-like curve
      }}
    />
  );
}
