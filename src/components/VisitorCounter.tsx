"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const TRANSLATIONS = {
  en: { visitors: 'Visitors', views: 'Views' },
  ja: { visitors: '訪問者', views: 'ビュー' },
  hi: { visitors: 'आगंतुक', views: 'दृश्य' }
};

export function VisitorCounter() {
  const { language } = useLanguage();
  const [data, setData] = useState<{ uniqueCount: number; totalHits: number } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const eyeRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  useEffect(() => {
    let cid = typeof window !== 'undefined' ? localStorage.getItem('visitor_soul_id') : null;
    if (!cid && typeof window !== 'undefined') {
       cid = Math.random().toString(36).substring(2, 15);
       localStorage.setItem('visitor_soul_id', cid);
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/visitor-count');
        const json = await res.json();
        if (json.success) setData({ uniqueCount: json.uniqueCount, totalHits: json.totalHits });
      } catch (e) {}
    };

    const incrementStats = async () => {
      try {
        await fetch('/api/visitor-count', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ cid })
        });
        fetchStats();
      } catch (e) {}
    };

    fetchStats();
    const humanCheck = setTimeout(incrementStats, 3000);
    const interval = setInterval(fetchStats, 60000);
    
    const handleMove = (e: MouseEvent) => {
      if (!eyeRef.current) return;
      const rect = eyeRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.min(10, Math.hypot(e.clientX - centerX, e.clientY - centerY) / 50);
      setMousePos({ x: (e.clientX - centerX) * 0.1, y: (e.clientY - centerY) * 0.1 });
    };

    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      clearTimeout(humanCheck);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center pointer-events-auto select-none group/counter mt-2 md:mt-0">
      {/* THE SPLIT HORIZON - MINIMAL MAPPA ART */}
      <div 
        ref={eyeRef}
        role="button"
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => window.innerWidth >= 768 && setIsExpanded(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setIsExpanded(false)}
        className="cursor-pointer relative w-40 h-20 md:w-56 md:h-24 flex items-center justify-center overflow-visible"
      >
        {/* UPPER LINE - THE SKY */}
        <motion.div 
           animate={{ y: isExpanded ? -30 : 0, skewX: isExpanded ? -10 : 0 }}
           transition={{ type: "spring", stiffness: 300, damping: 20 }}
           className="absolute top-1/2 left-0 right-0 h-[3px] bg-white z-30" 
        />

        {/* LOWER LINE - THE EARTH */}
        <motion.div 
           animate={{ y: isExpanded ? 30 : 0, skewX: isExpanded ? 10 : 0 }}
           transition={{ type: "spring", stiffness: 300, damping: 20 }}
           className="absolute top-1/2 left-0 right-0 h-[3px] bg-white z-30" 
        />

        {/* THE VOID DATA GUTS (REVEALED IN THE GAP) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
           <AnimatePresence>
             {isExpanded && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                 animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                 exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                 className="flex flex-col items-center gap-1"
               >
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] leading-none mb-1">{t.visitors}</span>
                    <span className="text-3xl font-black font-mono text-white leading-none">
                      {data?.uniqueCount?.toString().padStart(4, '0') || '0000'}
                    </span>
                  </div>
                  <div className="flex flex-col items-center mt-2 pt-2 border-t border-white/10 w-full">
                    <span className="text-[10px] font-black text-[var(--accent-blood)] uppercase tracking-[0.3em] leading-none mb-1">{t.views}</span>
                    <span className="text-2xl font-black font-mono text-white leading-none">
                      {data?.totalHits?.toLocaleString() || '---'}
                    </span>
                  </div>

                  {/* MINIMAL GLITCH PUPIL */}
                  <motion.div 
                    animate={{ x: mousePos.x, y: mousePos.y }}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-[var(--accent-blood)] opacity-40 blur-[1px]" 
                  />
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* STATIC STATE: MINIMAL IRIS OUTLINE */}
        {!isExpanded && (
           <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-4 h-4 rounded-full border-2 border-white/20 z-0"
           />
        )}
      </div>
    </div>
  );
}
