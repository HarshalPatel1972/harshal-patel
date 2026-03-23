"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Compact Adaptable Visitor Counter
 * Clean MAPPA aesthetic with minimal nomenclature.
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
        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType || !contentType.includes("application/json")) {
           setStatus('OFFLINE');
           return;
        }

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
    <div className="relative flex items-stretch pointer-events-auto select-none">
      {/* Detail Slide-out (Left to avoid overlap) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 140, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-[var(--text-bone)] border border-black overflow-hidden flex flex-col justify-center px-4 z-0"
          >
             <div className="flex flex-col">
                <span className="text-[8px] font-mono font-bold text-black/50 leading-tight">LOG_ENTRIES</span>
                <span className="text-lg font-black font-mono text-black leading-none italic">
                  {data?.totalHits?.toLocaleString() || '---'}
                </span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Counter Block */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer group relative flex flex-col items-end bg-black border border-[var(--text-bone)]/20 hover:border-[var(--accent-blood)] transition-all duration-500 py-1.5 px-3 brutal-shadow-sm"
      >
        <div className="flex flex-col items-end">
           <span className="text-[8px] font-mono font-bold text-[var(--accent-blood)] tracking-tighter mb-0.5">VISITORS</span>
           <div className="flex items-baseline gap-1.5">
             <span className="text-2xl font-black font-mono leading-none tracking-tighter text-[var(--text-bone)]">
                {data?.uniqueCount?.toString().padStart(4, '0') || '0000'}
             </span>
             <div className={`w-1 h-3 ${status === 'LIVE' ? 'bg-[var(--accent-blood)] animate-pulse' : 'bg-white/10'}`} />
           </div>
        </div>
        
        {/* Subtle Side ID */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--text-bone)]/10" />
      </div>
    </div>
  );
}
