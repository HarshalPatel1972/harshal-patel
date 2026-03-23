"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { SystemBanner } from "@/components/SystemBanner";
import { LanguageSelector } from "@/components/LanguageSelector";
import { LanguageProvider, LanguageTransitionWrapper } from "@/context/LanguageContext";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ScrollLine } from "@/components/AnimationKit";
import Cursor from "@/components/ui/Cursor";

import { SignalProvider } from "@/context/SignalContext";
import { FlipProvider, useFlipTransition } from "@/context/FlipContext";
import { FlipTransition } from "@/components/ui/FlipTransition";
import { SpaceWarpTransition } from "@/components/ui/SpaceWarpTransition";

const Preloader = dynamic(() => import("@/components/Preloader"), { ssr: false });
const VisitorCounter = dynamic(() => import("@/components/VisitorCounter").then(mod => mod.VisitorCounter), { ssr: false });

function HomeContent() {
  const [showContent, setShowContent] = useState(false);
  const [isNoticeVisible, setIsNoticeVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const { type } = useFlipTransition();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // HUD Positioning Logic
  const counterTop = isNoticeVisible ? 50 : 20;
  const langInitialTop = isNoticeVisible ? 114 : 84;
  const scrollThreshold = 64; // Distance to slide
  
  // Calculate dynamic top for Language Selector
  const dynamicLangTop = Math.max(counterTop, langInitialTop - scrollY);

  return (
    <main className="relative">
      {type === 'FLIP' ? <FlipTransition /> : <SpaceWarpTransition />}
      {!showContent && <Preloader onComplete={() => setShowContent(true)} />}
      {showContent && <Cursor />}

      {/* Global Interface Overlay */}
      <div className={`transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <Navbar />
        <ScrollLine isVisible={showContent} />
        
        {/* 1. SCROLLING UNIT: Visitor Counter (Absolute) */}
        <div 
          className="absolute left-4 z-[50] flex flex-col items-start"
          style={{ top: `${counterTop}px` }}
        >
          <VisitorCounter />
        </div>

        {/* 2. DYNAMIC HUD UNIT: Language Selector (Fixed) */}
        <div 
          className="fixed left-4 z-[100] flex flex-col items-start transition-all duration-300 ease-out"
          style={{ top: `${dynamicLangTop}px` }}
        >
          <LanguageSelector />
        </div>
      </div>

      <LanguageTransitionWrapper className={`transition-opacity duration-700 mr-12 md:mr-16 ${showContent ? "opacity-100" : "opacity-0"}`}>
        <SystemBanner isVisible={isNoticeVisible} onDismiss={() => setIsNoticeVisible(false)} />
        <Hero />
        
        {/* Priority 5: High-Performance Off-Screen Rendering */}
        <section style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 800px' } as any}>
          <Projects />
        </section>
        
        <section style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 600px' } as any}>
          <About />
        </section>
        
        <section style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 400px' } as any}>
          <Contact />
        </section>
        
        <Footer />
      </LanguageTransitionWrapper>
    </main>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <SignalProvider>
        <FlipProvider>
          <HomeContent />
        </FlipProvider>
      </SignalProvider>
    </LanguageProvider>
  );
}
