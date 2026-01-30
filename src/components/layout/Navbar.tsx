"use client";

import { motion } from "framer-motion";
import { usePreloader } from "@/lib/preloader-context";
import { APPS } from "@/lib/apps";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isComplete } = usePreloader();

  const activeApps = APPS.filter((_, i) => i < 4); // Aero to Momentum
  const systemApps = APPS.filter((_, i) => i >= 4); // Hum to AirShare

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 md:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* LEFT: Project Ecosystem */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Only show icons if boot is complete OR let layoutId handle entrance? 
            If isComplete is false, these should probably NOT be rendered if we want them to fly in?
            Actually, for layoutId to work, they MUST be rendered when the Grid unmounts.
            So they should be present but layoutId will handle the position from center to here.
        */}
        {isComplete && (
            <div className="flex items-center gap-4">
                {activeApps.map((app) => (
                <motion.div
                    key={app.name}
                    layoutId={app.name}
                    className="relative group cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <div className={cn(
                        "p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md", 
                        "hover:bg-white/10 transition-colors"
                    )}>
                        <app.icon 
                            size={20} 
                            color={app.hex} 
                            style={{ filter: `drop-shadow(0 0 8px ${app.hex}80)` }}
                        />
                    </div>
                </motion.div>
                ))}
            </div>
        )}
      </div>

      {/* RIGHT: System / Socials */}
      <div className="flex items-center gap-4 md:gap-6">
         {isComplete && (
            <div className="flex items-center gap-4">
                {systemApps.map((app) => (
                <motion.div
                    key={app.name}
                    layoutId={app.name}
                    className="relative group cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                     <div className={cn(
                        "p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md", 
                        "hover:bg-white/10 transition-colors"
                    )}>
                        <app.icon 
                            size={20} 
                            color={app.hex}
                            style={{ filter: `drop-shadow(0 0 8px ${app.hex}80)` }} 
                        />
                    </div>
                </motion.div>
                ))}
            </div>
         )}
         
         {/* Standard Contact Button (Fades in normally) */}
         <motion.a
            href="#contact"
            className="hidden md:block px-5 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-white/90 transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isComplete ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.0 }} // Delays until after icons land
         >
            Let's Talk
         </motion.a>
      </div>
    </motion.nav>
  );
}
