"use client";

import { useEffect, useRef, useState, useMemo } from "react";

export function SkillGlobe({ skills }: { skills: any[] }) {
  const radius = 160;
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Drag and animation refs
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentRotation = useRef(0);
  
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    let lastTime = performance.now();
    
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      
      if (!isDragging.current) {
        // Auto-rotate at 12 degrees per second
        currentRotation.current += (12 * delta) / 1000;
        setRotation(currentRotation.current);
      }
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    startX.current = e.clientX;
    // User dragging spins the globe
    currentRotation.current += dx * 0.4;
    setRotation(currentRotation.current);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  };

  const items = useMemo(() => {
    return skills.map((skill, i) => {
      // Fibonacci sphere mapping
      const phi = Math.acos(1 - (2 * i + 1) / skills.length);
      const theta = (i * Math.PI * (1 + Math.sqrt(5)));
      
      // Compress latitude slightly to avoid unreadable text exactly at the poles
      const lat = ((phi * 180) / Math.PI - 90) * 0.75; 
      const lon = (theta * 180) / Math.PI;

      return {
        ...skill,
        lat,
        lon
      };
    });
  }, [skills]);

  return (
    <div 
      className="w-full flex justify-center items-center h-[400px] lg:h-[500px] overflow-hidden my-4"
      style={{ perspective: "1200px" }}
    >
      <div
        ref={containerRef}
        className="relative w-full h-full flex justify-center items-center touch-none cursor-grab"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Globe Axis Tilt Wrapper (Earth tilt 23.5deg, tipped forward slightly for view) */}
        <div 
          className="absolute flex items-center justify-center"
          style={{ 
            transformStyle: "preserve-3d",
            transform: `rotateX(-15deg) rotateZ(23.5deg)` 
          }}
        >
          {/* Central glowing core / Wireframe */}
          <div className="absolute" style={{ transformStyle: "preserve-3d" }}>
            <div 
              className="absolute rounded-full border border-[var(--forge-orange)] opacity-20"
              style={{ width: radius*2, height: radius*2, transform: "translate(-50%, -50%) rotateX(90deg)" }} 
            />
            <div 
              className="absolute rounded-full border border-white opacity-10"
              style={{ width: radius*2, height: radius*2, transform: "translate(-50%, -50%) rotateY(0deg)" }} 
            />
            <div 
              className="absolute rounded-full border border-white opacity-10"
              style={{ width: radius*2, height: radius*2, transform: "translate(-50%, -50%) rotateY(60deg)" }} 
            />
            <div 
              className="absolute rounded-full border border-white opacity-10"
              style={{ width: radius*2, height: radius*2, transform: "translate(-50%, -50%) rotateY(120deg)" }} 
            />
            {/* Axis rod */}
            <div 
              className="absolute bg-[var(--forge-orange)] opacity-40"
              style={{ width: "2px", height: `${radius*2.4}px`, transform: "translate(-50%, -50%)" }}
            />
          </div>

          {/* Rotating Surface (The actual spinning globe) */}
          <div 
            className="absolute flex items-center justify-center"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateY(${rotation}deg)`
            }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                className="absolute flex items-center justify-center whitespace-nowrap"
                style={{
                  transform: `rotateY(${item.lon}deg) rotateX(${item.lat}deg) translateZ(${radius}px)`,
                  // Hides the skill when it rotates to the back of the sphere
                  backfaceVisibility: "hidden",
                }}
              >
                <div 
                  className="px-3 py-1 font-black uppercase tracking-[0.1em]"
                  style={{ 
                    fontFamily: "var(--font-big-shoulders), sans-serif",
                    fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
                    color: "white",
                    textShadow: "0 4px 15px rgba(0,0,0,0.9), 0 0 10px rgba(196, 77, 28, 0.8)",
                  }}
                >
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
