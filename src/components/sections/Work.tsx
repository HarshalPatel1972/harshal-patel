"use client";

import { motion } from "framer-motion";

export function Work() {
  const projects = [
    { title: "Project One", category: "Web Development", color: "from-indigo-500 to-purple-600" },
    { title: "Project Two", category: "UI/UX Design", color: "from-emerald-500 to-teal-600" },
    { title: "Project Three", category: "Mobile App", color: "from-orange-500 to-red-600" },
  ];

  return (
    <section id="work" className="py-24 px-6 md:px-12 bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white mb-12"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          Selected Work<span className="text-indigo-400">.</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color}`} />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white/70 text-sm mb-1">{project.category}</p>
                <h3 className="text-white text-xl font-semibold">{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
