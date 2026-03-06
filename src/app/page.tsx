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
        
        {/* Navbar is position:fixed — must NOT be inside any wrapper div that could affect its height */}
        <Navbar />

        <LanguageTransitionWrapper className={`transition-opacity duration-700 mr-12 md:mr-16 ${showContent ? "opacity-100" : "opacity-0"}`}>
          <SystemBanner />
          <ScrollLine />
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
