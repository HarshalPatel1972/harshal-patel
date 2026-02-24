"use client";

import { motion } from "framer-motion";

export function About() {
  const specs = [
    { label: "ROLE", value: "Software Engineer" },
    { label: "CORE", value: "Go, TS, WASM" },
    { label: "DEGREE", value: "B.E. CSE (AIML)" },
    { label: "LOCATION", value: "Varanasi, IN" },
  ];

  const hardware = [
    "Go (Golang)",
    "C++ / System",
    "React / Next.js",
    "TypeScript",
    "WebAssembly",
    "IndexedDB / SQL"
  ];

  const experience = [
    { company: "Celebal Technologies", role: "Front-End Developer Intern", time: "May 2025 – Jul 2025" },
    { company: "Internshala", role: "Data Science Intern", time: "Aug 2024 – Oct 2024" },
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
            ROLE: SOFTWARE_ENGINEER
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
          
          {/* COLUMN 1: BIO (BIOS) */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="space-y-12"
          >
            <div>
                <h3 className="text-sm font-mono text-cyan-400 mb-6 tracking-widest uppercase">
                  // PROFESSIONAL_SUMMARY
                </h3>
                <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light">
                  Aspiring <span className="text-white font-medium">Software Engineer</span> with strong DSA fundamentals (300+ LeetCode) and hands-on experience building high-performance systems using <span className="text-cyan-400">Go</span>, <span className="text-cyan-400">WebAssembly</span>, and <span className="text-cyan-400">TypeScript</span>. 
                  Skilled in developing scalable web applications and optimizing memory, performance, and client-server synchronization.
                </p>
                
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
                  {specs.map((spec) => (
                    <div key={spec.label}>
                      <div className="text-[10px] font-mono text-white/30 mb-1">{spec.label}</div>
                      <div className="text-white font-mono text-sm border-l-2 border-white/10 pl-3">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
            </div>

            {/* EXPERIENCE MODULE */}
            <div>
                <h3 className="text-sm font-mono text-emerald-400 mb-6 tracking-widest uppercase">
                  // EXPERIENCE_LOGS
                </h3>
                <div className="space-y-6">
                    {experience.map((job) => (
                        <div key={job.company} className="border-l border-white/10 pl-4 relative group">
                            <div className="absolute left-[-1px] top-0 h-0 w-[1px] bg-emerald-400 group-hover:h-full transition-all duration-500" />
                            <div className="text-xs font-mono text-white/40 mb-1">{job.time}</div>
                            <div className="text-white font-bold">{job.company}</div>
                            <div className="text-sm text-white/60">{job.role}</div>
                        </div>
                    ))}
                </div>
            </div>
          </motion.div>

          {/* COLUMN 2: SKILLS & EDUCATION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="space-y-12"
          >
            {/* EDUCATION */}
            <div className="p-6 border border-white/5 bg-white/[0.02]">
                <h3 className="text-sm font-mono text-purple-400 mb-4 tracking-widest uppercase">
                  // ACADEMIC_RECORD
                </h3>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-lg text-white font-bold">Chandigarh University</div>
                        <div className="text-sm text-white/60">B.E. CSE (AIML)</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-mono text-white/40">2022-2026</div>
                        <div className="text-sm text-emerald-400 font-bold">CGPA: 8.96</div>
                    </div>
                </div>
            </div>

            {/* HARDWARE (SKILLS) */}
            <div>
                <h3 className="text-sm font-mono text-rose-400 mb-6 tracking-widest uppercase">
                  // TECHNICAL_ARSENAL
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {hardware.map((item, i) => (
                    <div 
                      key={item}
                      className="group relative h-10 bg-white/5 border border-white/10 overflow-hidden flex items-center px-4"
                    >
                      <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                      <div className="w-1 h-full bg-white/20 mr-4 group-hover:bg-rose-400 transition-colors" />
                      <span className="font-mono text-sm text-white/70 group-hover:text-white transition-colors relative z-10">
                        {item}
                      </span>
                      <span className="ml-auto text-[10px] text-white/30 group-hover:text-rose-400 transition-colors font-mono">
                        READY
                      </span>
                    </div>
                  ))}
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
