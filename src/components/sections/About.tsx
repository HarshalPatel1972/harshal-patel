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
    <section id="about" className="py-6 md:py-8 px-4 md:px-12 lg:px-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-4 md:mb-6 border-b border-white/10 pb-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-1 md:gap-0"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-space tracking-tighter text-white">
            SYSTEM<br/>SPECS<span className="text-cyan-400">.</span>
          </h2>
          <div className="font-mono text-[10px] md:text-xs text-white/40 text-left md:text-right">
            ID: HARSHAL_PATEL<br/>
            ROLE: SOFTWARE_ENGINEER
          </div>
        </motion.div>
 
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          
          {/* COLUMN 1: BIO (BIOS) */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="space-y-6"
          >
            <div>
                <h3 className="text-[10px] font-mono text-cyan-400 mb-3 tracking-widest uppercase">
                   // PROFESSIONAL_SUMMARY
                </h3>
                <p className="text-sm md:text-base text-white/80 leading-relaxed font-light">
                  Aspiring <span className="text-white font-medium">Software Engineer</span> with strong DSA fundamentals (300+ LeetCode) and hands-on experience building high-performance systems using <span className="text-cyan-400">Go</span>, <span className="text-cyan-400">WebAssembly</span>, and <span className="text-cyan-400">TypeScript</span>. 
                </p>
                
                <div className="mt-4 grid grid-cols-2 gap-y-4 gap-x-4">
                  {specs.map((spec) => (
                    <div key={spec.label}>
                      <div className="text-[9px] font-mono text-white/30 mb-0.5">{spec.label}</div>
                      <div className="text-white font-mono text-xs border-l-2 border-white/10 pl-2">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
            </div>
 
            {/* EXPERIENCE MODULE */}
            <div>
                <h3 className="text-[10px] font-mono text-emerald-400 mb-3 tracking-widest uppercase">
                   // EXPERIENCE_LOGS
                </h3>
                <div className="space-y-3">
                    {experience.map((job) => (
                        <div key={job.company} className="border-l border-white/10 pl-3 relative group">
                            <div className="absolute left-[-1px] top-0 h-0 w-[1px] bg-emerald-400 group-hover:h-full transition-all duration-500" />
                            <div className="text-[10px] font-mono text-white/40 mb-0.5">{job.time}</div>
                            <div className="text-white font-bold text-sm">{job.company}</div>
                            <div className="text-xs text-white/60">{job.role}</div>
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
            className="space-y-6"
          >
            {/* EDUCATION */}
            <div className="p-4 border border-white/5 bg-white/[0.02]">
                <h3 className="text-[10px] font-mono text-purple-400 mb-3 tracking-widest uppercase">
                   // ACADEMIC_RECORD
                </h3>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-base text-white font-bold">Chandigarh University</div>
                        <div className="text-xs text-white/60">B.E. CSE (AIML)</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-mono text-white/40">2022-2026</div>
                        <div className="text-xs text-emerald-400 font-bold">CGPA: 8.96</div>
                    </div>
                </div>
            </div>
 
            {/* HARDWARE (SKILLS) */}
            <div>
                <h3 className="text-[10px] font-mono text-rose-400 mb-3 tracking-widest uppercase">
                   // TECHNICAL_ARSENAL
                </h3>
                
                <div className="grid grid-cols-2 gap-2">
                  {hardware.map((item, i) => (
                    <div 
                      key={item}
                      className="group relative h-8 bg-white/5 border border-white/10 overflow-hidden flex items-center px-3"
                    >
                      <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                      <div className="w-1 h-full bg-white/20 mr-2 group-hover:bg-rose-400 transition-colors" />
                      <span className="font-mono text-[10px] text-white/70 group-hover:text-white transition-colors relative z-10 whitespace-nowrap">
                        {item}
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
