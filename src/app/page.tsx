"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { SystemBanner } from "@/components/SystemBanner";
import { LanguageProvider, LanguageTransitionWrapper } from "@/context/LanguageContext";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ScrollLine } from "@/components/AnimationKit";

const Preloader = dynamic(() => import("@/components/Preloader"));

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  return (
    <LanguageProvider>
      <main className="relative">
        <Preloader onComplete={() => setShowContent(true)} />
        
        {/* Fixed HUD elements MUST remain outside LanguageTransitionWrapper */}
        <div className={`transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <Navbar />
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
    </LanguageProvider>
  );
}
