"use client"

import { motion } from "framer-motion"
import {
  BookOpen,
  Heart,
  Users,
  Shield,
  Sparkles,
  Globe
} from "lucide-react"
import { SectionHeader } from "@/components/shared/section-header"

const values = [
  {
    icon: BookOpen,
    title: "Academic Excellence",
    description: "Striving for the highest standards in education and continuous improvement.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "Upholding honesty, ethics, and moral principles in all our actions.",
  },
  {
    icon: Users,
    title: "Respect",
    description: "Valuing diversity and treating everyone with dignity and consideration.",
  },
  {
    icon: Shield,
    title: "Discipline",
    description: "Maintaining order and self-control as foundations for success.",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description: "Embracing creativity and new ideas in teaching and learning.",
  },
  {
    icon: Globe,
    title: "Social Responsibility",
    description: "Contributing positively to our community and environment.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export function CoreValues() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50/50 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="Our Values"
          title="Core Values We Live By"
          description="The principles that guide our institution and shape our students' character."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 mt-8 sm:mt-16"
        >
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={itemVariants}
              className="group flex flex-col sm:flex-row gap-2 sm:gap-4 p-2 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300"
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform mx-auto sm:mx-0">
                <value.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-serif text-[10px] sm:text-lg font-semibold text-slate-900 mb-1 sm:mb-2 leading-tight">
                  {value.title}
                </h3>
                <p className="text-[8px] sm:text-sm text-slate-600 leading-tight sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
