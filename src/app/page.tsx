"use client";

import { useState } from "react";
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
  const { type } = useFlipTransition();

  return (
    <main className="relative">
      {type === 'FLIP' ? <FlipTransition /> : <SpaceWarpTransition />}
      {!showContent && <Preloader onComplete={() => setShowContent(true)} />}
      {showContent && <Cursor />}

      {/* Global Interface Overlay */}
      <div className={`transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <Navbar />
        <ScrollLine isVisible={showContent} />
        
        {/* Adaptable Left-Side Utility Stack */}
        <div 
          className="fixed left-4 z-[100] flex flex-col items-start gap-[10px] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{ top: isNoticeVisible ? '50px' : '20px' }}
        >
          <VisitorCounter />
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
