"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { SystemBanner } from "@/components/SystemBanner";
import { LanguageSelector } from "@/components/LanguageSelector";
import { LanguageTransitionWrapper } from "@/context/LanguageContext";
import { Hero } from "@/components/Hero";
const Preloader = dynamic(() => import("@/components/Preloader"), { ssr: false });
const VisitorCounter = dynamic<{}> (() => import("@/components/VisitorCounter").then(mod => mod.VisitorCounter), { ssr: false });
const Projects = dynamic(() => import("@/components/Projects").then(mod => mod.Projects), { ssr: false });
const About = dynamic(() => import("@/components/About").then(mod => mod.About), { ssr: false });
const Contact = dynamic(() => import("@/components/Contact").then(mod => mod.Contact), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer").then(mod => mod.Footer), { ssr: false });

import { ScrollLine } from "@/components/AnimationKit";
import Cursor from "@/components/ui/Cursor";
import { useFlipTransition } from "@/context/FlipContext";
import { FlipTransition } from "@/components/ui/FlipTransition";
import { SpaceWarpTransition } from "@/components/ui/SpaceWarpTransition";

function HomeContent() {
  const [showContent, setShowContent] = useState(false);
  const [isNoticeVisible, setIsNoticeVisible] = useState(true);
  const { type } = useFlipTransition();

  // Top offsets based on notice visibility
  const containerTop = isNoticeVisible ? '50px' : '20px';
  const stickyTarget = isNoticeVisible ? '50px' : '20px';

  return (
    <main className="relative">
      {type === 'FLIP' ? <FlipTransition /> : <SpaceWarpTransition />}
      {!showContent && <Preloader onComplete={() => setShowContent(true)} />}
      {showContent && <Cursor />}

      {/* Global Interface Overlay - REMOVED FADE-IN DURATION FOR INSTANT VISIBILITY */}
      <div className={`${showContent ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <Navbar />
        <ScrollLine isVisible={showContent} />
        
        {/* Zero-Lag Utility Container - Full height track */}
        <div 
          className="absolute left-4 bottom-0 z-[100] flex flex-col items-start pointer-events-none"
          style={{ top: containerTop }}
        >
          {/* 1. SCROLLING UNIT: Visitor Counter */}
          <div className="pointer-events-auto">
            <VisitorCounter />
          </div>

          {/* 10px Structural Gap */}
          <div className="h-[10px]" />

          {/* 2. ZERO-LAG PERSISTENT UNIT: Language Selector (Sticky) */}
          <div 
            className="sticky transition-all duration-700 pointer-events-auto"
            style={{ top: stickyTarget }}
          >
            <LanguageSelector />
          </div>
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
    <HomeContent />
  );
}
