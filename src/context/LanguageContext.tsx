"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ja";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isTransitioning: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Read from local storage exactly once on mount, carefully ignoring SSR mismatches
  useEffect(() => {
    const saved = localStorage.getItem("mappa-lang") as Language;
    if (saved === "ja" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    if (lang === language) return;
    
    // Trigger transition state
    setIsTransitioning(true);
    localStorage.setItem("mappa-lang", lang);
    
    // Switch the text directly at the exact middle of the blur transition
    setTimeout(() => {
      setLanguageState(lang);
    }, 400); // Wait 400ms (half the 800ms transition time) to swap state

    // End transition
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isTransitioning }}>
      {/* 
        This wrapper is responsible for the calming ink effect during transitions.
        When isTransitioning is true, all text/layout blurs out and fades smoothly.
      */}
      <div 
        className={`transition-all duration-[800ms] ease-in-out w-full h-full ${
          isTransitioning ? "blur-[8px] opacity-40 grayscale" : "blur-0 opacity-100 grayscale-0"
        } ${language === 'ja' ? 'font-japanese' : ''}`}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
