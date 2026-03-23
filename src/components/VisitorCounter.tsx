"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const TRANSLATIONS = {
  en: { tourists: 'Unique', tours: 'Total' },
  ja: { tourists: 'ユニーク', tours: '合計' },
  hi: { tourists: 'अद्वितीय', tours: 'कुल' }
};

export function VisitorCounter() {
  const { language } = useLanguage();
  const [data, setData] = useState<{ uniqueCount: number; totalHits: number } | null>(null);
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
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const dist = Math.min(6, Math.hypot(e.clientX - centerX, e.clientY - centerY) / 60);
      setMousePos({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist });
    };

    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      clearTimeout(humanCheck);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center pointer-events-auto select-none">
      {/* THE DOUBLE-IRIS WATCHER */}
      <div 
        ref={eyeRef}
        className="w-40 h-24 bg-white border-[6px] border-black flex items-center justify-center gap-2 relative shadow-[10px_10px_0_rgba(0,0,0,1)] hover:scale-105 transition-transform duration-500"
        style={{ borderRadius: "100% 0 100% 0" }}
      >
        {/* IRIS 1: TOURISTS */}
        <div className="flex flex-col items-center">
            <motion.div 
               animate={{ x: mousePos.x, y: mousePos.y }}
               className="w-12 h-12 rounded-full border-4 border-black bg-[#d91111] flex flex-col items-center justify-center overflow-hidden mb-1 relative"
            >
               <div className="w-1 h-full bg-black opacity-60" />
               <div className="absolute top-1 right-2 w-2 h-2 bg-white/40 rounded-full" />
            </motion.div>
            <span className="text-[10px] font-black uppercase text-black/40">{t.tourists}</span>
            <span className="text-sm font-black text-black leading-none">{data?.uniqueCount?.toString().padStart(4, '0') || '0000'}</span>
        </div>

        {/* BRUTAL SEPARATOR */}
        <div className="w-[2px] h-16 bg-black opacity-20 mx-1" />

        {/* IRIS 2: TOURS */}
        <div className="flex flex-col items-center">
            <motion.div 
               animate={{ x: mousePos.x * 1.2, y: mousePos.y * 1.2 }}
               className="w-12 h-12 rounded-full border-4 border-black bg-[#0ee0c3] flex flex-col items-center justify-center overflow-hidden mb-1 relative"
            >
               <div className="w-1 h-full bg-black opacity-60" />
               <div className="absolute top-1 right-2 w-2 h-2 bg-white/40 rounded-full" />
            </motion.div>
            <span className="text-[10px] font-black uppercase text-black/40">{t.tours}</span>
            <span className="text-sm font-black text-black leading-none">{data?.totalHits?.toLocaleString() || '---'}</span>
        </div>

        {/* MANGA TEXTURE */}
        <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />
      </div>

    </div>
  );
}
