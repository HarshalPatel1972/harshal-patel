"use client";

import { useEffect, useRef, useState } from "react";

export function KnowledgeGraph({ skills }: { skills: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<any[]>([]);
  const draggedNodeRef = useRef<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const skillColors = [
    "#C44D1C", // C++ / Systems
    "#2C5270", // Go (Golang)
    "#905B20", // TypeScript / React
    "#385C46", // Rust / WASM
    "#6D3C8A", // Python / AI
    "#2B6B61", // SQL / Bash
  ];

  // Edges mapping by index
  const edgePairs = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], // Outer ring
    [0, 3], [1, 4], [2, 5] // Cross connections
  ];

  // Initialize nodes only once
  useEffect(() => {
    if (nodesRef.current.length > 0) return;

    const width = containerRef.current?.clientWidth || 500;
    const height = containerRef.current?.clientHeight || 500;
    const cx = width / 2;
    const cy = height / 2;
    
    nodesRef.current = skills.map((s, i) => ({
      id: s.name,
      level: s.level,
      color: skillColors[i % skillColors.length],
      x: cx + (Math.random() - 0.5) * 200,
      y: cy + (Math.random() - 0.5) * 200,
      vx: 0,
      vy: 0,
      mass: s.level / 10,
      radius: Math.max(30, s.level / 2),
    }));
  }, [skills]);

  useEffect(() => {
    let animId: number;
    let isRunning = true;
    
    const simulate = () => {
      if (!isRunning) return;
      const width = containerRef.current?.clientWidth || 500;
      const height = containerRef.current?.clientHeight || 500;
      const cx = width / 2;
      const cy = height / 2;
      const nodes = nodesRef.current;
      
      // Physics Constants
      const K_REPULSION = 10000; // Repel other nodes
      const K_SPRING = 0.04;    // Elasticity of edges
      const SPRING_LENGTH = Math.min(width, height) * 0.28; // Responsive edge length
      const K_GRAVITY = 0.03;   // Pull to center
      const DAMPING = 0.75;      // Damping for stability

      for (let i = 0; i < nodes.length; i++) {
        let fx = 0;
        let fy = 0;
        const n1 = nodes[i];
        
        // Center Gravity
        fx += (cx - n1.x) * K_GRAVITY;
        fy += (cy - n1.y) * K_GRAVITY;
        
        // Repulsion
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const distSq = dx * dx + dy * dy + 1;
          const dist = Math.sqrt(distSq);
          
          // Collision avoidance
          const minD = n1.radius + n2.radius + 15;
          if (dist < minD) {
             const push = (minD - dist) * 1.5;
             fx += (dx / dist) * push;
             fy += (dy / dist) * push;
          }

          const force = K_REPULSION / distSq;
          fx += (dx / dist) * force;
          fy += (dy / dist) * force;
        }

        // Springs
        for (const [a, b] of edgePairs) {
           if (i === a || i === b) {
             const target = i === a ? nodes[b] : nodes[a];
             const dx = target.x - n1.x;
             const dy = target.y - n1.y;
             const dist = Math.sqrt(dx * dx + dy * dy + 1);
             const force = K_SPRING * (dist - SPRING_LENGTH);
             fx += (dx / dist) * force;
             fy += (dy / dist) * force;
           }
        }

        if (draggedNodeRef.current !== n1.id) {
          n1.vx = (n1.vx + fx / n1.mass) * DAMPING;
          n1.vy = (n1.vy + fy / n1.mass) * DAMPING;
        }
      }

      // Apply velocities and Update DOM
      for (const n of nodes) {
        if (draggedNodeRef.current !== n.id) {
          n.x += n.vx;
          n.y += n.vy;
          n.x = Math.max(n.radius + 10, Math.min(width - n.radius - 10, n.x));
          n.y = Math.max(n.radius + 10, Math.min(height - n.radius - 20, n.y));
        }

        const nodeEl = document.getElementById(`node-${n.id.replace(/\s+/g, '-')}`);
        if (nodeEl) {
          nodeEl.setAttribute("transform", `translate(${n.x}, ${n.y})`);
        }
      }

      // Update Edges DOM
      edgePairs.forEach(([a, b], idx) => {
        const lineEl = document.getElementById(`edge-${idx}`);
        if (lineEl && nodes[a] && nodes[b]) {
          lineEl.setAttribute("x1", nodes[a].x.toString());
          lineEl.setAttribute("y1", nodes[a].y.toString());
          lineEl.setAttribute("x2", nodes[b].x.toString());
          lineEl.setAttribute("y2", nodes[b].y.toString());
        }
      });

      animId = requestAnimationFrame(simulate);
    };

    animId = requestAnimationFrame(simulate);
    return () => { isRunning = false; cancelAnimationFrame(animId); };
  }, []);

  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    draggedNodeRef.current = id;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedNodeRef.current) return;
    const n = nodesRef.current.find(n => n.id === draggedNodeRef.current);
    if (n) {
       const rect = containerRef.current?.getBoundingClientRect();
       if (rect) {
         n.x = e.clientX - rect.left;
         n.y = e.clientY - rect.top;
         n.vx = 0;
         n.vy = 0;
       }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggedNodeRef.current) {
      (e.target as Element).releasePointerCapture(e.pointerId);
      draggedNodeRef.current = null;
      setIsDragging(false);
    }
  };

  return (
    <div 
      className="w-full h-full relative touch-none select-none min-h-[400px] overflow-hidden" 
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ cursor: isDragging ? 'grabbing' : 'auto' }}
    >
      <svg className="absolute inset-0 w-full h-full overflow-visible">
        {/* Render Edges */}
        {edgePairs.map((_, i) => (
          <line 
            key={`edge-${i}`} 
            id={`edge-${i}`}
            stroke="rgba(22, 29, 26, 0.2)"
            strokeWidth="3"
            strokeDasharray="4 4"
          />
        ))}

        {/* Render Nodes */}
        {skills.map((s, i) => {
          const color = skillColors[i % skillColors.length];
          const radius = Math.max(30, s.level / 2);
          const safeId = s.name.replace(/\s+/g, '-');
          
          return (
            <g 
              key={s.name} 
              id={`node-${safeId}`}
              onPointerDown={(e) => handlePointerDown(s.name, e)}
              className="cursor-grab active:cursor-grabbing group"
              style={{ transformOrigin: 'center' }}
            >
              {/* Outer Glow / Halo */}
              <circle 
                r={radius + 12} 
                fill={color} 
                opacity="0.1" 
                className="transition-opacity duration-300 group-hover:opacity-30"
              />
              {/* Solid Node */}
              <circle 
                r={radius} 
                fill={color}
                stroke="white"
                strokeWidth="2"
                style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.1))" }}
              />
              {/* Text: Percentage */}
              <text 
                textAnchor="middle" 
                dominantBaseline="middle"
                fill="white"
                fontSize="20"
                fontWeight="900"
                fontFamily="var(--font-big-shoulders), sans-serif"
                className="pointer-events-none"
              >
                {s.level}
              </text>
              {/* Text: Skill Name (shown below node) */}
              <text
                y={radius + 22}
                textAnchor="middle"
                fill="var(--sumi-ink)"
                fontSize="11"
                fontWeight="800"
                letterSpacing="0.1em"
                fontFamily="var(--font-jetbrains-mono), monospace"
                className="pointer-events-none"
                style={{ opacity: 0.85 }}
              >
                {s.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
