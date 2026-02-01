import Image from "next/image";

// ... existing imports

export function Hero() {
  // ... existing code

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-4 md:px-20 overflow-hidden bg-[#050505] pt-20 md:pt-0">
      
      {/* ... existing detailed grid lines ... */}

      <AnimatePresence>
        {isComplete && (
          <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* 🟢 COLUMN 1: SYSTEM META (2 Cols) */}
            <motion.div 
              className="md:col-span-2 flex flex-row md:flex-col gap-4 font-mono text-[9px] md:text-[10px] text-white/40 tracking-widest uppercase md:pt-4 justify-between md:justify-start border-b md:border-b-0 border-white/10 pb-4 md:pb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={showContent ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
               {/* ... Keep existing content (SYS.ONLINE, LOC, ID) ... */}
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                 <span>SYS.ONLINE</span>
              </div>
              <div>LOC: VARANASI_</div>
              <div className="hidden md:block">ID: HARSHAL_V1.0</div>
            </motion.div>

            {/* 🟦 COLUMN 2: MAIN TEXT CONTENT (6 Cols) */}
            <div className="md:col-span-6 relative z-20">
              
              <h1 className="font-space font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tighter text-white mb-6 md:mb-8">
                <motion.div 
                   initial={{ opacity: 0, y: 50 }}
                   animate={showContent ? { opacity: 1, y: 0 } : {}}
                   transition={{ duration: 0.8, ease: "circOut", delay: 0.2 }}
                >
                  SOFTWARE
                </motion.div>
                <motion.div 
                   className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400"
                   initial={{ opacity: 0, y: 50 }}
                   animate={showContent ? { opacity: 1, y: 0 } : {}}
                   transition={{ duration: 0.8, ease: "circOut", delay: 0.3 }}
                >
                  ENGINEER
                </motion.div>
              </h1>

              <motion.div 
                className="max-w-xl border-l-[1px] border-white/20 pl-4 md:pl-6 space-y-4"
                initial={{ opacity: 0 }}
                animate={showContent ? { opacity: 1 } : {}}
                transition={{ delay: 0.6, duration: 1 }}
              >
                <p className="font-mono text-xs sm:text-sm md:text-base text-white/70 leading-relaxed">
                  <span className="text-emerald-500 font-bold">{`>`}</span> Executing logical design patterns to solve complex user problems.
                </p>
                <p className="font-mono text-xs sm:text-sm md:text-base text-white/70 leading-relaxed">
                  <span className="text-cyan-500 font-bold">{`>`}</span> Optimizing for scale, performance, and aesthetic precision.
                </p>
              </motion.div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-12 w-full sm:w-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={showContent ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
              >
                 <a 
                   href="#work"
                   className="group relative px-6 py-4 sm:py-3 bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-colors overflow-hidden text-center sm:text-left"
                 >
                    <div className="absolute inset-0 bg-emerald-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="font-mono text-xs font-bold text-white tracking-[0.2em] group-hover:text-emerald-400 transition-colors">
                      [ ACCESS_WORK ]
                    </span>
                 </a>
                 <a 
                   href="#contact"
                   className="px-6 py-4 sm:py-3 border border-transparent hover:border-white/10 transition-colors text-center sm:text-left"
                 >
                    <span className="font-mono text-xs text-white/50 hover:text-white transition-colors tracking-[0.2em]">
                      // INITIATE_CONTACT
                    </span>
                 </a>
              </motion.div>
            </div>

            {/* 🖼️ COLUMN 3: HERO IMAGE (4 Cols) */}
            <motion.div 
               className="md:col-span-4 relative flex justify-center md:justify-end mt-12 md:mt-0"
               initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
               animate={showContent ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
               transition={{ duration: 1, delay: 0.5 }}
            >
               <div className="relative w-[280px] h-[350px] md:w-[320px] md:h-[400px] border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden group">
                  {/* Decorative Corners */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-emerald-500/50 z-20" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-emerald-500/50 z-20" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-emerald-500/50 z-20" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-emerald-500/50 z-20" />

                  {/* Image */}
                  <div className="absolute inset-2 overflow-hidden bg-black">
                      <Image 
                        src="/harshal-0.png" 
                        alt="Harshal Patel"
                        fill
                        className="object-cover object-top opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                      />
                      {/* Scanline Overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  </div>

                  {/* Meta Label */}
                  <div className="absolute bottom-4 left-4 z-20">
                     <div className="font-mono text-[9px] text-emerald-500 tracking-widest mb-1">IDENTITY_CONFIRMED</div>
                     <div className="font-space font-bold text-white text-lg leading-none">HARSHAL.P</div>
                  </div>
               </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="absolute bottom-6 md:bottom-12 right-6 md:right-20 text-right"
        initial={{ opacity: 0 }}
        animate={showContent ? { opacity: 1 } : {}}
        transition={{ delay: 1.5 }}
      >
        <span className="block font-mono text-[8px] md:text-[9px] text-white/30 tracking-widest mb-1">CURRENT_STATUS</span>
        <span className="text-emerald-400 font-mono text-[10px] md:text-xs tracking-wider">
          OPEN_FOR_OPPORTUNITIES
        </span>
      </motion.div>

    </section>
  );
}
