"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Prominent Left-Side Visitor Counter
 * Restored to the left with increased size and rightward expansion.
 */
export function VisitorCounter() {
  const [data, setData] = useState<{ uniqueCount: number; totalHits: number } | null>(null);
  const [status, setStatus] = useState<'SYNCING' | 'LIVE' | 'OFFLINE'>('SYNCING');
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchStats = async (doIncr = false) => {
      try {
        const res = await fetch(`/api/visitor-count${doIncr ? '?incr=1' : ''}`);
        const json = await res.json();
        if (json.success) {
          setData({ uniqueCount: json.uniqueCount, totalHits: json.totalHits }); setStatus('LIVE');
        } else { setStatus('OFFLINE'); }
      } catch (e) { setStatus('OFFLINE'); }
    };
    fetchStats(true);
    const interval = setInterval(() => fetchStats(false), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative flex items-center pointer-events-auto select-none group">
      {/* Main Counter Button - Increased Size */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer min-w-[54px] h-[54px] bg-black border border-white/20 flex flex-col items-center justify-center px-4 transition-all duration-500 hover:border-[var(--accent-blood)]"
      >
        <span className="text-[8px] font-mono font-bold text-[var(--accent-blood)] tracking-tighter mb-0.5 uppercase">Tourists</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black font-mono leading-none tracking-tighter text-white">
            {data?.uniqueCount?.toString().padStart(4, '0') || '0000'}
          </span>
          <div className={`w-0.5 h-3 ${status === 'LIVE' ? 'bg-[var(--accent-blood)] animate-pulse' : 'bg-white/10'}`} />
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
                <span className="text-[8px] font-mono font-bold text-white/50 leading-tight uppercase">Tours</span>
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
