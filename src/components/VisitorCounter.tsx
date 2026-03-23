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
  const [isHovered, setIsHovered] = useState(false);
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
    return () => {
      clearTimeout(humanCheck);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center pointer-events-auto select-none group/counter">
      {/* THE WATCHER'S MASK - INNOVATIVE DUAL-STATE */}
      <div 
        ref={eyeRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center bg-black border-2 border-white/10 p-1 md:p-1.5 overflow-hidden"
      >
        {/* LEFTSIDE BINARY: VISITORS (ALWAYS VISIBLE) */}
        <div className="relative px-4 py-2 bg-white flex flex-col items-center justify-center shadow-[4px_4px_0_rgba(217,17,17,1)]">
           <span className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] leading-none mb-1">{t.visitors}</span>
           <span className="text-2xl md:text-3xl font-black font-mono text-black leading-none">
             {data?.uniqueCount?.toString().padStart(4, '0') || '0000'}
           </span>
        </div>

        {/* BRUTAL HINGE / SEPARATOR */}
        <div className="w-[1px] h-12 bg-white/20 mx-2" />

        {/* RIGHTSIDE BINARY: VIEWS (ONLY REVEALED ON HOVER) */}
        <div className="relative w-[100px] md:w-[120px] h-full overflow-hidden flex items-center justify-center">
            {/* THE EYELID / COVER */}
            <motion.div 
               animate={{ x: isHovered ? "105%" : "0%" }}
               transition={{ type: "spring", stiffness: 400, damping: 30 }}
               className="absolute inset-0 bg-black z-20 flex items-center justify-center border-l border-white/20"
            >
               <div className="w-1.5 h-6 bg-[var(--accent-blood)] opacity-50 blur-[1px] animate-pulse" /> {/* Static Pupil Outline */}
            </motion.div>

            {/* THE DATA UNDERNEATH */}
            <div className="flex flex-col items-center justify-center z-10">
               <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] leading-none mb-1">{t.views}</span>
               <span className="text-xl md:text-2xl font-black font-mono text-white leading-none">
                 {data?.totalHits?.toLocaleString() || '---'}
               </span>
            </div>
        </div>

        {/* MAPPA CORNER ACCENT */}
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/40" />
      </div>

    </div>
  );
}
