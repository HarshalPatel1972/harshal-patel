"use client";

import { motion } from "framer-motion";
import { usePreloader } from "@/lib/preloader-context";

export function Navbar() {
  const { isComplete } = usePreloader();

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 md:px-12"
      initial={{ y: -100, opacity: 0 }}
      animate={isComplete ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Logo */}
      <a href="#" className="text-xl font-bold tracking-tight text-white">
        HP<span className="text-indigo-400">.</span>
      </a>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        {["About", "Work", "Contact"].map((item, i) => (
          <motion.a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-sm text-white/70 hover:text-white transition-colors"
            initial={{ y: -20, opacity: 0 }}
            animate={isComplete ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
          >
            {item}
          </motion.a>
        ))}
      </div>

      {/* CTA */}
      <motion.a
        href="#contact"
        className="hidden md:block px-4 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-white/90 transition-colors"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={isComplete ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        Let's Talk
      </motion.a>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-white">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </motion.nav>
  );
}
