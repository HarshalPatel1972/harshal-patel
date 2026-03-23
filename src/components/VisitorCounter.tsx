"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Unit-Optimized Visitor Counter
 * Designed to fit into a structural margin/navbar.
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
          setData({ uniqueCount: json.uniqueCount, totalHits: json.totalHits });
          setStatus('LIVE');
        } else {
          setStatus('OFFLINE');
        }
      } catch (e) {
        setStatus('OFFLINE');
      }
    };

    fetchStats(true);
    const interval = setInterval(() => fetchStats(false), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-full border-b border-white/10 group select-none pointer-events-auto">
      {/* Information Drawer - Slides Left */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 120, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="absolute right-full top-0 h-full bg-black border border-white/20 border-r-0 overflow-hidden flex flex-col justify-center px-3 z-50"
          >
             <div className="flex flex-col">
                <span className="text-[7px] font-mono font-bold text-white/40 leading-tight">LOG_ENTRIES</span>
                <span className="text-sm font-black font-mono text-white leading-none italic">
                  {data?.totalHits?.toLocaleString() || '---'}
                </span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Touchpoint */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer w-full aspect-square flex flex-col items-center justify-center transition-all duration-300 hover:bg-white/5"
      >
        <span className="text-[7px] font-mono font-bold text-[var(--accent-blood)] tracking-tighter mb-0.5 opacity-60">TOURISTS</span>
        <span className="text-lg font-black font-mono leading-none tracking-tighter text-white">
          {data?.uniqueCount?.toString().padStart(4, '0') || '0000'}
        </span>
        <div className={`mt-1.5 w-4 h-[1px] ${status === 'LIVE' ? 'bg-[var(--accent-blood)]' : 'bg-white/10'}`} />
      </div>
    </div>
  );
}
