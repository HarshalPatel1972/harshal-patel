"use client";

import { useState } from "react";

export function SystemBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  // We set right-12 md:right-16 so it exactly meets the edge of the right-aligned timeline navbar
  return (
    <div className="fixed top-0 left-0 right-12 md:right-16 z-[60] bg-[#0a0a0a] border-b border-[var(--accent-blood)] flex items-center justify-between px-4 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
         {/* Brutalist Warning Label */}
         <div className="bg-[var(--accent-blood)] text-white text-[9px] md:text-[10px] font-black font-display tracking-widest px-2 py-0.5 uppercase shrink-0 flex items-center gap-1.5">
           <span className="w-1.5 h-1.5 bg-white animate-pulse" />
           NOTICE
         </div>
         
         {/* Technical Context */}
         <span className="font-mono text-[8px] md:text-[10px] text-[var(--text-bone)]/80 tracking-wide uppercase truncate">
           This portfolio is currently undergoing a live redesign. Some features may be temporarily unavailable. Thank you for your patience.
         </span>
      </div>

      {/* Dismiss Button */}
      <button 
        onClick={() => setVisible(false)} 
        className="text-[var(--text-bone)]/40 hover:text-[var(--accent-blood)] transition-colors font-mono text-sm px-2 shrink-0"
        aria-label="Dismiss system notice"
      >
        ✕
      </button>
    </div>
  );
}
