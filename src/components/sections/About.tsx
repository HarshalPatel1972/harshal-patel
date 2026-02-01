"use client";

import { motion } from "framer-motion";

export function About() {
  const specs = [
    { label: "ROLE", value: "Software Engineer" },
    { label: "STACK", value: "Go / TS / WASM" },
    { label: "EDUCATION", value: "B.E. CSE (2022-26)" },
    { label: "LOCATION", value: "Varanasi, IN" },
  ];

  const hardware = [
    "Go (Golang) / C++",
    "React / Next.js",
    "WebAssembly (WASM)",
    "System Architecture",
    "IndexedDB / SQL",
    "Docker / CI/CD"
  ];

  return (
    <section id="about" className="py-20 md:py-32 px-4 md:px-12 lg:px-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16 border-b border-white/10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-2 md:gap-0"
        >
          <h2 className="text-4xl md:text-6xl font-bold font-space tracking-tighter text-white">
            SYSTEM<br/>SPECS<span className="text-cyan-400">.</span>
          </h2>
          <div className="font-mono text-[10px] md:text-xs text-white/40 text-left md:text-right">
            ID: HARSHAL_PATEL<br/>
            ROLE: SYSTEMS_ENGINEER
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
          
          {/* COLUMN 1: BIO (BIOS) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-mono text-cyan-400 mb-6 tracking-widest uppercase">
              // BIOS_DESCRIPTION
            </h3>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-light">
              Aspiring <span className="text-white font-medium">Software Engineer</span> with strong DSA fundamentals and hands-on experience building high-performance systems. 
              I specialize in scalable web applications and optimizing client-server synchronization.
            </p>
            
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
              {specs.map((spec) => (
                <div key={spec.label}>
                  <div className="text-[10px] font-mono text-white/30 mb-1">{spec.label}</div>
                  <div className="text-white font-mono text-sm border-l-2 border-white/10 pl-3">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* COLUMN 2: SKILLS (HARDWARE) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-sm font-mono text-rose-400 mb-6 tracking-widest uppercase">
              // HARDWARE_MODULES
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {hardware.map((item, i) => (
                <div 
                  key={item}
                  className="group relative h-12 bg-white/5 border border-white/10 overflow-hidden flex items-center px-4"
                >
                  {/* Hover Fill Effect */}
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                  
                  {/* Tech Bar */}
                  <div className="w-1 h-full bg-white/20 mr-4 group-hover:bg-cyan-400 transition-colors" />
                  
                  <span className="font-mono text-sm text-white/70 group-hover:text-white transition-colors relative z-10">
                    {item}
                  </span>

                  {/* Right Aligned Status */}
                  <span className="ml-auto text-[10px] text-white/30 group-hover:text-cyan-400 transition-colors font-mono">
                    INSTALLED
                  </span>
                </div>
              ))}
            </div>

            {/* EDUCATION DB */}
            <div className="mt-12">
                <h3 className="text-sm font-mono text-rose-400 mb-6 tracking-widest uppercase">// EDUCATION_DB</h3>
                <div className="border border-white/10 bg-white/5 p-4 rounded-sm hover:border-rose-400 transition-colors group">
                    <div className="text-white font-bold font-space group-hover:text-rose-400 transition-colors">Chandigarh University</div>
                    <div className="text-[10px] font-mono text-white/40">B.E. CSE AIML | 2022 - 2026</div>
                    <div className="text-xs text-cyan-400 mt-2 font-mono">CGPA: 8.96</div>
                </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
