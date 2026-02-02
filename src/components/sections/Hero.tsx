"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lightning } from "@phosphor-icons/react";
import Image from "next/image";
import { usePreloader } from "@/lib/preloader-context";
import { useEffect, useState } from "react";
import { HeroGrid } from "@/components/ui/HeroGrid";

export function Hero() {
  const { isComplete } = usePreloader();
  const [showContent, setShowContent] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  // 🎛️ TUNING STATE
  const [fontSize, setFontSize] = useState(12); 
  const [fontFamily, setFontFamily] = useState('Impact, sans-serif');
  const [blendMode, setBlendMode] = useState("normal");
  const [textZIndex, setTextZIndex] = useState(20);

  const fontOptions = [
    { name: "Impact", value: 'Impact, sans-serif' },
    { name: "TWK Lausanne", value: '"TWK Lausanne", sans-serif' },
    { name: "Space Grotesk", value: 'var(--font-space-grotesk), sans-serif' },
    { name: "Geist Sans", value: 'var(--font-geist-sans), sans-serif' },
    { name: "Arial Black", value: '"Arial Black", sans-serif' },
    { name: "Helvetica", value: 'Helvetica, sans-serif' },
  ];

  const blendOptions = ["normal", "overlay", "screen", "soft-light", "color-dodge", "difference", "multiply"];

  const questions = [
    "Problem Solving?",
    "Web Designing?",
    "Performance Tuning?",
    "UI Engineering?",
  ];

  // Cycle Questions
  useEffect(() => {
    if (!showContent) return;
    const interval = setInterval(() => {
      setCurrentQuestion((prev) => (prev + 1) % questions.length);
    }, 4500); // ⏱️ 4.5s Hold
    return () => clearInterval(interval);
  }, [showContent]);

  // Trigger Content Show
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  return (
    <section className="relative min-h-screen flex flex-col justify-end px-4 md:px-10 overflow-hidden bg-[#050505] pb-8 md:pb-12">
      
      {/* 🎛️ TUNING CONSOLE */}
      <div className="absolute top-24 left-4 z-50 flex flex-col gap-3 p-4 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-white w-72 shadow-2xl">
        <span className="text-xs font-mono text-cyan-400 tracking-widest border-b border-white/10 pb-1">TUNING CONSOLE</span>
        
        {/* Size Slider */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-neutral-400 w-8">SIZE</label>
          <input 
            type="range" 
            min="2" 
            max="20" 
            step="0.1" 
            value={fontSize} 
            onChange={(e) => setFontSize(parseFloat(e.target.value))}
            className="flex-1 accent-cyan-400 cursor-pointer h-1 bg-white/20 rounded-full appearance-none"
          />
          <span className="text-xs font-mono w-10 text-right">{fontSize.toFixed(1)}vw</span>
        </div>

        {/* Font Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-neutral-400 w-8">FONT</label>
          <select 
            value={fontFamily} 
            onChange={(e) => setFontFamily(e.target.value)}
            className="flex-1 bg-neutral-900/80 border border-white/20 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            {fontOptions.map(f => (
              <option key={f.name} value={f.value}>{f.name}</option>
            ))}
          </select>
        </div>

        {/* Blend Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-neutral-400 w-8">BLEND</label>
          <select 
            value={blendMode} 
            onChange={(e) => setBlendMode(e.target.value)}
            className="flex-1 bg-neutral-900/80 border border-white/20 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            {blendOptions.map(b => (
              <option key={b} value={b} className="uppercase">{b}</option>
            ))}
          </select>
        </div>

        {/* Z-Index Toggles */}
        <div className="flex items-center gap-2">
           <label className="text-xs font-bold text-neutral-400 w-8">LAYER</label>
           <div className="flex gap-2 flex-1">
             <button onClick={() => setTextZIndex(0)} className={`flex-1 text-xs py-1 rounded transition-colors ${textZIndex === 0 ? 'bg-cyan-500 text-black font-bold' : 'bg-white/10 hover:bg-white/20'}`}>BACK</button>
             <button onClick={() => setTextZIndex(20)} className={`flex-1 text-xs py-1 rounded transition-colors ${textZIndex === 20 ? 'bg-cyan-500 text-black font-bold' : 'bg-white/10 hover:bg-white/20'}`}>FRONT</button>
           </div>
        </div>
      </div>

      {/* 🖼️ HERO BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-10">
        <Image 
          src="/harshal-1.png" 
          alt="Harshal Patel"
          fill
          className="object-cover object-[50%_25%]"
          priority
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#050505] via-[#050505]/40 md:via-transparent to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
      </div>

      <HeroGrid />

      {/* 📛 CENTER STACKED NAME (Draggable Mode) */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
        style={{ zIndex: textZIndex }}
      >
        <motion.h1 
          drag
          dragMomentum={false}
          onDragEnd={(event, info) => console.log('HARSHAL | Offset:', info.offset, '| Size:', fontSize + 'vw', '| Font:', fontFamily)}
          className="font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-white/50 to-white/5 pointer-events-auto cursor-grab active:cursor-grabbing" 
          style={{ 
            fontSize: `${fontSize}vw`, 
            fontFamily: fontFamily, 
            mixBlendMode: blendMode as any,
            filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))' 
          }}
        >
          HARSHAL
        </motion.h1>
        <motion.h1 
          drag
          dragMomentum={false}
          onDragEnd={(event, info) => console.log('PATEL | Offset:', info.offset, '| Size:', fontSize + 'vw', '| Font:', fontFamily)}
          className="font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-white/50 to-white/5 pointer-events-auto cursor-grab active:cursor-grabbing" 
          style={{ 
            fontSize: `${fontSize}vw`, 
            fontFamily: fontFamily, 
            marginTop: '-1vw',
            mixBlendMode: blendMode as any,
            filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))' 
          }}
        >
          PATEL
        </motion.h1>
      </div>

      <AnimatePresence>
        {false && showContent && (
          <div className="relative z-20 w-full max-w-[95%] mx-auto flex flex-col justify-end h-full pointer-events-none">
            
            {/* 1. SLOT MACHINE VERTICAL */}
            <div className="mb-0 h-8 md:h-16 relative flex items-end w-full overflow-hidden"> 
              <AnimatePresence mode="wait">
                <motion.h2 
                  key={currentQuestion}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                  className="absolute bottom-0 left-0 text-xl md:text-4xl lg:text-5xl font-bold font-lausanne tracking-tight pl-2 bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/40 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                  style={{ fontFamily: '"TWK Lausanne", sans-serif' }}
                >
                  {questions[currentQuestion]}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* 2. MASSIVE ANSWER (Brilliant Glass) */}
            <motion.h1 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-2xl md:text-[2.5rem] lg:text-[4rem] xl:text-[5.5rem] 2xl:text-[6.5rem] leading-none font-black uppercase font-lausanne tracking-tighter whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-b from-white via-white/80 to-white/10"
              style={{ 
                fontFamily: '"TWK Lausanne", sans-serif',
                wordSpacing: '0.4em',
                WebkitTextStroke: '1px rgba(255,255,255,0.3)',
                filter: 'drop-shadow(0 0 25px rgba(255,255,255,0.2))'
              }}
            >
              I CAN DO THIS ALL DAY
            </motion.h1>

          </div>
        )}
      </AnimatePresence>
      
      {/* CREDITS */}
      <motion.div 
        className="absolute bottom-6 md:bottom-12 right-6 md:right-20 text-right z-30"
        initial={{ opacity: 0 }}
        animate={showContent ? { opacity: 1 } : {}}
        transition={{ delay: 1.5 }}
      >
        <span className="block font-mono text-[8px] md:text-[9px] text-white/30 tracking-widest mb-1">CREDITS</span>
        <a href="https://fiddle.digital" target="_blank" rel="noopener noreferrer" className="text-white font-space font-bold text-[10px] md:text-xs tracking-wider flex items-center justify-end gap-2 hover:text-cyan-400 transition-colors">
          <Lightning weight="fill" className="text-cyan-400 w-3 h-3" />
          Fiddle.Digital
        </a>
      </motion.div>

    </section>
  );
}
