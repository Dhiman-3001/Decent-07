"use client"

import { motion } from "framer-motion"
import { GraduationCap } from "lucide-react"

export function AboutHero() {
  const yearsServed = new Date().getFullYear() - 2007

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-50/50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(var(--primary)/0.05),transparent_60%)] dark:bg-[radial-gradient(circle_at_top_right,oklch(var(--primary)/0.1),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[24px_24px]" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-premium flex items-center justify-center shadow-xl"
          >
            <GraduationCap className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6"
          >
            <span className="text-sky-400">About</span>{" "}
            <span className="text-white">
              Decent Public School
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-lg text-muted-foreground dark:text-white/70 leading-relaxed"
          >
            Established on 1st January 2007, with a vision to provide quality education accessible to all, DPS has been a cornerstone of academic excellence in Japorigog, Guwahati. Served over {yearsServed} long years, we continue to inspire and empower our students to achieve their full potential.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
