"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

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
  const [data, setData] = useState<{ uniqueCount: number; totalHits: number; activeNow?: number; totalCount?: number } | null>(null);
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
        if (json.success) setData({ uniqueCount: json.uniqueCount, totalHits: json.totalHits, activeNow: json.activeNow, totalCount: json.totalCount });
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
      const dist = Math.min(8, Math.hypot(e.clientX - centerX, e.clientY - centerY) / 50);
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
    <div className="relative flex items-center pointer-events-auto select-none group">
      {/* THE CURSED EYE - ACTIVE TRACKING */}
      <div 
        ref={eyeRef}
        role="button"
        data-cursor="standard"
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => window.innerWidth >= 768 && setIsExpanded(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setIsExpanded(false)}
        className="cursor-pointer w-20 h-20 bg-white border-2 border-black flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 shadow-[8px_8px_0_rgba(0,0,0,1)] relative overflow-hidden"
        style={{ 
          borderRadius: "100% 0 100% 0", 
          transform: `rotate(-45deg)`
        }}
      >
        <div className="absolute inset-0 bg-radial-gradient(circle, #fff, #ddd) opacity-50" />
        
        <div 
          className="relative w-10 h-10 rounded-full border-4 border-black bg-[#d91111] flex items-center justify-center transition-transform duration-75"
          style={{ 
            transform: `rotate(45deg) translate(${mousePos.x}px, ${mousePos.y}px)`,
            boxShadow: `0 0 20px #d91111`
          }}
        >
          <div className="w-2 h-6 bg-black rounded-full" />
           <div className="absolute top-1 rotate-45 right-1 w-2 h-2 bg-white/40 rounded-full" />
        </div>

        <AnimatePresence>
          {!isExpanded && (
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
               style={{ transform: "rotate(45deg)" }}
            >
               <span className="text-[10px] font-black text-black bg-white px-2 border border-black translate-y-6">
                 {data?.uniqueCount || '0000'}
               </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-16 bg-[#fdfaf0] border-2 border-black border-l-0 overflow-hidden flex flex-col justify-center px-8 shadow-[8px_8px_0_rgba(0,0,0,1)] ml-[-4px]"
          >
             <div className="flex flex-col min-w-[max-content]">
                <span className="text-[10px] font-black text-black opacity-40 uppercase tracking-widest leading-none mb-1">
                  {t.tours}
                </span>
                <span className="text-2xl font-black font-mono text-[#d91111] leading-none">
                  {data?.totalHits?.toLocaleString() || '---'}
                </span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
