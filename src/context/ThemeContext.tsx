'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { themes, type Theme, type ThemeName } from '@/lib/themes';

type ThemeContextType = {
  current: Theme;
  setTheme: (name: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<Theme>(themes[0]);

  const applyTheme = useCallback((theme: Theme) => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--color-bg',     theme.bg);
    root.style.setProperty('--color-text',   theme.text);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-glow',   theme.glow);
  }, []);

  const setTheme = useCallback((name: ThemeName) => {
    const theme = themes.find(t => t.name === name) ?? themes[0];
    setCurrent(theme);
    applyTheme(theme);
    localStorage.setItem('portfolio-theme', name);
  }, [applyTheme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('portfolio-theme') as ThemeName | null;
    const theme = themes.find(t => t.name === saved) ?? themes[0];
    setCurrent(theme);
    applyTheme(theme);
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ current, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
