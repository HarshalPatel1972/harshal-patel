"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const TRANSLATIONS = {
  en: { tourists: 'Unique tourists', tours: 'Total tours', touristsAt: 'Souls bound', toursAt: 'Rites performed' },
  ja: { tourists: 'ユニーク', tours: '合計', touristsAt: '魂の数', toursAt: '儀式数' },
  hi: { tourists: 'अद्वितीय सैलानी', tours: 'कुल दौरे', touristsAt: 'आत्माएं', toursAt: 'अनुष्ठान' }
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
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const dist = Math.min(10, Math.hypot(e.clientX - centerX, e.clientY - centerY) / 40);
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
    <div className="relative flex items-center justify-center pointer-events-auto select-none group/counter">
      {/* THE CLEAVED CURSED EYE ARTIFACT */}
      <div 
        ref={eyeRef}
        role="button"
        data-cursor="standard"
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => window.innerWidth >= 768 && setIsExpanded(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setIsExpanded(false)}
        className="cursor-pointer w-48 h-32 relative flex items-center justify-center pointer-events-auto"
      >
        {/* TOP EYELID - SHARP MANGA CUT */}
        <motion.div 
           animate={{ y: isExpanded ? -28 : 0, rotate: isExpanded ? -5 : 0 }}
           transition={{ type: "spring", stiffness: 200, damping: 15 }}
           className="absolute inset-0 bg-white border-[10px] border-black z-30 pointer-events-none origin-bottom-left"
           style={{ borderRadius: "100% 100% 0 0", clipPath: "inset(0 0 50% 0)" }}
        />

        {/* BOTTOM EYELID - SHARP MANGA CUT */}
        <motion.div 
           animate={{ y: isExpanded ? 28 : 0, rotate: isExpanded ? 5 : 0 }}
           transition={{ type: "spring", stiffness: 200, damping: 15 }}
           className="absolute inset-0 bg-white border-[10px] border-black z-30 pointer-events-none origin-top-right"
           style={{ borderRadius: "0 0 100% 100%", clipPath: "inset(50% 0 0 0)" }}
        />

        {/* INTERNAL SOUL CONTENT (REVEALED ON CLEAVE) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent z-10">
          
          {/* TOURISTS IRIS (PRIMARY) */}
          <motion.div 
            animate={{ 
               x: mousePos.x, 
               y: isExpanded ? mousePos.y - 15 : mousePos.y,
               scale: isExpanded ? 0.85 : 1
            }}
            className="relative w-16 h-16 rounded-full border-4 border-black bg-[#d91111] shadow-[0_0_25px_rgba(217,17,17,0.5)] flex flex-col items-center justify-center overflow-hidden z-20"
          >
             <div className="w-1.5 h-full bg-black rounded-full opacity-80" /> {/* SLIT PUPIL */}
             <div className="absolute bottom-2 font-mono font-black text-[12px] text-white leading-none">
                {data?.uniqueCount?.toString().padStart(4, '0') || '0000'}
             </div>
             <div className="absolute top-1 right-2 w-3 h-3 bg-white/30 rounded-full" />
          </motion.div>

          {/* TOURS IRIS (SECONDARY - REVEALED) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{ opacity: 1, scale: 0.85, y: 15, x: mousePos.x * 1.5 }}
                exit={{ opacity: 0, scale: 0, y: 0 }}
                className="relative w-16 h-16 rounded-full border-4 border-black bg-[#0ee0c3] shadow-[0_0_25px_rgba(14,224,195,0.4)] flex flex-col items-center justify-center overflow-hidden z-20 mt-[-10px]"
              >
                <div className="w-1.5 h-full bg-black rounded-full opacity-80" />
                <div className="absolute top-2 font-mono font-black text-[12px] text-black leading-none uppercase">
                   {t.tours}
                </div>
                <div className="absolute bottom-2 font-mono font-black text-[14px] text-black leading-none">
                   {data?.totalHits?.toLocaleString() || '---'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BACKGROUND TEXTURE WITHIN THE WOUND */}
          <div className="absolute inset-0 ink-splatter opacity-20 z-0" />
        </div>

        {/* SHADOW FOR DEPTH */}
        <div className="absolute inset-x-4 bottom-[-10px] h-4 bg-black/40 blur-xl rounded-[100%] opacity-40 z-0" />
      </div>

      {/* FLOATING CAPTION (MANGA STYLE) */}
      <AnimatePresence>
         {isExpanded && (
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             className="absolute left-[-180px] top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none hidden xl:flex"
           >
              <div className="bg-black text-white px-4 py-2 border-2 border-[var(--accent-blood)] brutal-shadow tilt-left">
                <span className="text-xs font-black uppercase tracking-widest">{t.touristsAt}</span>
              </div>
              <div className="bg-white text-black px-4 py-2 border-2 border-black brutal-shadow tilt-right mt-2 mr-[-10px]">
                <span className="text-xs font-black uppercase tracking-widest">{t.toursAt}</span>
              </div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
