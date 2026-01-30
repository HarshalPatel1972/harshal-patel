"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePreloader } from "@/lib/preloader-context";
import { APPS } from "@/lib/apps";
import { cn } from "@/lib/utils";

export function Preloader() {
  const { isComplete, setComplete } = usePreloader();
  const [stage, setStage] = useState<"boot" | "check" | "launch">("boot");
  
  // Phase 4: Hero Reveal happens in Hero.tsx listening to isComplete
  
  useEffect(() => {
    // Phase 1: Boot (0s - 0.5s)
    // Handled by initial render state "boot"
    
    // Phase 2: System Check (0.5s - 1.5s)
    const checkTimer = setTimeout(() => {
        setStage("check");
    }, 500);

    // Phase 3: Launch (4.5s) -> Triggers Unmount & Fly to Navbar
    const launchTimer = setTimeout(() => {
        setStage("launch");
        // We allow a small buffer for the "break" animation before unmounting?
        // Actually, for layoutId to work effectively, we unmount this component
        // and mount the Navbar ones simultaneously.
        // setComplete(true) triggers Navbar mount.
        setComplete(); 
    }, 4500); // Extended to 4.5s for readability

    return () => { clearTimeout(checkTimer); clearTimeout(launchTimer); };
  }, [setComplete]);

  // If complete, we unmount the entire loading container
  // AnimatePresence in Page.tsx (if used) or just null return logic handles exit?
  // Ideally, we return NULL here so the Grid unmounts.
  if (isComplete) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f0f11] text-white overflow-hidden">
      
      {/* 🖥️ SYSTEM TERMINAL TEXT */}
      <div className="absolute bottom-12 left-12 font-mono text-xs text-white/20">
         <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
         >
             _
         </motion.span>
         SYSTEM_INIT // HARSHAL_OS v2026
      </div>
      
      {/* 📦 THE DOCK CONTAINER */}
      <motion.div 
        className="relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
         <div className="grid grid-cols-4 gap-6 md:gap-8">
            {APPS.map((app, i) => (
                <AppIcon 
                    key={app.name} 
                    app={app} 
                    index={i} 
                    stage={stage} 
                />
            ))}
         </div>
      </motion.div>

      {/* Background Mesh Gradient (Subtle) */}
      <div className="absolute inset-0 z-[-1] pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px]" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-900/20 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}

function AppIcon({ app, index, stage }: { app: any, index: number, stage: "boot" | "check" | "launch" }) {
    // "Check" Phase: Staggered activation
    // If stage is "boot", grayscale & low opacity
    // If stage is "check", remove filter, pop scale
    
    // We use a derived boolean for "isActive" based on index delay if we wanted precise control,
    // but Framer Motion variants are cleaner.
    
    const isActive = stage === "check" || stage === "launch";
    const delay = index * 0.1; // Sequential stagger

    return (
        <motion.div
            layoutId={app.name} // CRITICAL: This connects to Navbar
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0.3, filter: "grayscale(100%) scale(1)" }}
            animate={isActive ? { 
                opacity: 1, 
                filter: "grayscale(0%) scale(1)",
                transition: { delay: delay, duration: 0.3 }
            } : {}}
            whileHover={{ scale: 1.1 }}
        >
             {/* Icon Box */}
             <motion.div 
                className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center bg-white/10 border border-white/5",
                    "shadow-lg"
                )}
                animate={isActive ? {
                    boxShadow: `0 0 15px ${app.hex}40`, // Glow
                    borderColor: `${app.hex}40`
                } : {}}
                // Spring Pop effect on activation
                variants={{
                    active: { scale: [1, 1.1, 1] }
                }}
             >
                <app.icon 
                    size={32} 
                    color={app.hex} 
                    className="transition-all duration-300"
                />
             </motion.div>
             
             {/* Label */}
             <motion.span 
                className="text-[10px] font-medium tracking-wider uppercase text-white/50"
                animate={isActive ? { color: "white", opacity: 1 } : {}}
             >
                {app.name}
             </motion.span>
        </motion.div>
    )
}
