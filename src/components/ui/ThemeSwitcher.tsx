'use client';

import { useTheme } from '@/context/ThemeContext';
import { themes } from '@/lib/themes';
import { useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const { current, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Return null on mobile/touch devices as per constraints 📱
  if (typeof window !== 'undefined') {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return null;
  }

  if (!mounted) return null;

  return (
    <div className="fixed top-[50px] left-[61px] flex items-center gap-2 z-[70] h-9">
      {themes.map((theme) => {
        const isActive = current.name === theme.name;
        
        return (
          <button
            key={theme.name}
            onClick={() => setTheme(theme.name)}
            className={`
              h-7 px-3 rounded-full border transition-all duration-400
              font-mono text-[9px] font-black uppercase tracking-[0.15em]
              flex items-center justify-center
              ${isActive 
                ? 'bg-[var(--color-accent)] text-[var(--color-bg)] border-[var(--color-accent)] shadow-[0_4px_15px_rgba(0,0,0,0.3)]' 
                : 'bg-transparent text-[var(--color-text)] opacity-50 border-[var(--color-text)]/20 hover:opacity-100 hover:border-[var(--color-text)]'
              }
            `}
          >
            {theme.name}
          </button>
        );
      })}
    </div>
  );
}
