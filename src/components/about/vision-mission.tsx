"use client"

import { motion } from "framer-motion"
import { Eye, Target, Lightbulb } from "lucide-react"
import { SectionHeader } from "@/components/shared/section-header"
import { cn } from "@/lib/utils"

const items = [
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "To be a leading educational institution that empowers students with knowledge, skills, and values to become responsible global citizens and lifelong learners who contribute meaningfully to society.",
    iconContainerClass: "bg-blue-100 dark:bg-blue-900/40",
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To provide holistic education that nurtures intellectual curiosity, creativity, and character. We strive to create a supportive learning environment where every student can discover their potential and achieve excellence.",
    iconContainerClass: "bg-rose-100 dark:bg-rose-900/40",
    iconClass: "text-rose-600 dark:text-rose-400",
  },
  {
    icon: Lightbulb,
    title: "Our Philosophy",
    description:
      "Education is not just about academic achievement but about developing the whole person. We believe in balancing rigorous academics with moral education, physical fitness, and creative expression.",
    iconContainerClass: "bg-amber-100 dark:bg-amber-900/40",
    iconClass: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: Target,
    title: "Our Goals",
    description:
      "To continuously evolve our teaching methodologies and infrastructure to meet global standards, ensuring our students are well-prepared for future challenges and opportunities.",
    iconContainerClass: "bg-green-100 dark:bg-green-900/40",
    iconClass: "text-green-600 dark:text-green-400",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
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

export function VisionMission() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-indigo-50/20 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="Our Foundation"
          title="Vision, Mission & Philosophy"
          description="The guiding principles that shape our approach to education and student development."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-8 mt-8 sm:mt-16"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              className={cn(
                "bg-white border border-slate-100 rounded-xl sm:rounded-3xl p-2 sm:p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center justify-start h-full",
                index === 3 && "md:hidden"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-16 sm:h-16 mx-auto rounded-lg sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-6 flex-shrink-0",
                  item.iconContainerClass
                )}
              >
                <item.icon className={cn("w-4 h-4 sm:w-8 sm:h-8", item.iconClass)} />
              </div>
              <h3 className="font-serif text-[10px] sm:text-2xl font-semibold text-slate-900 mb-1 sm:mb-4 leading-tight w-full">
                {item.title}
              </h3>
              <p className="text-slate-600 leading-tight sm:leading-relaxed text-[8px] sm:text-base line-clamp-4 sm:line-clamp-none">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
