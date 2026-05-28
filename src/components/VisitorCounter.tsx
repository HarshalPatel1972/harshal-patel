"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useDesignVersion } from '@/components/shared/DesignVersionContext';

const TRANSLATIONS = {
  en: { visitors: 'Visitors', views: 'Views' },
  ja: { visitors: '訪問者', views: 'ビュー' },
  hi: { visitors: 'आगंतुक', views: 'दृश्य' },
  eridian: { visitors: 'VISIT-HUMANS', views: 'LOOK-THINGS' }
};

export function VisitorCounter() {
  const { language } = useLanguage();
  const { designVersion } = useDesignVersion();
  const isV2 = designVersion === 'new';
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
      {/* THE MINIMAL PILL BUTTON - REMOVED FRAMER MOTION ENTRANCE FOR INSTANT VISIBILITY */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex items-center h-9 transition-all duration-500 overflow-hidden ${
          isV2 
            ? "bg-[var(--aged-paper)] border border-[var(--sumi-ink)]/15 hover:border-[var(--forge-orange)]"
            : "bg-black border-2 border-white hover:border-[var(--accent-blood)]"
        }`}
      >
        {/* ICON & VISITORS (ALWAYS VISIBLE) */}
        <div className={`flex items-center px-4 h-full gap-3 whitespace-nowrap ${
          isV2 ? "border-r border-[var(--sumi-ink)]/15" : "border-r border-white/5"
        }`}>
           <svg viewBox="0 0 24 24" className={`w-4 h-4 ${isV2 ? "fill-[var(--forge-orange)]" : "fill-[var(--accent-blood)]"}`} xmlns="http://www.w3.org/2000/svg">
             <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
           </svg>
           <div className="flex flex-col justify-center">
             <span className={`text-[10px] font-black font-mono leading-none ${isV2 ? "text-[var(--sumi-ink)]" : "text-white"}`}>
               {data?.uniqueCount?.toString().padStart(4, '0') || '0000'}
             </span>
             <span className={`text-[8px] font-black uppercase tracking-widest leading-none mt-0.5 ${isV2 ? "text-[var(--muted-label)]" : "text-white/30"}`}>
               {t.visitors}
             </span>
           </div>
        </div>

        {/* REVEAL VIEWS ON HOVER */}
        <div 
           className={`flex items-center h-full overflow-hidden whitespace-nowrap transition-all duration-300 ${
             isV2 ? "bg-[var(--forge-orange)]/5" : "bg-white/5"
           } ${isHovered ? "w-auto px-5 opacity-100" : "w-0 opacity-0"}`}
        >
           <div className="flex flex-col justify-center">
             <span className={`text-[10px] font-black font-mono leading-none ${
               isV2 ? "text-[var(--forge-orange)]" : "text-[var(--accent-blood)]"
             }`}>
                {data?.totalHits?.toLocaleString() || '---'}
             </span>
             <span className={`text-[8px] font-black uppercase tracking-widest leading-none mt-0.5 ${isV2 ? "text-[var(--muted-label)]" : "text-white/30"}`}>
                {t.views}
             </span>
           </div>
        </div>
      </div>
    </div>
  );
}
