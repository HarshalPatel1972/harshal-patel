"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MAPPA_100 [SOUL_REGISTRY]
 * A high-fidelity, cursed-energy inspired visitor tracker.
 */
export function VisitorCounter() {
  const [data, setData] = useState<{ uniqueCount: number; totalHits: number } | null>(null);
  const [status, setStatus] = useState<'SYNCING' | 'LIVE' | 'OFFLINE'>('SYNCING');
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
    // NOMENCLATURE: Calibration of Domain Resonance
    console.log("[DOMAIN_LOG] Scanning for Soul Signatures...");
    
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
        console.error("[DOMAIN_LOG] Seal Integrity Compromised.", e);
        setStatus('OFFLINE');
      }
    };

    fetchStats(true);
    const interval = setInterval(() => fetchStats(false), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-0 right-12 z-[99999] flex flex-col items-end group pointer-events-auto">
      {/* MAPPA Header: Vertical nomenclature */}
      <div className="flex items-start gap-0">
        
        {/* The Actionable Core */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer group flex flex-col items-end"
        >
          {/* Top Status Tag */}
          <div className="bg-[var(--accent-blood)] px-2 py-0.5 mb-[-1px] border border-black transform -skew-x-12">
            <span className="font-mono text-[8px] font-bold text-black uppercase tracking-tighter">
              {status === 'LIVE' ? 'RESONANCE_STABLE' : 'CALIBRATING...'}
            </span>
          </div>

          {/* Main Visual Block */}
          <div className="bg-black border-2 border-[var(--accent-blood)] p-3 relative hover:scale-105 transition-transform duration-300">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[var(--text-bone)]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[var(--text-bone)]" />

            <div className="flex flex-col items-end gap-0">
              <span className="text-[9px] font-mono text-[var(--text-bone)] opacity-40 leading-none mb-1">
                [SOUL_SIGNATURES]
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-black font-mono leading-none tracking-tighter text-[var(--text-bone)]">
                  {data?.uniqueCount?.toString().padStart(4, '0') || '0000'}
                </span>
                <div className={`w-2 h-2 animate-pulse bg-[var(--accent-blood)] ${status === 'LIVE' ? 'opacity-100 shadow-[0_0_8px_red]' : 'opacity-20'}`} />
              </div>
            </div>
          </div>

          {/* Vertical Nomenclature Strip */}
          <div className="h-20 w-8 bg-[var(--text-bone)] flex items-center justify-center border-x-2 border-black">
             <span className="font-mono text-[10px] font-black text-black uppercase -rotate-90 whitespace-nowrap tracking-[0.2em]">
               MAPPA_GEN_10.0
             </span>
          </div>
        </div>

        {/* Slide-Out Detail Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 180, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="h-full bg-[var(--text-bone)] border-2 border-black overflow-hidden flex flex-col justify-center px-4 ml-[-2px] z-[-1]"
            >
               <div className="flex flex-col gap-3">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono font-bold text-black opacity-60">TOTAL_MANIFESTATIONS</span>
                    <span className="text-xl font-black font-mono text-black leading-none">
                      {data?.totalHits?.toLocaleString() || '---'}
                    </span>
                  </div>
                  <div className="w-full h-[1px] bg-black/10" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono font-bold text-black opacity-60">DOM_STAT_ID</span>
                    <span className="text-[10px] font-black font-mono text-[var(--accent-blood)] leading-none uppercase">
                      SECURE_SHARD_82
                    </span>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Decorative Element */}
      <div className="w-1 bg-[var(--accent-blood)] h-32 absolute right-[-8px] top-1/2 -translate-y-1/2 opacity-30" />
    </div>
  );
}
