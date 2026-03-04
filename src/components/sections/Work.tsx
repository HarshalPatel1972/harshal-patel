"use client";

import { AnimeIn } from "@/components/ui/AnimeIn";
import { animate as anime } from "animejs";
import { APPS } from "@/lib/apps";

export function Work() {
  return (
    <section id="work" className="py-6 md:py-10 px-4 md:px-12 lg:px-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <AnimeIn 
          initial={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          duration={1000}
          className="mb-4 md:mb-6 border-b border-white/10 pb-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-1 md:gap-0"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-space tracking-tighter text-white">
            MODULE<br/>REGISTRY<span className="text-rose-400">.</span>
          </h2>
          <div className="font-mono text-[10px] md:text-xs text-white/40 text-left md:text-right">
            TOTAL_MODULES: {APPS.length.toString().padStart(2, '0')}<br/>
            STATUS: ACTIVE
          </div>
        </AnimeIn>
 
        {/* MODULE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {APPS.map((app, i) => (
            <AnimeIn
              key={app.name}
              initial={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              delay={i * 50}
              duration={1000}
            >
              <div
                className="group relative h-48 bg-zinc-900/50 border border-white/10 rounded-sm overflow-hidden cursor-pointer"
                onMouseEnter={(e) => {
                  anime(e.currentTarget, {
                    translateY: -5,
                    duration: 300,
                    easing: 'outQuad'
                  });
                }}
                onMouseLeave={(e) => {
                  anime(e.currentTarget, {
                    translateY: 0,
                    duration: 300,
                    easing: 'outQuad'
                  });
                }}
              >
                {/* Background Glow */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at center, ${app.hex}, transparent)` }}
                />

                {/* Scanline Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50" />

                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  
                  {/* Top: Header */}
                  <div className="flex justify-between items-start">
                    <div className="font-mono text-[10px] text-white/40 tracking-widest">
                      MOD_0{i + 1}
                    </div>
                    <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
                  </div>

                  {/* Center: Icon */}
                  <div className="self-center transform group-hover:scale-110 transition-transform duration-500">
                    <app.icon 
                      size={48} 
                      className="opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: app.hex, filter: `drop-shadow(0 0 15px ${app.hex}60)` }}
                    />
                  </div>

                  {/* Bottom: Label */}
                  <div>
                    <h3 className="text-2xl font-space font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                      {app.name.toUpperCase()}
                    </h3>
                    <p className="font-mono text-[10px] text-white/40 uppercase">
                      Core System Component
                    </p>
                  </div>

                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-white/20" />
                <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-white/20" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-white/20" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-white/20" />

              </div>
            </AnimeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
