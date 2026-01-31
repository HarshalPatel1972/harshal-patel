"use client";

import { useEffect, useState } from "react";

// 🔢 MANUAL BUILD COUNTER
// Update this number manually before every push!
const BUILD_ID = 5;

export function BuildTag() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed top-0 right-0 z-[9999] pointer-events-none">
      <div className="bg-red-600 text-white font-mono text-[10px] px-3 py-1 font-bold shadow-lg">
        VERCEL BUILD: #{BUILD_ID}
      </div>
    </div>
  );
}
