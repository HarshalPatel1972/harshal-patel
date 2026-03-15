"use client";

import { useEffect, useState, useRef } from "react";

export default function Cursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [activeCode, setActiveCode] = useState("// browsing...");
  const [hoverRect, setHoverRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [clickLog, setClickLog] = useState<string | null>(null);
  
  const cursorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useEffect(() => {
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.tagName.toLowerCase() === "a" || 
                          target.tagName.toLowerCase() === "button" || 
                          target.closest("a") || 
                          target.closest("button") ||
                          target.classList.contains("interactive");

      if (interactive) {
        setIsHovering(true);
        setActiveCode("onClick={() => {");
        const rect = (target.closest("a") || target.closest("button") || target).getBoundingClientRect();
        setHoverRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
      } else {
        setIsHovering(false);
        setHoverRect(null);
        
        // Detect other tags for the ghost code
        const tag = target.tagName.toLowerCase();
        if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4") {
          setActiveCode(`<${tag}>`);
        } else if (tag === "p" || tag === "span" || tag === "li") {
          setActiveCode("// parsing_content...");
        } else if (tag === "img") {
          setActiveCode("<img />");
        } else {
          setActiveCode("// still thinking...");
        }
      }
    };

    const handleMouseDown = () => {
      setClickLog(`console.log("clicked @ ${mouse.current.x},${mouse.current.y}")`);
      setTimeout(() => setClickLog(null), 1000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isVisible, isTouch]);

  if (isTouch) return null;

  return (
    <>
      <style>{`
        body, a, button, input, textarea, select, * {
          cursor: none !important;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-caret-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>

      {/* 1. SELECTION HIGHLIGHT (VS Code Style) */}
      {isHovering && hoverRect && (
        <div 
          className="fixed pointer-events-none z-[999998] bg-[#264f78]/40 transition-all duration-200 rounded-sm"
          style={{
            top: hoverRect.top - 4,
            left: hoverRect.left - 4,
            width: hoverRect.width + 8,
            height: hoverRect.height + 8,
          }}
        />
      )}

      {/* 2. THE COMPILER CURSOR */}
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 flex items-start pointer-events-none z-[1000000] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ pointerEvents: 'none' }}
      >
        {/* Caret | */}
        <div className={`w-[2px] h-6 bg-[var(--accent-blood)] mr-2 ${isHovering ? '' : 'animate-caret-blink'}`} />
        
        <div className="flex flex-col">
           {/* Code Ghost */}
           <span className="font-mono text-[10px] text-white/40 tracking-tighter whitespace-nowrap bg-black/20 px-1 backdrop-blur-[1px]">
             {activeCode}
           </span>
           
           {/* Click Log Flash */}
           {clickLog && (
             <span className="font-mono text-[9px] text-[var(--accent-cursed)] mt-1 animate-pulse">
               {clickLog}
             </span>
           )}
        </div>
      </div>
    </>
  );
}
