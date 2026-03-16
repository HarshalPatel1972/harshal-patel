"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { animate as anime } from "animejs";

type NavItem = {
  id: string;
  label: string;
  percent: number;
};

type NavItems = {
  [key in "en" | "ja" | "ko" | "zh-tw"]: NavItem[];
};

const NAV_ITEMS: NavItems = {
  en: [
    { id: "hero", label: "HOME", percent: 5 },
    { id: "projects", label: "WORK", percent: 33 },
    { id: "about", label: "ORIGIN", percent: 65 },
    { id: "contact", label: "CONTACT", percent: 95 },
  ],
  ja: [
    { id: "hero", label: "始", percent: 5 },
    { id: "projects", label: "作", percent: 33 },
    { id: "about", label: "源", percent: 65 },
    { id: "contact", label: "連絡", percent: 95 },
  ],
  ko: [
    { id: "hero", label: "시작", percent: 5 },
    { id: "projects", label: "작업", percent: 33 },
    { id: "about", label: "기원", percent: 65 },
    { id: "contact", label: "연락", percent: 95 },
  ],
  "zh-tw": [
    { id: "hero", label: "首頁", percent: 5 },
    { id: "projects", label: "作品", percent: 33 },
    { id: "about", label: "關於", percent: 65 },
    { id: "contact", label: "聯繫", percent: 95 },
  ]
};

type DotMode = 'LOCKED' | 'CHARGING' | 'RELEASED';

export function Navbar() {
  const { language } = useLanguage();
  const currentNavItems = NAV_ITEMS[language];
  const [active, setActive] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const pathname = usePathname();

  // --- MOBILE PHYSICS EASTER EGG STATE ---
  const [dotMode, setDotMode] = useState<DotMode>('LOCKED');
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });
  const [dotScale, setDotScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  
  const chargeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const physicsRef = useRef<{ vx: number, vy: number, x: number, y: number }>({ vx: 0, vy: 0, x: 0, y: 0 });
  const lastTouchRef = useRef<{ x: number, y: number, time: number }>({ x: 0, y: 0, time: 0 });
  const rafRef = useRef<number | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const progress = maxScroll > 0 ? (currentScrollY / maxScroll) * 100 : 0;
          
          setScrollProgress(progress);
          
          const speed = Math.abs(currentScrollY - lastScrollY);
          setScrollSpeed(Math.min(speed, 99));
          lastScrollY = currentScrollY;

          const sections = currentNavItems.map((item) => ({
            id: item.id,
            el: document.getElementById(item.id),
          }));

          for (let i = sections.length - 1; i >= 0; i--) {
            const el = sections[i].el;
            if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) {
              setActive(sections[i].id);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const speedInterval = setInterval(() => {
      setScrollSpeed(prev => (prev > 0 ? Math.floor(prev * 0.8) : 0));
    }, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(speedInterval);
    };
  }, [pathname, currentNavItems]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // --- PHYSICS ENGINE ---
  const runPhysics = useCallback(() => {
    if (dotMode !== 'RELEASED' || isDragging) return;

    const friction = 0.985;
    const bounce = -0.8;
    const radius = (8 * dotScale) / 2;
    
    let { x, y, vx, vy } = physicsRef.current;
    
    // Apply velocity
    x += vx;
    y += vy;
    
    // Apply friction
    vx *= friction;
    vy *= friction;

    // Boundary checks
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (x + radius > width) { x = width - radius; vx *= bounce; }
    if (x - radius < 0) { x = radius; vx *= bounce; }
    if (y + radius > height) { y = height - radius; vy *= bounce; }
    if (y - radius < 0) { y = radius; vy *= bounce; }

    // Update refs and state
    physicsRef.current = { x, y, vx, vy };
    setDotPos({ x, y });

    // Check for re-docking if velocity is low and near navbar
    const navbarRect = navbarRef.current?.getBoundingClientRect();
    if (navbarRect && Math.abs(vx) < 1 && Math.abs(vy) < 1) {
       if (x > navbarRect.left) {
         returnToNav();
         return;
       }
    }

    rafRef.current = requestAnimationFrame(runPhysics);
  }, [dotMode, isDragging, dotScale]);

  const returnToNav = useCallback(() => {
    setDotMode('LOCKED');
    setDotScale(1);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    if (dotMode === 'RELEASED' && !isDragging) {
      rafRef.current = requestAnimationFrame(runPhysics);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [dotMode, isDragging, runPhysics]);

  // --- TOUCH HANDLERS ---
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.innerWidth >= 768) return;

    if (dotMode === 'LOCKED') {
      setDotMode('CHARGING');
      setDotScale(1);
      
      let start = 0;
      const duration = 4000;
      
      chargeTimerRef.current = setTimeout(() => {
        // EJECT
        if (dotRef.current) {
          const rect = dotRef.current.getBoundingClientRect();
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          
          physicsRef.current = { x: rect.left + rect.width/2, y: rect.top + rect.height/2, vx: 0, vy: 0 };
          setDotPos({ x: physicsRef.current.x, y: physicsRef.current.y });
          setDotMode('RELEASED');
          
          anime({
            targets: physicsRef.current,
            x: centerX,
            y: centerY,
            duration: 1000,
            easing: 'easeOutElastic(1, .6)',
            update: () => setDotPos({ x: physicsRef.current.x, y: physicsRef.current.y })
          });
        }
      }, duration);

      // Visual scale animation
      anime({
        targets: { s: 1 },
        s: 3,
        duration: duration,
        easing: 'linear',
        update: (anim) => setDotScale(Number(anim.animations[0].currentValue))
      });
    } else if (dotMode === 'RELEASED') {
      const touch = e.touches[0];
      const dist = Math.hypot(touch.clientX - dotPos.x, touch.clientY - dotPos.y);
      
      if (dist < 40) { // Grab radius
        setIsDragging(true);
        lastTouchRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
        
        // Start long-press timer for re-docking
        chargeTimerRef.current = setTimeout(() => {
          returnToNav();
        }, 4000);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dotMode === 'RELEASED' && isDragging) {
      const touch = e.touches[0];
      const now = Date.now();
      const dt = now - lastTouchRef.current.time;
      
      if (dt > 0) {
        const vx = (touch.clientX - lastTouchRef.current.x) / (dt / 16);
        const vy = (touch.clientY - lastTouchRef.current.y) / (dt / 16);
        physicsRef.current = { ...physicsRef.current, x: touch.clientX, y: touch.clientY, vx, vy };
      }
      
      setDotPos({ x: touch.clientX, y: touch.clientY });
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY, time: now };

      // If dragged back to nav area, re-dock
      const navbarRect = navbarRef.current?.getBoundingClientRect();
      if (navbarRect && touch.clientX > navbarRect.left) {
        returnToNav();
      }
    }
  };

  const handleTouchEnd = () => {
    if (chargeTimerRef.current) clearTimeout(chargeTimerRef.current);
    
    if (dotMode === 'CHARGING') {
      setDotMode('LOCKED');
      setDotScale(1);
      anime.remove({ s: 1 }); // Stop scale anim
    } else if (dotMode === 'RELEASED') {
      setIsDragging(false);
    }
  };

  return (
    <>
      <nav 
        ref={navbarRef}
        className="fixed right-0 top-0 bottom-0 z-50 w-12 md:w-16 bg-white border-l border-[var(--bg-ink)]/10 flex flex-col justify-between items-center py-4 md:py-8 overflow-hidden touch-none"
        style={{ userSelect: 'none' }}
      >
        
        {/* TOP BRAND INDICATOR */}
        <div className="flex flex-col items-center gap-4 z-20">
          <div className="w-11 h-11 flex items-center justify-center mr-[4px]">
            <a href="#" className="w-9 h-9 md:w-11 md:h-11 bg-black flex items-center justify-center shrink-0 cursor-pointer brutal-shadow-sm border border-white/5 group overflow-hidden">
              <img 
                src="/icon.png" 
                alt="HP Logo" 
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
              />
            </a>
          </div>
        </div>

        <div className="relative flex-1 w-full my-6 flex flex-col items-center justify-between">
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-[var(--bg-ink)]/10" />
          
          <div className="absolute inset-0 flex flex-col justify-between py-[10%] opacity-40 pointer-events-none">
             {Array.from({ length: 20 }).map((_, i) => (
               <div key={i} className={`w-full flex ${i % 5 === 0 ? "justify-center" : "justify-start pl-2"}`}>
                 <div className={`h-[1px] bg-[var(--bg-ink)] ${i % 5 === 0 ? "w-6" : "w-3"}`} />
               </div>
             ))}
          </div>

          {/* DYNAMIC PHYSICS DOT */}
          <div 
            ref={dotRef}
            className={`flex items-center justify-center z-[100] cursor-grab active:cursor-grabbing ${dotMode !== 'LOCKED' ? 'fixed' : 'absolute left-0 right-0'}`}
            style={{ 
              top: dotMode === 'RELEASED' ? dotPos.y : `${scrollProgress}%`,
              left: dotMode === 'RELEASED' ? dotPos.x : '0',
              right: dotMode === 'RELEASED' ? 'auto' : '0',
              transform: dotMode === 'RELEASED' ? `translate(-50%, -50%)` : `translateY(-50%)`,
              transition: isDragging ? 'none' : dotMode === 'RELEASED' ? 'none' : "top 0.1s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
              height: dotMode === 'RELEASED' ? `${8 * dotScale}px` : `${8 + (scrollSpeed * 0.5)}px`,
              width: dotMode === 'RELEASED' ? `${8 * dotScale}px` : '100%',
              pointerEvents: 'auto',
              touchAction: 'none'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="bg-[var(--accent-blood)] shadow-[0_0_15px_rgba(217,17,17,0.8)] rounded-full transition-all duration-200"
              style={{
                width: dotMode === 'RELEASED' ? '100%' : `${ Math.max(4, 8 - (scrollSpeed * 0.05)) }px`,
                height: '100%',
              }}
            />
          </div>

          <div className="flex flex-col justify-between w-full h-full relative z-20 pointer-events-none">
            {currentNavItems.map((item) => {
              const isActive = active === item.id;

              return (
                <a
                  key={item.id}
                  href={item.id === 'hero' ? '#' : `#${item.id}`}
                  className="pointer-events-auto absolute w-full group py-4 flex flex-col items-center transition-all duration-300"
                  style={{ top: `${item.percent}%`, transform: `translateY(-50%)` }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick(item.id);
                  }}
                >
                  <span 
                    className={`font-display font-bold ${language === 'ja' ? 'text-xl md:text-2xl' : 'text-sm md:text-base'} uppercase tracking-widest transition-all duration-300 ${isActive ? "text-[var(--bg-ink)] drop-shadow-[0_0_8px_rgba(5,5,5,0.4)] scale-110" : "text-[var(--bg-ink)]/40 group-hover:text-[var(--bg-ink)]/80"}`} 
                    style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                  >
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 opacity-40 z-20 h-8" />
      </nav>
    </>
  );
}
