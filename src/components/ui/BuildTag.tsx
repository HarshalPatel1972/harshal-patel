"use client";

import { useEffect, useState } from "react";

const BUILD_ID = 15;

export function BuildTag() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed top-2 right-2 z-[9999] pointer-events-none opacity-50 hover:opacity-100 transition-opacity">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 text-white font-mono text-[9px] px-2 py-0.5 rounded-full shadow-lg flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        V.{BUILD_ID}
      </div>
    </div>
  );
}
