"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage, type Language } from "@/context/LanguageContext";
import { animate as anime } from "animejs";

type NavItem = {
  id: string;
  label: string;
  percent: number;
};

type NavItems = Record<Language, NavItem[]>;

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
  ],
  hi: [
    { id: "hero", label: "प्रारंभ", percent: 5 },
    { id: "projects", label: "कार्य", percent: 33 },
    { id: "about", label: "मूल", percent: 65 },
    { id: "contact", label: "संपर्क", percent: 95 },
  ],
  fr: [
    { id: "hero", label: "ACCUEIL", percent: 5 },
    { id: "projects", label: "TRAVAUX", percent: 33 },
    { id: "about", label: "ORIGINE", percent: 65 },
    { id: "contact", label: "CONTACT", percent: 95 },
  ],
  id: [
    { id: "hero", label: "BERANDA", percent: 5 },
    { id: "projects", label: "KARYA", percent: 33 },
    { id: "about", label: "ASAL", percent: 65 },
    { id: "contact", label: "KONTAK", percent: 95 },
  ],
  de: [
    { id: "hero", label: "START", percent: 5 },
    { id: "projects", label: "PROJEKTE", percent: 33 },
    { id: "about", label: "HERKUNFT", percent: 65 },
    { id: "contact", label: "KONTAKT", percent: 95 },
  ],
  it: [
    { id: "hero", label: "HOME", percent: 5 },
    { id: "projects", label: "LAVORO", percent: 33 },
    { id: "about", label: "ORIGINE", percent: 65 },
    { id: "contact", label: "CONTATTO", percent: 95 },
  ],
  "pt-br": [
    { id: "hero", label: "INÍCIO", percent: 5 },
    { id: "projects", label: "TRABALHO", percent: 33 },
    { id: "about", label: "ORIGEM", percent: 65 },
    { id: "contact", label: "CONTATO", percent: 95 },
  ],
  "es-419": [
    { id: "hero", label: "INICIO", percent: 5 },
    { id: "projects", label: "TRABAJO", percent: 33 },
    { id: "about", label: "ORIGEN", percent: 65 },
    { id: "contact", label: "CONTACTO", percent: 95 },
  ],
  es: [
    { id: "hero", label: "INICIO", percent: 5 },
    { id: "projects", label: "TRABAJO", percent: 33 },
    { id: "about", label: "ORIGEN", percent: 65 },
    { id: "contact", label: "CONTACTO", percent: 95 },
  ]
};

type DotMode = 'LOCKED' | 'CHARGING' | 'RELEASED' | 'CHARGING_RETURN';

export function Navbar() {
  const { language } = useLanguage();
  const currentNavItems = NAV_ITEMS[language];
  const [active, setActive] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const pathname = usePathname();

  const [isBallCyan, setIsBallCyan] = useState(false);
  const [dotMode, setDotMode] = useState<DotMode>('LOCKED');
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });
  const [dotScale, setDotScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [splashPos, setSplashPos] = useState({ x: 0, y: 0 });
  const [docHeight, setDocHeight] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const chargingLogoRef = useRef<boolean>(false);
  const longPressActiveRef = useRef<boolean>(false);
  const chargeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chargeAnimRef = useRef<any>(null);
  const growthAnimRef = useRef<any>(null);
  const physicsRef = useRef<{ vx: number, vy: number, x: number, y: number, scale: number, squish: number }>({ vx: 0, vy: 0, x: 0, y: 0, scale: 1, squish: 1 });
  const lastTouchRef = useRef<{ x: number, y: number, time: number }>({ x: 0, y: 0, time: 0 });
  const rafRef = useRef<number | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLElement>(null);

  const returnToNav = useCallback(() => {
    setDotMode('LOCKED');
    setDotScale(1);
    setIsDragging(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (chargeTimerRef.current) clearTimeout(chargeTimerRef.current);
  }, []);

  // SECTION TRACKING
  useEffect(() => {
    setMounted(true);
    const sectionIds = currentNavItems.map(item => item.id);

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [currentNavItems]);

  // SCROLL PROGRESS
  useEffect(() => {
    let ticking = false;
    let lastScrollY = window.scrollY;
    let speedTimeout: NodeJS.Timeout | null = null;

    const updateScroll = () => {
      if (!navbarRef.current) return;
      
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (currentScrollY / maxScroll) * 100 : 0;
      const speed = Math.min(Math.abs(currentScrollY - lastScrollY), 50);
      
      setScrollProgress(progress);
      setScrollSpeed(speed);
      
      navbarRef.current.style.setProperty('--nav-scroll', `${progress}%`);
      navbarRef.current.style.setProperty('--nav-speed', `${speed}`);
      
      if (speedTimeout) clearTimeout(speedTimeout);
      speedTimeout = setTimeout(() => {
        if (navbarRef.current) {
          navbarRef.current.style.setProperty('--nav-speed', '0');
          setScrollSpeed(0);
        }
      }, 150);

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (speedTimeout) clearTimeout(speedTimeout);
    };
  }, [pathname]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateHeight = () => setDocHeight(document.documentElement.scrollHeight);
    const resizer = new ResizeObserver(updateHeight);
    resizer.observe(document.body);
    updateHeight();
    return () => resizer.disconnect();
  }, []);

  // --- REVERTED PHYSICS ENGINE (EXACT COMMIT a76fb59) ---
  const runPhysics = useCallback(() => {
    if (dotMode !== 'RELEASED' || isDragging) return;
    
    const currentScale = physicsRef.current.scale;
    // SPONGIER PHYSICS
    const friction = 0.985 + ((currentScale - 1) / 3) * 0.012;
    const bounce = -0.95 - ((currentScale - 1) / 3) * 0.05; 
    const radius = (150 * currentScale) / 2;
    
    let { x, y, vx, vy, squish } = physicsRef.current;
    
    x += vx;
    y += vy;
    
    vx *= friction;
    vy *= friction;
    
    const width = window.innerWidth;
    const height = docHeight || document.documentElement.scrollHeight;

    let hit = false;
    if (x + radius > width) { x = width - radius; vx *= bounce; hit = true; }
    if (x - radius < 0) { x = radius; vx *= bounce; hit = true; }
    if (y + radius > height) { y = height - radius; vy *= bounce; hit = true; }
    if (y - radius < 0) { y = radius; vy *= bounce; hit = true; }
    
    // THE SQUISH FACTOR (20% MAX)
    if (hit) squish = 0.8 + (Math.random() * 0.1); else squish += (1 - squish) * 0.12; 
    
    physicsRef.current = { ...physicsRef.current, x, y, vx, vy, squish };
    setDotPos({ x, y });

    rafRef.current = requestAnimationFrame(runPhysics);
  }, [dotMode, isDragging, docHeight]);

  useEffect(() => {
    if (dotMode === 'RELEASED' && !isDragging) rafRef.current = requestAnimationFrame(runPhysics);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [dotMode, isDragging, runPhysics]);

  const handleLogoTouchStart = () => {
    if (dotMode === 'LOCKED') {
      chargingLogoRef.current = true;
      longPressActiveRef.current = false;
      setDotMode('CHARGING');
      setDotScale(1);
      const duration = 2000;
      chargeTimerRef.current = setTimeout(() => {
        if (!chargingLogoRef.current) return;
        longPressActiveRef.current = true; 
        
        // VIEWPORT CENTERING (EXACT COMMIT a76fb59)
        const cx = window.innerWidth / 2;
        const cy = window.scrollY + window.innerHeight / 2 - 155;
        physicsRef.current = { ...physicsRef.current, x: cx, y: cy, vx: 0, vy: 0, scale: 0, squish: 1 };
        setDotPos({ x: cx, y: cy });
        setDotMode('RELEASED');
        growBall(3);
        
        setSplashPos({ x: cx, y: cy });
        setShowSplash(true);
        setTimeout(() => setShowSplash(false), 1000);
      }, duration);

      const scaleObj = { s: physicsRef.current.scale };
      chargeAnimRef.current = anime(scaleObj, {
        s: 3, duration: duration, easing: 'linear',
        update: () => { if (chargingLogoRef.current) setDotScale(scaleObj.s); }
      });
    } else if (dotMode === 'RELEASED') {
      chargingLogoRef.current = true;
      longPressActiveRef.current = false;
      const duration = 2000;
      chargeTimerRef.current = setTimeout(() => {
        if (!chargingLogoRef.current) return;
        longPressActiveRef.current = true; 
        returnToNav();
      }, duration);
      const scaleObj = { s: physicsRef.current.scale };
      chargeAnimRef.current = anime(scaleObj, {
        s: 0.5, duration: duration, easing: 'linear',
        update: () => { if (chargingLogoRef.current) setDotScale(scaleObj.s); }
      });
    }
  };

  const handleLogoTouchEnd = () => {
    chargingLogoRef.current = false;
    if (chargeTimerRef.current) clearTimeout(chargeTimerRef.current);
    if (chargeAnimRef.current) chargeAnimRef.current.pause();
    if (dotMode === 'CHARGING') { setDotScale(1); setDotMode('LOCKED'); }
    else if (dotMode === 'RELEASED') setDotScale(physicsRef.current.scale);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (longPressActiveRef.current) { longPressActiveRef.current = false; return; }
    switch (dotMode) {
      case 'RELEASED':
        const s = physicsRef.current.scale;
        if (s < 1.5) growBall(2); else if (s < 3.5) growBall(4); else growBall(1);
        break;
      case 'LOCKED':
      default:
        // Centered Release
        const cx = window.innerWidth / 2;
        const cy = window.scrollY + window.innerHeight / 2 - 155;
        physicsRef.current = { ...physicsRef.current, x: cx, y: cy, vx: 0, vy: 0, scale: 0, squish: 0.8 };
        setDotPos({ x: cx, y: cy });
        setDotMode('RELEASED');
        growBall(3);
        setSplashPos({ x: 44, y: 44 }); 
        setShowSplash(true);
        setTimeout(() => setShowSplash(false), 800);
        if (window.scrollY > 200) window.scrollTo({ top: 0, behavior: "smooth" });
        break;
    }
  };

  const growBall = (target: number) => {
    if (growthAnimRef.current) growthAnimRef.current.pause();
    growthAnimRef.current = anime(physicsRef.current, {
      scale: target, duration: 600, easing: 'easeOutElastic(1.2, .4)',
      update: () => setDotScale(physicsRef.current.scale)
    });
  };

  const handleDotTouchStart = (e: React.TouchEvent) => {
    if (dotMode === 'RELEASED') {
      const touch = e.touches[0];
      const pageX = touch.clientX;
      const pageY = touch.clientY + window.scrollY;
      const dist = Math.hypot(pageX - dotPos.x, pageY - dotPos.y);
      if (dist < 60) { setIsDragging(true); lastTouchRef.current = { x: pageX, y: pageY, time: Date.now() }; }
    }
  };

  const handleDotTouchMove = (e: React.TouchEvent) => {
    if (dotMode === 'RELEASED' && isDragging) {
      const touch = e.touches[0];
      const pageX = touch.clientX;
      const pageY = touch.clientY + window.scrollY;
      const now = Date.now();
      const dt = now - lastTouchRef.current.time;
      if (dt > 0) {
        const vx = (pageX - lastTouchRef.current.x) / (dt / 16);
        const vy = (pageY - lastTouchRef.current.y) / (dt / 16);
        physicsRef.current = { ...physicsRef.current, x: pageX, y: pageY, vx, vy };
      }
      setDotPos({ x: pageX, y: pageY });
      lastTouchRef.current = { x: pageX, y: pageY, time: now };
    }
  };

  const handleDotMouseDown = (e: React.MouseEvent) => {
    if (dotMode === 'RELEASED') {
      const pageX = e.clientX;
      const pageY = e.clientY + window.scrollY;
      setIsDragging(true);
      lastTouchRef.current = { x: pageX, y: pageY, time: Date.now() };
      
      const onMove = (ev: MouseEvent) => {
        const mx = ev.clientX;
        const my = ev.clientY + window.scrollY;
        const now = Date.now();
        const dt = now - lastTouchRef.current.time;
        if (dt > 0) {
          const vx = (mx - lastTouchRef.current.x) / (dt / 16);
          const vy = (my - lastTouchRef.current.y) / (dt / 16);
          physicsRef.current = { ...physicsRef.current, x: mx, y: my, vx, vy };
        }
        setDotPos({ x: mx, y: my });
        lastTouchRef.current = { x: mx, y: my, time: now };
      };
      
      const onUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
      
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    }
  };

  const handleDotTouchEnd = () => setIsDragging(false);

  return (
    <>
      <div className="absolute top-0 left-0 w-full pointer-events-none" style={{ height: docHeight || '100%', zIndex: 999 }}>
        {showSplash && (
          <div className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: splashPos.x, top: splashPos.y }}>
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className="absolute inset-0 rounded-full border-2 animate-ping" 
                style={{ 
                  animationDuration: '1s', 
                  animationDelay: `${i * 0.2}s`, 
                  width: '60px', 
                  height: '60px', 
                  margin: '-30px 0 0 -30px',
                  borderColor: isBallCyan ? '#0ee0c3' : 'var(--accent-blood)'
                }} 
              />
            ))}
          </div>
        )}

        {/* ABSOLUTE BALL PORTALL-LESS REVERTED 🏮 */}
        {dotMode === 'RELEASED' && (
           <div 
            className="absolute cursor-grab active:cursor-grabbing pointer-events-auto" 
            style={{ 
              top: dotPos.y, 
              left: dotPos.x, 
              width: `${150 * dotScale}px`, 
              height: `${150 * dotScale}px`, 
              touchAction: 'none',
              transform: `translate(-50%, -50%) scale(${physicsRef.current.squish})`,
            }}
            onMouseDown={handleDotMouseDown}
            onTouchStart={handleDotTouchStart}
            onTouchMove={handleDotTouchMove}
            onTouchEnd={handleDotTouchEnd}
            onClick={(e) => {
              e.stopPropagation();
              // TOGGLE COLOR ON BALL CLICK 🏮
              setIsBallCyan(prev => !prev);
            }}
          >
            <div 
              className="w-full h-full rounded-full transition-all duration-300 relative flex items-center justify-center overflow-hidden border-2 border-white/20"
              style={{
                backgroundColor: isBallCyan ? '#0ee0c3' : 'var(--accent-blood)',
                boxShadow: isBallCyan ? `0 0 25px ${isBallCyan ? 'rgba(14,224,195,0.9)' : 'rgba(217,17,17,0.9)'}` : '0 0 25px rgba(217,17,17,0.9)'
              }}
            >
               <div className="absolute inset-0 halftone-bg opacity-10" />
            </div>
          </div>
        )}
      </div>

      <nav ref={navbarRef} className="fixed right-0 top-0 bottom-0 z-[100] w-12 md:w-16 bg-white border-l border-[var(--bg-ink)]/10 flex flex-col justify-between items-center py-4 md:py-8 touch-none" style={{ userSelect: 'none' }}>
        <div className="flex flex-col items-center gap-4 z-20">
          <div className="w-11 h-11 flex items-center justify-center mr-[4px]">
            <button onMouseDown={(e) => { if (e.button === 0) handleLogoTouchStart(); }} onMouseUp={handleLogoTouchEnd} onMouseLeave={handleLogoTouchEnd} onTouchStart={handleLogoTouchStart} onTouchEnd={handleLogoTouchEnd} onClick={handleLogoClick} className="w-9 h-9 md:w-11 md:h-11 bg-black flex items-center justify-center shrink-0 cursor-pointer brutal-shadow-sm border border-white/5 group overflow-hidden touch-manipulation">
                <Image 
                  src="/icon.png" 
                  alt="HP Logo" 
                  width={44} 
                  height={44} 
                  priority={true}
                  sizes="44px"
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
            </button>
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

          {/* FIXING MISSING BALL IN NAVBAR 🏮 */}
          {dotMode !== 'RELEASED' && (
            <div 
              ref={dotRef} 
              className="absolute left-0 right-0 flex items-center justify-center pointer-events-none" 
              style={{ 
                top: `${scrollProgress}%`, 
                transform: `translateY(-50%)`, 
                transition: "top 0.1s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)", 
                height: `${8 + (scrollSpeed * 0.4)}px`, 
                width: '100%', 
                zIndex: 10 
              }}
            >
              <div 
                className="rounded-full transition-all duration-300" 
                style={{ 
                  width: `${8 - (scrollSpeed * 0.04)}px`, 
                  height: '100%',
                  backgroundColor: isBallCyan ? '#0ee0c3' : 'var(--accent-blood)',
                  boxShadow: isBallCyan ? '0 0 15px rgba(14,224,195,0.8)' : '0 0 15px rgba(217,17,17,0.8)'
                }} 
              />
            </div>
          )}

          <div className="flex flex-col justify-between w-full h-full relative z-20 pointer-events-none">
            {currentNavItems.map((item) => {
              const isActive = active === item.id;
              return (
                <a key={item.id} href={item.id === 'hero' ? '#' : `#${item.id}`} className="pointer-events-auto absolute w-full group py-4 flex flex-col items-center transition-all duration-300" style={{ top: `${item.percent}%`, transform: `translateY(-50%)` }} onClick={(e) => { e.preventDefault(); if (item.id === 'hero') window.scrollTo({ top: 0, behavior: 'smooth' }); else handleClick(item.id); }}>
                  <span className={`font-display font-bold ${language === 'ja' ? 'text-xl md:text-2xl' : 'text-sm md:text-base'} uppercase tracking-widest transition-all duration-300 ${isActive ? "text-[var(--bg-ink)] drop-shadow-[0_0_8px_rgba(5,5,5,0.4)] scale-110" : "text-[var(--bg-ink)]/40 group-hover:text-[var(--bg-ink)]/80"}`} style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
