"use client";

import React, { useEffect, useState } from 'react';
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
    <div className="relative flex items-center pointer-events-auto select-none group/counter h-9">
      {/* THE MINIMAL PILL BUTTON - MATCHES LANGUAGE SELECTOR STYLE */}
      <motion.div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center bg-black border border-white/20 h-9 transition-all duration-500 hover:border-[var(--accent-blood)] overflow-hidden"
        initial={false}
        animate={{ width: isHovered ? "auto" : "auto" }}
      >
        {/* ICON & VISITORS (ALWAYS VISIBLE) */}
        <div className="flex items-center px-4 h-full gap-3 border-r border-white/5 whitespace-nowrap">
           <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[var(--accent-blood)]" xmlns="http://www.w3.org/2000/svg">
             <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
           </svg>
           <div className="flex flex-col justify-center">
             <span className="text-[10px] font-black font-mono text-white leading-none">
               {data?.uniqueCount?.toString().padStart(4, '0') || '0000'}
             </span>
             <span className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none mt-0.5">
               {t.visitors}
             </span>
           </div>
        </div>

        {/* REVEAL VIEWS ON HOVER */}
        <motion.div 
           initial={{ width: 0, opacity: 0 }}
           animate={{ width: isHovered ? "auto" : 0, opacity: isHovered ? 1 : 0 }}
           transition={{ type: "spring", stiffness: 300, damping: 30 }}
           className="flex items-center h-full px-5 bg-white/5 overflow-hidden whitespace-nowrap"
        >
           <div className="flex flex-col justify-center">
             <span className="text-[10px] font-black font-mono text-[var(--accent-blood)] leading-none">
                {data?.totalHits?.toLocaleString() || '---'}
             </span>
             <span className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none mt-0.5">
                {t.views}
             </span>
           </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
