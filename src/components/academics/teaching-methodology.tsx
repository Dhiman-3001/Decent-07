"use client"

import { motion } from "framer-motion"
import {
  Lightbulb,
  Users,
  Monitor,
  Target,
  MessageSquare,
  TrendingUp
} from "lucide-react"
import { SectionHeader } from "@/components/shared/section-header"

const methods = [
  {
    icon: Lightbulb,
    title: "Conceptual Learning",
    description: "Focus on understanding concepts rather than memorization for lasting knowledge.",
  },
  {
    icon: Users,
    title: "Collaborative Learning",
    description: "Group activities and projects that develop teamwork and communication skills.",
  },
  {
    icon: Monitor,
    title: "Technology Integration",
    description: "Smart classrooms and digital resources for enhanced learning experiences.",
  },
  {
    icon: Target,
    title: "Personalized Attention",
    description: "Small class sizes ensuring individual attention for every student.",
  },
  {
    icon: MessageSquare,
    title: "Interactive Sessions",
    description: "Encouraging questions, discussions, and active participation in class.",
  },
  {
    icon: TrendingUp,
    title: "Continuous Assessment",
    description: "Regular evaluations to track progress and identify areas for improvement.",
  },
]

export function TeachingMethodology() {
  return (
    <section className="py-24 bg-linear-to-b from-white via-indigo-50/20 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="Our Approach"
          title="Teaching Methodology"
          description="Modern teaching methods that make learning engaging and effective."
        />

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 mt-8 sm:mt-16">
          {methods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 text-center border border-slate-100 flex flex-col h-full"
            >
              <div className="w-8 h-8 sm:w-14 sm:h-14 mx-auto rounded-lg sm:rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-2 sm:mb-4 flex-shrink-0">
                <method.icon className="w-4 h-4 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="font-serif text-xs sm:text-lg font-semibold text-slate-900 mb-1 sm:mb-2 leading-tight">
                {method.title}
              </h3>
              <p className="text-[10px] sm:text-sm text-slate-600 leading-tight sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                {method.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
