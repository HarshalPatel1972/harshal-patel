"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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

type DotMode = 'LOCKED' | 'CHARGING' | 'RELEASED';

export function Navbar() {
  const { language } = useLanguage();
  const currentNavItems = NAV_ITEMS[language];
  const [active, setActive] = useState("hero");
  const pathname = usePathname();

  const [isBallCyan, setIsBallCyan] = useState(false);
  const [dotMode, setDotMode] = useState<DotMode>('LOCKED');
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });
  const [dotScale, setDotScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [splashPos, setSplashPos] = useState({ x: 0, y: 0 });
  const [docHeight, setDocHeight] = useState(0);
  const [isGyroActive, setIsGyroActive] = useState(false);

  const chargingLogoRef = useRef<boolean>(false);
  const longPressActiveRef = useRef<boolean>(false);
  const chargeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gyroTimerRef = useRef<NodeJS.Timeout | null>(null);
  const physicsRef = useRef({ vx: 0, vy: 0, x: 0, y: 0, scale: 1, squish: 1, gx: 0, gy: 0 });
  const lastTouchRef = useRef({ x: 0, y: 0, time: 0 });
  const rafRef = useRef<number | null>(null);
  const navbarRef = useRef<HTMLElement>(null);
  const dotPhysicsRef = useRef({ currentY: 0, targetY: 0, speed: 0, lastScrollY: 0, lerp: 0.12 });

  const returnToNav = useCallback(() => {
    setDotMode('LOCKED');
    setDotScale(1);
    setIsDragging(false);
    setIsGyroActive(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (chargeTimerRef.current) clearTimeout(chargeTimerRef.current);
    if (gyroTimerRef.current) clearTimeout(gyroTimerRef.current);
  }, []);

  // SECTION TRACKING
  useEffect(() => {
    const sectionIds = currentNavItems.map(item => item.id);
    const observerOptions = { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 };
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    };
    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [currentNavItems]);

  // SMOOTH DOT PHYSICS LOOP
  useEffect(() => {
    let loopRaf: number;
    let speedTimeout: NodeJS.Timeout;
    const smoothLoop = () => {
      const p = dotPhysicsRef.current;
      p.currentY += (p.targetY - p.currentY) * p.lerp;
      if (navbarRef.current) {
        navbarRef.current.style.setProperty('--nav-scroll', `${p.currentY}%`);
        navbarRef.current.style.setProperty('--nav-speed', `${p.speed}`);
      }
      loopRaf = requestAnimationFrame(smoothLoop);
    };
    const handleScroll = () => {
      const p = dotPhysicsRef.current;
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      p.targetY = maxScroll > 0 ? (currentScrollY / maxScroll) * 100 : 0;
      p.speed = Math.min(Math.abs(currentScrollY - p.lastScrollY), 50);
      p.lastScrollY = currentScrollY;
      if (speedTimeout) clearTimeout(speedTimeout);
      speedTimeout = setTimeout(() => { p.speed = 0; }, 200);
    };
    loopRaf = requestAnimationFrame(smoothLoop);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => { cancelAnimationFrame(loopRaf); window.removeEventListener("scroll", handleScroll); };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateHeight = () => setDocHeight(document.documentElement.scrollHeight);
    const resizer = new ResizeObserver(updateHeight);
    resizer.observe(document.body);
    updateHeight();
    return () => resizer.disconnect();
  }, []);

  const gyroBaseRef = useRef<{ beta: number, gamma: number } | null>(null);

  useEffect(() => {
    if (!isGyroActive) return;
    
    const handleOrientation = (e: any) => {
      const beta = e.beta;
      const gamma = e.gamma;
      
      if (beta !== null && gamma !== null) {
        // Capture initial angle as Zero-Point for this session 🏮
        if (!gyroBaseRef.current) {
          gyroBaseRef.current = { beta, gamma };
          return;
        }

        // Calculate Relative Tilt from the calibration base
        const dGamma = gamma - gyroBaseRef.current.gamma;
        const dBeta = beta - gyroBaseRef.current.beta;
        
        const deadzone = 1.5;
        let targetGx = 0;
        let targetGy = 0;
        
        if (Math.abs(dGamma) > deadzone) {
          targetGx = (dGamma > 0 ? dGamma - deadzone : dGamma + deadzone) * 0.12;
        }
        
        if (Math.abs(dBeta) > deadzone) {
          targetGy = (dBeta > 0 ? dBeta - deadzone : dBeta + deadzone) * 0.12;
        }

        // Clamp to prevent "Warp Speed"
        physicsRef.current.gx = Math.max(-2.5, Math.min(2.5, targetGx));
        physicsRef.current.gy = Math.max(-2.5, Math.min(2.5, targetGy));
      }
    };
    
    // Add multiple listeners for Android/iOS compatibility 📱
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);
    
    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
      window.removeEventListener('deviceorientation', handleOrientation);
      gyroBaseRef.current = null;
    };
  }, [isGyroActive]);

  const runPhysics = useCallback(() => {
    if (dotMode !== 'RELEASED' || isDragging) return;
    const currentScale = physicsRef.current.scale;
    const friction = 0.985 + ((currentScale - 1) / 3) * 0.012;
    const bounce = -0.92 - ((currentScale - 1) / 3) * 0.05; 
    const radius = (10 * currentScale) / 2;
    let { x, y, vx, vy, squish, gx, gy } = physicsRef.current;
    
    // Apply Gyro Gravity if active
    if (isGyroActive) {
      vx += gx;
      vy += gy;
    }
    
    x += vx; y += vy; vx *= friction; vy *= friction;
    const width = window.innerWidth;
    const height = docHeight || document.documentElement.scrollHeight;
    let hit = false;
    if (x + radius > width) { x = width - radius; vx *= bounce; hit = true; }
    if (x - radius < 0) { x = radius; vx *= bounce; hit = true; }
    if (y + radius > height) { y = height - radius; vy *= bounce; hit = true; }
    if (y - radius < 0) { y = radius; vy *= bounce; hit = true; }
    if (hit) squish = 0.8 + (Math.random() * 0.1); else squish += (1 - squish) * 0.12; 
    physicsRef.current = { ...physicsRef.current, x, y, vx, vy, squish };
    setDotPos({ x, y });
    rafRef.current = requestAnimationFrame(runPhysics);
  }, [dotMode, isDragging, docHeight, isGyroActive]);

  useEffect(() => {
    if (dotMode === 'RELEASED' && !isDragging) rafRef.current = requestAnimationFrame(runPhysics);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [dotMode, isDragging, runPhysics]);

  const handleLogoTouchStart = () => {
    const isMobile = window.innerWidth < 1024;
    if (!isMobile && dotMode === 'LOCKED') return;

    if (dotMode === 'LOCKED') {
      chargingLogoRef.current = true;
      setDotMode('CHARGING');
      setDotScale(3);
      chargeTimerRef.current = setTimeout(() => {
        if (!chargingLogoRef.current) return;
        longPressActiveRef.current = true;
        const oppsEl = document.getElementById('available-for-opps');
        const rect = oppsEl?.getBoundingClientRect();
        const cx = window.innerWidth / 2;
        const cy = rect ? (rect.top + window.scrollY - 120) : (window.scrollY + window.innerHeight / 2 - 155);
        physicsRef.current = { ...physicsRef.current, x: cx, y: cy, vx: 0, vy: 0, scale: 3, squish: 1, gx: 0, gy: 0 };
        setDotPos({ x: cx, y: cy });
        setDotScale(3);
        setDotMode('RELEASED');
        setSplashPos({ x: cx, y: cy });
        setShowSplash(true);
        setTimeout(() => setShowSplash(false), 1000);
      }, 2000);
    } else if (dotMode === 'RELEASED') {
      chargingLogoRef.current = true;
      chargeTimerRef.current = setTimeout(() => {
        if (!chargingLogoRef.current) return;
        longPressActiveRef.current = true;
        returnToNav();
      }, 2000);
    }
  };

  const handleLogoTouchEnd = () => {
    chargingLogoRef.current = false;
    if (chargeTimerRef.current) clearTimeout(chargeTimerRef.current);
    if (dotMode === 'CHARGING') { setDotScale(1); setDotMode('LOCKED'); }
    setTimeout(() => { longPressActiveRef.current = false; }, 100);
  };

  // GYRO ACTIVATION TRIGGER 📱🏮
  const requestGyroPermission = useCallback(() => {
    if (dotMode !== 'RELEASED' || isGyroActive) return;
    
    // Note: This must be triggered by direct user gesture (like the end of the 3s hold)
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((response: string) => {
          if (response === 'granted') activateGyro();
        })
        .catch(console.error);
    } else {
      activateGyro();
    }
  }, [dotMode, isGyroActive]);

  const holdStartTimeRef = useRef<number>(0);

  const startGyroTimer = useCallback(() => {
    if (dotMode !== 'RELEASED' || isGyroActive) return;
    holdStartTimeRef.current = Date.now();
  }, [dotMode, isGyroActive]);

  const activateGyro = () => {
    setIsGyroActive(true);
    setSplashPos({ x: dotPos.x, y: dotPos.y });
    setShowSplash(true);
    setTimeout(() => setShowSplash(false), 1500);
    // Subtle Vibration feedback if supported
    if (window.navigator?.vibrate) window.navigator.vibrate([100, 50, 200]);
  };

  const clearGyroTimer = () => {
    if (gyroTimerRef.current) clearTimeout(gyroTimerRef.current);
  };

  const handleDotTouchStart = (e: React.TouchEvent) => {
    if (dotMode === 'RELEASED') {
      const touch = e.touches[0];
      const pageX = touch.clientX;
      const pageY = touch.clientY + window.scrollY;
      const dist = Math.hypot(pageX - dotPos.x, pageY - dotPos.y);
      if (dist < 60) { 
        setIsDragging(true); 
        lastTouchRef.current = { x: pageX, y: pageY, time: Date.now() }; 
        startGyroTimer(); // START 3S GYRO TRIGGER 🏮
      }
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

  const handleDotTouchEnd = () => {
    setIsDragging(false);
    const holdTime = Date.now() - holdStartTimeRef.current;
    if (holdTime > 2500) {
      requestGyroPermission();
    }
  };

  const handleDotMouseDown = (e: React.MouseEvent) => {
    if (dotMode === 'RELEASED') {
      const pageX = e.clientX;
      const pageY = e.clientY + window.scrollY;
      setIsDragging(true);
      lastTouchRef.current = { x: pageX, y: pageY, time: Date.now() };
      
      startGyroTimer();

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
        const holdTime = Date.now() - holdStartTimeRef.current;
        if (holdTime > 2500) {
           requestGyroPermission();
        }
        document.removeEventListener('mousemove', onMove); 
        document.removeEventListener('mouseup', onUp); 
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    }
  };

  return (
    <>
      <div className="absolute top-0 left-0 w-full pointer-events-none" style={{ height: docHeight || '100%', zIndex: 999 }}>
        {showSplash && (
          <div className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: splashPos.x, top: splashPos.y }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="absolute inset-0 rounded-full border-2 animate-ping" style={{ animationDuration: '1s', animationDelay: `${i * 0.2}s`, width: isGyroActive ? '200px' : '100px', height: isGyroActive ? '200px' : '100px', margin: isGyroActive ? '-100px 0 0 -100px' : '-50px 0 0 -50px', borderColor: isGyroActive ? '#fff' : (isBallCyan ? '#0ee0c3' : 'var(--accent-blood)') }} />
            ))}
          </div>
        )}
        {dotMode === 'RELEASED' && (
           <div 
            className="absolute cursor-grab active:cursor-grabbing pointer-events-auto" 
            style={{ top: dotPos.y, left: dotPos.x, width: `${10 * dotScale}px`, height: `${10 * dotScale}px`, touchAction: 'none', transform: `translate(-50%, -50%) scale(${physicsRef.current.squish})` }}
            onMouseDown={handleDotMouseDown}
            onTouchStart={handleDotTouchStart}
            onTouchMove={handleDotTouchMove}
            onTouchEnd={handleDotTouchEnd}
            onClick={(e) => { e.stopPropagation(); setIsBallCyan(prev => !prev); }}
          >
            <div className={`w-full h-full rounded-full transition-all duration-300 relative flex items-center justify-center overflow-hidden border-2 border-white/20 ${isGyroActive ? "ring-4 ring-white shadow-[0_0_50px_#fff]" : ""}`} style={{ backgroundColor: isBallCyan ? '#0ee0c3' : 'var(--accent-blood)', boxShadow: isBallCyan ? '0 0 25px rgba(14,224,195,0.9)' : '0 0 25px rgba(217,17,17,0.9)' }}>
               <div className="absolute inset-0 halftone-bg opacity-10" />
               {isGyroActive && (
                 <div className="flex flex-col items-center justify-center z-10">
                   <div className="text-[6px] font-black text-white uppercase tracking-[0.1em] animate-pulse">GYRO</div>
                   <div className="text-[4px] font-mono text-white/40 mt-[2px]">
                     {Math.round(physicsRef.current.gx * 10) / 10} / {Math.round(physicsRef.current.gy * 10) / 10}
                   </div>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>

      <nav ref={navbarRef} className="fixed right-0 top-0 bottom-0 z-[100] w-12 md:w-16 bg-white border-l border-[var(--bg-ink)]/10 flex flex-col justify-between items-center py-4 md:py-8 touch-none" style={{ userSelect: 'none' }}>
        <div className="flex flex-col items-center gap-4 z-20">
          <div className="w-11 h-11 flex items-center justify-center mr-[4px]">
            <button onMouseDown={(e) => { if (e.button === 0) handleLogoTouchStart(); }} onMouseUp={handleLogoTouchEnd} onMouseLeave={handleLogoTouchEnd} onTouchStart={handleLogoTouchStart} onTouchEnd={handleLogoTouchEnd} className="w-9 h-9 md:w-11 md:h-11 bg-black flex items-center justify-center shrink-0 cursor-pointer brutal-shadow-sm border border-white/5 group overflow-hidden touch-manipulation">
                <Image src="/icon.png" alt="HP Logo" width={44} height={44} priority={true} sizes="44px" className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
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
          {dotMode !== 'RELEASED' && (
            <div className="absolute left-0 right-0 flex items-center justify-center pointer-events-none" style={{ top: `var(--nav-scroll, 0%)`, transform: `translateY(-50%)`, height: `calc(8px + (var(--nav-speed, 0) * 0.4px))`, width: '100%', zIndex: 10 }}>
              <div className="rounded-full transition-all duration-300" style={{ width: `calc(8px - (var(--nav-speed, 0) * 0.04px))`, height: '100%', backgroundColor: isBallCyan ? '#0ee0c3' : 'var(--accent-blood)', boxShadow: isBallCyan ? '0 0 15px rgba(14,224,195,0.8)' : '0 0 15px rgba(217,17,17,0.8)' }} />
            </div>
          )}
          <div className="flex flex-col justify-between w-full h-full relative z-20 pointer-events-none">
            {currentNavItems.map((item) => (
              <a key={item.id} href={item.id === 'hero' ? '#' : `#${item.id}`} className="pointer-events-auto absolute w-full group py-4 flex flex-col items-center transition-all duration-300" style={{ top: `${item.percent}%`, transform: `translateY(-50%)` }} onClick={(e) => { e.preventDefault(); if (item.id === 'hero') window.scrollTo({ top: 0, behavior: 'smooth' }); else { const el = document.getElementById(item.id); if (el) el.scrollIntoView({ behavior: "smooth" }); } }}>
                <span className={`font-display font-bold ${language === 'ja' ? 'text-xl md:text-2xl' : 'text-sm md:text-base'} uppercase tracking-widest transition-all duration-300 ${active === item.id ? "text-[var(--bg-ink)] drop-shadow-[0_0_8px_rgba(5,5,5,0.4)] scale-110" : "text-[var(--bg-ink)]/40 group-hover:text-[var(--bg-ink)]/80"}`} style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
