"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage, type Language } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

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
  ],
  eridian: [
    { id: "hero", label: "WHO-IS", percent: 5 },
    { id: "projects", label: "MAKE-THING", percent: 33 },
    { id: "about", label: "HARSHAL-DATA", percent: 65 },
    { id: "contact", label: "SEND-SIGNAL", percent: 95 },
  ]
};

type DotMode = 'LOCKED' | 'CHARGING' | 'RELEASED';

export function Navbar() {
  const { language } = useLanguage();
  const currentNavItems = NAV_ITEMS[language as keyof typeof NAV_ITEMS] || NAV_ITEMS.en;
  const [active, setActive] = useState("hero");

  const [isBallCyan, setIsBallCyan] = useState(false);
  const [dotMode, setDotMode] = useState<DotMode>('LOCKED');
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });
  const [dotScale, setDotScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [splashPos, setSplashPos] = useState({ x: 0, y: 0 });
  const [docHeight, setDocHeight] = useState(0);
  const [showEasterEggs, setShowEasterEggs] = useState(false);

  const chargingLogoRef = useRef<boolean>(false);
  const longPressActiveRef = useRef<boolean>(false);
  const chargeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const physicsRef = useRef({ vx: 0, vy: 0, x: 0, y: 0, scale: 1, squish: 1 });
  const lastTouchRef = useRef({ x: 0, y: 0, time: 0 });
  const rafRef = useRef<number | null>(null);
  const navbarRef = useRef<HTMLElement>(null);
  const dotPhysicsRef = useRef({ currentY: 0, targetY: 0, speed: 0, lastScrollY: 0, lerp: 0.12 });

  const returnToNav = useCallback(() => {
    setDotMode('LOCKED');
    setDotScale(1);
    setIsDragging(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (chargeTimerRef.current) clearTimeout(chargeTimerRef.current);
  }, []);

  // GLOBAL SLEEP MODE SIGNALING 💤
  useEffect(() => {
    if (showEasterEggs) {
      document.documentElement.classList.add('is-overlay-active');
    } else {
      document.documentElement.classList.remove('is-overlay-active');
    }
    return () => document.documentElement.classList.remove('is-overlay-active');
  }, [showEasterEggs]);

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
      if (showEasterEggs) {
        loopRaf = requestAnimationFrame(smoothLoop);
        return;
      }
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
    let timer: NodeJS.Timeout;
    const updateHeight = () => {
      if (showEasterEggs) return;
      setDocHeight(document.documentElement.scrollHeight);
    };
    const resizer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(updateHeight, 200);
    });
    resizer.observe(document.body);
    updateHeight();
    return () => { resizer.disconnect(); clearTimeout(timer); };
  }, [showEasterEggs]);

  const runPhysics = useCallback(() => {
    if (dotMode !== 'RELEASED' || isDragging) return;
    const currentScale = physicsRef.current.scale;
    const friction = 0.985 + ((currentScale - 1) / 3) * 0.012;
    const bounce = -0.92 - ((currentScale - 1) / 3) * 0.05; 
    const radius = (10 * currentScale) / 2;
    let { x, y, vx, vy, squish } = physicsRef.current;
    
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
  }, [dotMode, isDragging, docHeight]);

  useEffect(() => {
    if (dotMode === 'RELEASED' && !isDragging) rafRef.current = requestAnimationFrame(runPhysics);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [dotMode, isDragging, runPhysics]);

  const handleLogoTouchStart = () => {
    chargingLogoRef.current = true;
    longPressActiveRef.current = false;

    if (dotMode === 'LOCKED' || dotMode === 'RELEASED') {
      setDotScale(1.2);
      chargeTimerRef.current = setTimeout(() => {
        if (!chargingLogoRef.current) return;
        longPressActiveRef.current = true;
        
        if (dotMode === 'LOCKED') {
          setDotMode('CHARGING');
          setDotScale(3);
          const oppsEl = document.getElementById('available-for-opps');
          const rect = oppsEl?.getBoundingClientRect();
          const cx = window.innerWidth / 2;
          const cy = rect ? (rect.top + window.scrollY - 120) : (window.scrollY + window.innerHeight / 2 - 155);
          physicsRef.current = { ...physicsRef.current, x: cx, y: cy, vx: 0, vy: 0, scale: 3, squish: 1 };
          setDotPos({ x: cx, y: cy });
          setDotMode('RELEASED');
          setSplashPos({ x: cx, y: cy });
          setShowSplash(true);
          setTimeout(() => setShowSplash(false), 1000);
        } else {
          returnToNav();
        }
      }, 800); // Slightly faster long-press detection (800ms)
    }
  };

  const handleLogoTouchEnd = () => {
    chargingLogoRef.current = false;
    if (chargeTimerRef.current) clearTimeout(chargeTimerRef.current);
    if (dotMode === 'CHARGING') { setDotScale(1); setDotMode('LOCKED'); }
  };

  const handleLogoClick = () => {
    // ONLY toggle if this wasn't a long-press session
    if (!longPressActiveRef.current) {
      setShowEasterEggs(prev => !prev);
    }
    // Reset for next interaction
    longPressActiveRef.current = false;
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

  const handleDotTouchEnd = () => setIsDragging(false);

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

  return (
    <>
      <div className="absolute top-0 left-0 w-full pointer-events-none" style={{ height: docHeight || '100%', zIndex: 999 }}>
        {showSplash && (
          <div className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: splashPos.x, top: splashPos.y }}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="absolute inset-0 rounded-full border-2 animate-ping" style={{ animationDuration: '1s', animationDelay: `${i * 0.2}s`, width: '100px', height: '100px', margin: '-50px 0 0 -50px', borderColor: isBallCyan ? 'var(--accent-cursed)' : 'var(--accent-blood)' }} />
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
            <div className="w-full h-full rounded-full transition-all duration-300 relative flex items-center justify-center overflow-hidden border-2 border-white/20" 
                 style={{ 
                   backgroundColor: isBallCyan ? 'var(--accent-cursed)' : 'var(--accent-blood)', 
                   boxShadow: isBallCyan ? '0 0 25px rgba(var(--accent-cursed-rgb), 0.9)' : '0 0 25px rgba(var(--accent-blood-rgb), 0.9)' 
                 }}>
               <div className="absolute inset-0 halftone-bg opacity-10" />
            </div>
          </div>
        )}
      </div>

      <nav ref={navbarRef} className="fixed right-0 top-0 h-[100dvh] z-[100] w-12 md:w-16 bg-white border-l border-[var(--bg-ink)]/10 flex flex-col justify-between items-center py-4 md:py-8 touch-none shrink-0" style={{ userSelect: 'none' }}>
        <div className="flex flex-col items-center gap-4 z-20">
          <div className="w-11 h-11 flex items-center justify-center mr-[4px]">
            <button 
              onMouseDown={(e) => { if (e.button === 0) handleLogoTouchStart(); }} 
              onMouseUp={handleLogoTouchEnd} 
              onMouseLeave={handleLogoTouchEnd} 
              onTouchStart={handleLogoTouchStart} 
              onTouchEnd={handleLogoTouchEnd} 
              onClick={handleLogoClick}
              className="w-9 h-9 md:w-11 md:h-11 bg-black flex items-center justify-center shrink-0 cursor-pointer brutal-shadow-sm border border-white/5 group overflow-hidden touch-manipulation"
            >
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
              <div className="rounded-full transition-all duration-300" 
                   style={{ 
                     width: `calc(8px - (var(--nav-speed, 0) * 0.04px))`, 
                     height: '100%', 
                     backgroundColor: isBallCyan ? 'var(--accent-cursed)' : 'var(--accent-blood)', 
                     boxShadow: isBallCyan ? '0 0 15px rgba(var(--accent-cursed-rgb), 0.8)' : '0 0 15px rgba(var(--accent-blood-rgb), 0.8)' 
                   }} />
            </div>
          )}
          <div className="flex flex-col justify-between w-full h-full relative z-20 pointer-events-none">
            {currentNavItems.map((item) => (
              <a 
                key={item.id} 
                href={item.id === 'hero' ? '#' : `#${item.id}`} 
                className="pointer-events-auto absolute w-full group py-4 flex flex-col items-center transition-all duration-300" 
                style={{ top: `${item.percent}%`, transform: `translateY(-50%)` }} 
                onClick={(e) => { 
                  e.preventDefault(); 
                  if (typeof window !== 'undefined') {
                    const currentScrollY = window.scrollY;
                    const targetEl = item.id === 'hero' ? null : document.getElementById(item.id);
                    const targetY = item.id === 'hero' ? 0 : (targetEl ? targetEl.getBoundingClientRect().top + window.scrollY : 0);
                    const direction = targetY > currentScrollY ? 1 : -1;
                    const distance = Math.abs(targetY - currentScrollY);
                    if (distance > 300) {
                      window.dispatchEvent(new CustomEvent('WARP_JUMP', { detail: { direction } }));
                    }
                  }
                  if (item.id === 'hero') {
                    window.scrollTo({ top: 0, behavior: 'smooth' }); 
                  } else { 
                    const el = document.getElementById(item.id); 
                    if (el) el.scrollIntoView({ behavior: "smooth" }); 
                  } 
                }}
              >
                <span className={`font-display font-bold ${language === 'ja' ? 'text-xl md:text-2xl' : 'text-sm md:text-base'} uppercase tracking-widest transition-all duration-300 ${active === item.id ? "text-[var(--bg-ink)] drop-shadow-[0_0_8px_rgba(5,5,5,0.4)] scale-110" : "text-[var(--bg-ink)]/40 group-hover:text-[var(--bg-ink)]/80"}`} style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* EASTER EGG OVERLAY 🎁 */}
      <AnimatePresence>
        {showEasterEggs && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 md:p-12 pointer-events-auto" style={{ isolation: 'isolate', willChange: 'transform' }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEasterEggs(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-2xl bg-white border-8 border-black p-8 md:p-12 brutal-shadow-lg manga-cut-tr z-10"
            >
              <h2 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tighter mb-8 border-b-8 border-black pb-4 text-black">
                Easter Eggs
              </h2>
              
              <ul className="flex flex-col gap-6">
                {[
                  { name: "Eridian Language Mode", desc: "A musical, complete thematic shift." },
                  { name: "Terminal Pressure Protocol", desc: "Triggered by extreme UI interaction." },
                  { name: "Warp Space Pathway", desc: "A cinematic high-distance navigation jump." },
                  { name: "詛咒 / Ofuda Archive", desc: "Paper charms and hidden exorcist themes." },
                  { name: "Kinetic Dot Interaction", desc: "Physics-based dot dragging and flinging." }
                ].map((egg, idx) => (
                  <li key={idx} className="flex flex-col gap-1 border-l-4 border-[var(--accent-blood)] pl-4">
                    <span className="text-xl md:text-2xl font-black font-display uppercase tracking-widest text-black">
                      {egg.name}
                    </span>
                    <span className="text-[10px] md:text-xs font-mono font-bold text-black/50 uppercase tracking-widest">
                      {egg.desc}
                    </span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => setShowEasterEggs(false)}
                className="mt-12 w-full py-4 bg-black text-white font-black font-display text-xl uppercase tracking-widest hover:bg-[var(--accent-blood)] transition-colors manga-cut-bl"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
