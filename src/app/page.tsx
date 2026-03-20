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
import { CursorProvider, useCursor } from "@/context/CursorContext";

import { SignalProvider } from "@/context/SignalContext";
import { FlipProvider } from "@/context/FlipContext";
import { FlipTransition } from "@/components/ui/FlipTransition";

const Preloader = dynamic(() => import("@/components/Preloader"), { ssr: false });

function InnerHome() {
  const [showContent, setShowContent] = useState(false);
  const cursorRef = useCursor();

  return (
    <main className="relative">
      <FlipTransition />
      <Preloader onComplete={() => setShowContent(true)} />
      {showContent && <Cursor ref={cursorRef} />}
      
      {/* Fixed HUD elements MUST remain outside LanguageTransitionWrapper */}
      <div className={`transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <Navbar />
        <LanguageSelector />
        <ScrollLine isVisible={showContent} />
      </div>

      <LanguageTransitionWrapper className={`transition-opacity duration-700 mr-12 md:mr-16 ${showContent ? "opacity-100" : "opacity-0"}`}>
        <SystemBanner />
        <Hero />
        
        <Projects />
        
        <About />

        <Contact />
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
          <CursorProvider>
            <InnerHome />
          </CursorProvider>
        </FlipProvider>
      </SignalProvider>
    </LanguageProvider>
  );
}
