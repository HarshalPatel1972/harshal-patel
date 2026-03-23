"use client";

import React, { useEffect, useState } from 'react';

/**
 * High-Fidelity Visitor HUD
 * Fetches and displays the live persistent visitor count from Redis.
 */
export function VisitorCounter() {
  const [data, setData] = useState<{ uniqueCount: number; totalHits: number } | null>(null);
  const [status, setStatus] = useState<'SYNCING' | 'LIVE' | 'OFFLINE'>('SYNCING');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("[HUD_SYSTEM] Initializing Uplink...");
    
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/visitor-count');
        
        // Ensure we actually got JSON (prevents "Unexpected token <" error)
        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType || !contentType.includes("application/json")) {
           console.warn("[HUD_SYSTEM] Received non-JSON response.");
           setStatus('OFFLINE');
           return;
        }

        const json = await res.json();
        
        console.log("[HUD_SYSTEM] Sync Data:", json);
        
        if (json.success) {
          setData({ 
            uniqueCount: json.uniqueCount, 
            totalHits: json.totalHits 
          });
          setStatus('LIVE');
        } else {
          setStatus('OFFLINE');
        }
      } catch (e) {
        console.error("[HUD_SYSTEM] Uplink Failed:", e);
        setStatus('OFFLINE');
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[99999] pointer-events-none select-none animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col gap-1 items-start">
        {/* HUD Indicator */}
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md border border-[var(--text-bone)]/20 px-3 py-1.5 brutal-shadow-sm">
           <div className={`w-1.5 h-1.5 rounded-full ${status === 'SYNCING' ? 'bg-amber-500 animate-pulse' : 'bg-[var(--accent-blood)] shadow-[0_0_8px_rgba(217,17,17,0.6)]'}`} />
           <span className="font-mono text-[9px] font-bold text-[var(--text-bone)] tracking-widest uppercase opacity-80">
             {status === 'SYNCING' ? 'ESTABLISHING_UPLINK...' : 'UPSTREAM_ACTIVE_//_SECURE'}
           </span>
        </div>

        {/* The Number Display */}
        <div className="bg-black border-2 border-black p-2 flex items-baseline gap-3 brutal-shadow">
          <div className="flex flex-col">
             <span className="text-[10px] font-mono font-black text-[var(--accent-blood)] leading-none mb-1 opacity-70">UNIQUE_ENTITIES</span>
             <span className="text-3xl md:text-5xl font-black font-mono leading-none tracking-tighter text-[var(--text-bone)]">
               {data?.uniqueCount?.toString().padStart(4, '0') || '0000'}
             </span>
          </div>
          <div className="h-8 w-[1px] bg-[var(--text-bone)]/20 mx-1" />
          <div className="flex flex-col opacity-60">
             <span className="text-[8px] font-mono font-bold text-[var(--text-bone)] leading-none uppercase mb-1">Total_I/O</span>
             <span className="text-sm font-black font-mono leading-none text-[var(--text-bone)]">
               {data?.totalHits || '0'}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}
