"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function SkillGlobe({ skills }: { skills: any[] }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialization
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    // Adjusted camera distance to perfectly frame the globe
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Make radius smaller on phones to prevent clipping
    const radius = width < 768 ? 90 : 130;
    // 32 longitudinal segments, 24 latitudinal for dense, elegant wireframe
    const geometry = new THREE.SphereGeometry(radius, 32, 24);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x999999, 
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    
    const globe = new THREE.Mesh(geometry, material);
    
    // Tilt globe to Earth's exact axial tilt
    globe.rotation.z = (23.5 * Math.PI) / 180;
    scene.add(globe);

    const getSkillBrand = (name: string) => {
      if (name.includes("C++")) return { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg", color: 0x00599C };
      if (name.includes("Go")) return { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg", color: 0x00ADD8 };
      if (name.includes("TypeScript") || name.includes("React")) return { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg", color: 0x3178C6 };
      if (name.includes("Rust")) return { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg", color: 0xDEA584 }; 
      if (name.includes("Python")) return { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg", color: 0x3776AB };
      return { url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg", color: 0x4EAA25 };
    };

    // Create dummy objects to track node positions precisely on the sphere surface
    const dummyNodes = skills.map((skill, i) => {
      const brand = getSkillBrand(skill.name);
      
      // Even distribution using Fibonacci sphere mapping
      const phi = Math.acos(1 - (2 * i + 1) / skills.length);
      const theta = i * Math.PI * (1 + Math.sqrt(5));
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      const mesh = new THREE.Mesh();
      mesh.position.set(x, y, z);
      globe.add(mesh);

      // Orbital colored line trailing the skill
      const trailPoints = [];
      const trailLength = 25;
      for (let j = 0; j < trailLength; j++) {
        // Trail backwards along longitude
        const trailTheta = theta - (j * Math.PI / 180 * 2.5);
        const tx = radius * Math.sin(phi) * Math.cos(trailTheta);
        const ty = radius * Math.cos(phi);
        const tz = radius * Math.sin(phi) * Math.sin(trailTheta);
        trailPoints.push(new THREE.Vector3(tx, ty, tz));
      }
      
      const trailGeometry = new THREE.BufferGeometry().setFromPoints(trailPoints);
      const trailMaterial = new THREE.LineBasicMaterial({ 
        color: brand.color,
        transparent: true,
        opacity: 0.6
      });
      const trail = new THREE.Line(trailGeometry, trailMaterial);
      globe.add(trail);

      return { mesh, brand };
    });

    // Interaction variables
    let isDragging = false;
    let previousX = 0;
    const autoRotateSpeed = 0.002;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousX = e.clientX;
      if (mountRef.current) mountRef.current.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousX;
      previousX = e.clientX;
      globe.rotation.y += deltaX * 0.005;
    };

    const onPointerUp = () => {
      isDragging = false;
      if (mountRef.current) mountRef.current.style.cursor = 'grab';
    };

    // Listeners directly on the renderer for precise capture
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize handling to keep globe aspect ratio correct
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    });
    resizeObserver.observe(mountRef.current);

    // Animation loop
    let animationFrameId: number;

    const animate = () => {
      if (!isDragging) {
        globe.rotation.y += autoRotateSpeed;
      }

      // Update globe matrix so child dummy nodes update their world positions
      globe.updateMatrixWorld();
      
      dummyNodes.forEach(({ mesh }, i) => {
         const worldPos = new THREE.Vector3();
         mesh.getWorldPosition(worldPos);
         const isBack = worldPos.z < 0; // Negative Z means it's rotated to the back hemisphere
         
         // Project 3D coordinate to 2D screen coordinate
         worldPos.project(camera);
         
         const halfWidth = mountRef.current!.clientWidth / 2;
         const halfHeight = mountRef.current!.clientHeight / 2;
         
         const x = (worldPos.x * halfWidth) + halfWidth;
         const y = -(worldPos.y * halfHeight) + halfHeight;
         
         // Directly mutate DOM for extreme performance without React re-renders
         const label = labelsRef.current[i];
         if (label) {
           label.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0)`;
           
           if (isBack) {
             label.style.opacity = '0.15';
             label.style.transform += ' scale(0.75)';
             label.style.filter = 'blur(3px)';
             label.style.zIndex = '0';
           } else {
             label.style.opacity = '1';
             label.style.transform += ' scale(1)';
             label.style.filter = 'none';
             label.style.zIndex = '10';
           }
         }
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [skills]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex justify-center items-center my-8 select-none">
      <div 
        ref={mountRef} 
        className="absolute inset-0 touch-none cursor-grab" 
      />
      {/* HTML Labels overlay mapped to 3D coordinates */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {skills.map((skill, i) => (
          <div
            key={i}
            ref={el => { labelsRef.current[i] = el; }}
            className="absolute top-0 left-0 transition-[opacity,filter,transform] duration-[250ms] ease-out pointer-events-auto"
            style={{ willChange: "transform, opacity, filter" }}
          >
            {/* Sleek, high-performance card design matching reference */}
            <div 
              className="pl-2 pr-4 py-1.5 rounded-full flex items-center justify-center gap-2"
              style={{
                background: "rgba(10, 15, 12, 0.75)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)"
              }}
            >
              {/* Dynamic Skill Icon */}
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255, 255, 255, 0.9)" }}
              >
                <img 
                  src={
                    skill.name.includes("C++") ? "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" :
                    skill.name.includes("Go") ? "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg" :
                    skill.name.includes("TypeScript") || skill.name.includes("React") ? "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" :
                    skill.name.includes("Rust") ? "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg" :
                    skill.name.includes("Python") ? "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" :
                    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg"
                  }
                  alt={skill.name}
                  className="w-4 h-4 object-contain"
                />
              </div>
              <span 
                className="text-xs font-bold tracking-[0.1em] uppercase whitespace-nowrap"
                style={{ 
                  color: "rgba(255, 255, 255, 0.95)",
                  fontFamily: "var(--font-jetbrains-mono), monospace"
                }}
              >
                {skill.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
