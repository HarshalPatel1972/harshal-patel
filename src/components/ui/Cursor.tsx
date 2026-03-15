"use client";

import { useEffect, useState, useRef } from "react";

export default function Cursor() {
  const [isTouch, setIsTouch] = useState(false);
  const bladeRef = useRef<HTMLDivElement>(null);
  const slashRef = useRef<HTMLDivElement>(null);
  
  const mouse = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const velocityBuffer = useRef<number[]>([]);
  const currentAngle = useRef(0);
  const isHovering = useRef(false);
  const isMouseDown = useRef(false);
  const slashVisible = useRef(false);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    const checkTouch = () => {
      const isTd = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouch(isTd);
      return isTd;
    };

    if (checkTouch()) return;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = !!(
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("interactive") ||
        window.getComputedStyle(target).cursor === "pointer"
      );
      isHovering.current = interactive;
    };

    const onMouseDown = () => {
      isMouseDown.current = true;
      if (slashRef.current) {
        slashRef.current.style.left = `${mouse.current.x}px`;
        slashRef.current.style.display = 'block';
        slashVisible.current = true;
        
        // Blade color and compression are handled in render loop via isMouseDown and slashVisible
        setTimeout(() => {
          if (slashRef.current) slashRef.current.style.display = 'none';
          slashVisible.current = false;
        }, 150);
      }
    };

    const onMouseUp = () => {
      isMouseDown.current = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    let animationFrameId: number;

    const render = () => {
      const now = Date.now();
      const dx = mouse.current.x - prevMouse.current.x;
      const dy = mouse.current.y - prevMouse.current.y;
      const velocity = Math.hypot(dx, dy);

      velocityBuffer.current.push(velocity);
      if (velocityBuffer.current.length > 5) velocityBuffer.current.shift();
      const avgVelocity = velocityBuffer.current.reduce((a, b) => a + b) / velocityBuffer.current.length;

      // Calculate Target Angle
      let targetAngle = 0;
      if (isHovering.current) {
        targetAngle = 0;
      } else if (avgVelocity > 1.5) {
        targetAngle = Math.atan2(dy, dx) + Math.PI / 2;
      } else {
        targetAngle = 0;
      }

      // Shortest path interpolation (angle wrap-around)
      let diff = targetAngle - currentAngle.current;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      currentAngle.current += diff * 0.35;

      prevMouse.current = { ...mouse.current };

      if (bladeRef.current) {
        const blade = bladeRef.current;
        const leftLine = blade.querySelector('.blade-left') as HTMLDivElement;
        const rightLine = blade.querySelector('.blade-right') as HTMLDivElement;
        
        // Blade transform
        blade.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%) rotate(${currentAngle.current}rad)`;

        if (slashVisible.current) {
          // Slash Active: Blood Red, Compressed
          blade.style.color = '#d91111'; // Not used but for logic consistency
          leftLine.style.backgroundColor = '#d91111';
          rightLine.style.backgroundColor = '#d91111';
          leftLine.style.height = '4px';
          rightLine.style.height = '4px';
          leftLine.style.width = '1px';
          rightLine.style.width = '1px';
          leftLine.style.transform = 'translateX(0)';
          rightLine.style.transform = 'translateX(0)';
        } else if (isHovering.current) {
          // Hover: Cursed Cyan, Split
          leftLine.style.backgroundColor = '#0ee0c3';
          rightLine.style.backgroundColor = '#0ee0c3';
          leftLine.style.height = '14px';
          rightLine.style.height = '14px';
          leftLine.style.width = '1px';
          rightLine.style.width = '1px';
          leftLine.style.transform = 'translateX(-3.5px)';
          rightLine.style.transform = 'translateX(3.5px)';
        } else {
          // Idle/Movement: Bone, Single
          leftLine.style.backgroundColor = '#E8E8E6';
          rightLine.style.backgroundColor = '#E8E8E6';
          leftLine.style.height = '18px';
          rightLine.style.height = '18px';
          leftLine.style.width = '0.75px'; // Together they make 1.5px
          rightLine.style.width = '0.75px';
          leftLine.style.transform = 'translateX(0)';
          rightLine.style.transform = 'translateX(0)';
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <style>{`
        body, a, button, input, textarea, select, * {
          cursor: none !important;
        }
      `}</style>

      {/* Vertical Slash */}
      <div 
        ref={slashRef}
        style={{
          position: 'fixed',
          top: 0,
          width: '1.5px',
          height: '100vh',
          backgroundColor: '#d91111',
          zIndex: 9998,
          pointerEvents: 'none',
          display: 'none'
        }}
      />

      {/* Blade Cursor */}
      <div 
        ref={bladeRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '18px',
          height: '18px',
          zIndex: 10000,
          pointerEvents: 'none',
          mixBlendMode: 'difference',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform'
        }}
      >
        <div 
          className="blade-left"
          style={{
            position: 'absolute',
            width: '0.75px',
            height: '18px',
            backgroundColor: '#E8E8E6',
            transition: 'height 150ms, transform 150ms, background-color 150ms'
          }}
        />
        <div 
          className="blade-right"
          style={{
            position: 'absolute',
            width: '0.75px',
            height: '18px',
            backgroundColor: '#E8E8E6',
            transition: 'height 150ms, transform 150ms, background-color 150ms'
          }}
        />
      </div>
    </>
  );
}
