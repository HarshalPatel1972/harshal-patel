"use client";

import { motion } from "framer-motion";
import { usePreloader } from "@/lib/preloader-context";

export function Hero() {
  const { isComplete } = usePreloader();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Greeting */}
        <motion.p
          className="text-sm md:text-base text-indigo-400 font-mono mb-4"
          initial={{ y: 30, opacity: 0 }}
          animate={isComplete ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Hello, I'm
        </motion.p>

        {/* Name */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
          initial={{ y: 50, opacity: 0 }}
          animate={isComplete ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Harshal Patel
        </motion.h1>

        {/* Role */}
        <motion.p
          className="text-lg md:text-xl text-white/60 mb-8 max-w-2xl mx-auto font-mono"
          initial={{ y: 30, opacity: 0 }}
          animate={isComplete ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Systems Engineer | Full Stack Developer
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ y: 30, opacity: 0 }}
          animate={isComplete ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a
            href="#work"
            className="px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-colors"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="px-8 py-3 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-colors"
          >
            Contact Me
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={isComplete ? { opacity: 1, y: [0, 10, 0] } : {}}
        transition={{ opacity: { delay: 1 }, y: { duration: 2, repeat: Infinity } }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <motion.div
            className="w-1 h-2 bg-white/50 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
