"use client";

import { useEffect, useState } from "react";

export function BuildTag() {
  const [mounted, setMounted] = useState(false);
  // Generate timestamp only once per build/mount
  const [buildTime] = useState(new Date().toLocaleTimeString()); 

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed top-0 right-0 z-[100] bg-red-600 text-white font-mono text-[10px] px-2 py-1 pointer-events-none opacity-80">
      VERCEL_DEBUG: {buildTime}
    </div>
  );
}
