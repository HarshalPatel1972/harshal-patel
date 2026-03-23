"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const TRANSLATIONS = {
  en: { visitors: 'Visitors', views: 'Views', viewsFull: 'Total Views' },
  ja: { visitors: '訪問者', views: 'ビュー', viewsFull: '合計ビュー' },
  hi: { visitors: 'आगंतुक', views: 'दृश्य', viewsFull: 'कुल दृश्य' }
};

export function VisitorCounter() {
  const { language } = useLanguage();
  const [data, setData] = useState<{ uniqueCount: number; totalHits: number } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
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
    <div className="relative flex items-center pointer-events-auto select-none group/counter">
      {/* THE ORIGINAL CURSED ARTIFACT (OFUDA) */}
      <div 
        role="button"
        onMouseEnter={() => window.innerWidth >= 768 && setIsExpanded(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setIsExpanded(false)}
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer min-w-[64px] h-[64px] bg-[#fdfaf0] flex flex-col items-center justify-center px-4 transition-all duration-500 hover:scale-105 shadow-[4px_4px_0_rgba(0,0,0,1)] relative z-20 group/button overflow-hidden"
        style={{ 
          clipPath: "polygon(5% 0%, 100% 5%, 95% 95%, 0% 100%, 8% 50%)" /* Hand-torn paper effect */
        }}
      >
        {/* Artifact Texture Layer */}
        <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />
        <div className="absolute -top-1 -right-1 w-6 h-6 border-2 border-[var(--accent-blood)]/20 rounded-full opacity-30 pointer-events-none" />

        <span className="text-[10px] font-mono font-black text-[var(--accent-blood)] tracking-tighter mb-0.5 uppercase z-10">
          {t.visitors}
        </span>
        <div className="flex items-center justify-center z-10">
          <span className="text-2xl font-black font-mono leading-none tracking-tighter text-black">
            {data?.uniqueCount?.toString().padStart(4, '0') || '0000'}
          </span>
        </div>
      </div>

      {/* Slide-out Drawer (REVEAL VIEWS) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ width: 0, opacity: 0, x: -10 }}
            animate={{ width: "auto", opacity: 1, x: -4 }}
            exit={{ width: 0, opacity: 0, x: -10 }}
            className="h-12 bg-[#fdfaf0] flex items-center px-6 shadow-[4px_4px_0_rgba(0,0,0,1)] z-10 overflow-hidden"
            style={{ 
              clipPath: "polygon(0% 0%, 95% 5%, 100% 95%, 5% 100%)" 
            }}
          >
            <div className="flex flex-col items-start min-w-[max-content]">
               <span className="text-[9px] font-black text-black opacity-40 uppercase tracking-widest leading-none mb-0.5">
                 {t.viewsFull}
               </span>
               <span className="text-lg font-black font-mono text-[var(--accent-blood)] leading-none">
                 {data?.totalHits?.toLocaleString() || '---'}
               </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
