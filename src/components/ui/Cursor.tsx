"use client";

import { useEffect, useState, useRef } from "react";

export default function Cursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  
  const cursorRef = useRef<HTMLDivElement>(null);
  const crosshairRef = useRef<HTMLDivElement>(null);
  
  const mouse = useRef({ x: 0, y: 0 });
  const smoothedMouse = useRef({ x: 0, y: 0 });

  // Touch device detection — disable custom cursor entirely on phones/tablets
  useEffect(() => {
    // Avoid calling setState synchronously in an effect
    const checkTouch = () => setIsTouch(window.matchMedia('(pointer: coarse)').matches);
    checkTouch();

    // Listen for media query changes if device orientation/capabilities change
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const listener = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (isTouch) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // ⚡ Bolt: Performance Optimization
      // Removed `window.getComputedStyle(target).cursor === "pointer"`
      // because getComputedStyle forces a synchronous layout calculation (layout thrashing)
      // on every mouseover event, causing severe performance drops.
      // Replaced with class-based and tag-based checks which are basically O(1) DOM operations.
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".interactive") ||
        target.closest(".cursor-pointer") ||
        target.classList.contains("interactive") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    
    // Smooth Animation Loop
    let animationFrameId: number;
    const render = () => {
      // Inertia calculation for cinematic trailing
      smoothedMouse.current.x += (mouse.current.x - smoothedMouse.current.x) * 0.25;
      smoothedMouse.current.y += (mouse.current.y - smoothedMouse.current.y) * 0.25;

      if (cursorRef.current && crosshairRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
        crosshairRef.current.style.transform = `translate3d(${smoothedMouse.current.x}px, ${smoothedMouse.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, isTouch]);

  if (isTouch) return null;

  return (
    <>
      <style>{`
        body, a, button, input, textarea, select {
          cursor: none !important;
        }
      `}</style>

      
      {/* The Exact Center Dot - Instant Tracking */}
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[1000000] mix-blend-difference transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* The Inertia Reticle - Trailing Tracking */}
      <div 
        ref={crosshairRef}
        className={`fixed top-0 left-0 flex items-center justify-center pointer-events-none z-[999999] mix-blend-difference transition-all duration-300 ease-out transform -translate-x-1/2 -translate-y-1/2 ${isVisible ? 'opacity-100' : 'opacity-0'} ${
          isHovering ? "w-16 h-16" : "w-10 h-10"
        }`}
      >
        {/* Violent Spin on Hover */}
        <div className={`relative w-full h-full border-[1.5px] border-white/80 transition-transform duration-500 ease-in-out ${isHovering ? "scale-100 rounded-sm rotate-45" : "scale-100 rounded-full rotate-0"}`}>
          {/* Sniper Crosshairs */}
          <div className={`absolute top-0 bottom-0 left-1/2 w-[1px] bg-white -translate-x-1/2 transition-all duration-500 ${isHovering ? "h-full opacity-100" : "h-0 opacity-0"}`} />
          <div className={`absolute left-0 right-0 top-1/2 h-[1px] bg-white -translate-y-1/2 transition-all duration-500 ${isHovering ? "w-full opacity-100" : "w-0 opacity-0"}`} />
          
          {/* Tactical Red Accent */}
          <div className={`absolute -top-1 -right-1 w-2 h-2 bg-[#d91111] transition-opacity duration-300 ${isHovering ? "opacity-100" : "opacity-0"}`} />
        </div>
      </div>
    </>
  );
}
