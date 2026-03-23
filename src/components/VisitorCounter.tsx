"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useMagnetic } from './AnimationKit';

const TRANSLATIONS = {
  en: { tourists: 'Tourists', tours: 'Tours' },
  ja: { tourists: '観光客', tours: 'ツアー' },
  ko: { tourists: '관광객', tours: '투어' },
  'zh-tw': { tourists: '遊客', tours: '參觀' },
  hi: { tourists: 'पर्यटक', touristsSub: 'सैलानियों', tours: 'दौरे' },
  fr: { tourists: 'Touristes', tours: 'Visites' },
  id: { tourists: 'Turis', tours: 'Tur' },
  de: { tourists: 'Touristen', tours: 'Touren' },
  it: { tourists: 'Turisti', tours: 'Tour' },
  'pt-br': { tourists: 'Turistas', tours: 'Tours' },
  'es-419': { tourists: 'Turistas', tours: 'Tours' },
  es: { tourists: 'Turistas', tours: 'Tours' }
};

export function VisitorCounter() {
  const { language } = useLanguage();
  const [data, setData] = useState<{ uniqueCount: number; totalHits: number } | null>(null);
  const [status, setStatus] = useState<'SYNCING' | 'LIVE' | 'OFFLINE'>('SYNCING');
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const magneticRef = useMagnetic<HTMLDivElement>(0.3);
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  useEffect(() => {
    setMounted(true);
    
    // 1. SOUL BINDING: Stable CID
    let cid = typeof window !== 'undefined' ? localStorage.getItem('visitor_soul_id') : null;
    if (!cid && typeof window !== 'undefined') {
       cid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
       localStorage.setItem('visitor_soul_id', cid);
    }

    // 2. OBSERVATION (GET): Just see the numbers
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/visitor-count');
        const json = await res.json();
        if (json.success) {
          setData({ uniqueCount: json.uniqueCount, totalHits: json.totalHits }); setStatus('LIVE');
        }
      } catch (e) { setStatus('OFFLINE'); }
    };

    // 3. RITUAL (POST): Only for humans who stay 3+ seconds
    const incrementStats = async () => {
      try {
        const res = await fetch('/api/visitor-count', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ cid })
        });
        const json = await res.json();
        if (json.success && json.uniqueCount) {
          setData({ uniqueCount: json.uniqueCount, totalHits: json.totalHits });
        }
      } catch (e) {}
    };

    fetchStats(); // See immediately
    
    // Human check: only bound the soul if they stay for 3 seconds
    const humanCheck = setTimeout(incrementStats, 3000);
    
    const interval = setInterval(fetchStats, 60000);
    return () => {
      clearTimeout(humanCheck);
      clearInterval(interval);
    };
  }, []);

  // Removed hydration gate for LCP optimization

  return (
    <div className="relative flex items-center pointer-events-auto select-none group">
      {/* Main Counter Button - Increased Size */}
      <div 
        ref={magneticRef}
        role="button"
        data-cursor="standard"
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => window.innerWidth >= 768 && setIsExpanded(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setIsExpanded(false)}
        className="cursor-pointer min-w-[54px] h-[54px] bg-black border border-white/20 flex flex-col items-center justify-center px-4 transition-all duration-500 hover:border-[var(--accent-blood)]"
      >
        <span className="text-[8px] font-mono font-bold text-[var(--accent-blood)] tracking-tighter mb-0.5 uppercase">
          {t.tourists}
        </span>
        <div className="flex items-center justify-center">
          <span className="text-2xl font-black font-mono leading-none tracking-tighter text-white">
            {data?.uniqueCount?.toString().padStart(4, '0') || '0000'}
          </span>
        </div>
      </div>

      {/* Slide-out Drawer (Opens Right) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 120, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-[54px] bg-black border border-white/20 border-l-0 overflow-hidden flex flex-col justify-center px-4"
          >
             <div className="flex flex-col">
                <span className="text-[8px] font-mono font-bold text-white/50 leading-tight uppercase">
                  {t.tours}
                </span>
                <span className="text-base font-black font-mono text-white leading-none italic">
                  {data?.totalHits?.toLocaleString() || '---'}
                </span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
