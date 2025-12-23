"use client"

import { motion } from "framer-motion"
import {
  GraduationCap,
  Users,
  Heart,
  Trophy,
  BookOpen,
  Shield,
  Sparkles,
  Target
} from "lucide-react"
import { SectionHeader } from "@/components/shared/section-header"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: GraduationCap,
    title: "CBSE Excellence",
    description: "Comprehensive CBSE curriculum designed to foster academic brilliance and ensuring consistent board exam success for every student.",
    iconClass: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
  },
  {
    icon: Users,
    title: "Experienced Faculty",
    description: "Dedicated teachers with years of experience in nurturing young minds effectively.",
    iconClass: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30",
  },
  {
    icon: Heart,
    title: "Value-Based Education",
    description: "Strong emphasis on moral values, discipline, and character building alongside academics.",
    iconClass: "text-rose-600 bg-rose-100 dark:bg-rose-900/30",
  },
  {
    icon: Trophy,
    title: "Holistic Development",
    description: "Equal focus on sports, arts, and extracurricular activities for all-round growth.",
    iconClass: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
  },
  {
    icon: BookOpen,
    title: "Modern Teaching",
    description: "Smart classrooms and innovative teaching methods for enhanced learning experience.",
    iconClass: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    icon: Shield,
    title: "Safe Environment",
    description: "Secure campus with CCTV surveillance and strict safety protocols for students.",
    iconClass: "text-primary bg-primary/10",
  },
  {
    icon: Sparkles,
    title: "Affordable Fees",
    description: "Quality education at reasonable fees, making excellence accessible to all families.",
    iconClass: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30",
  },
  {
    icon: Target,
    title: "Individual Attention",
    description: "Optimal student-teacher ratio ensuring personalized attention for every child.",
    iconClass: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
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

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03),transparent_70%)]" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <SectionHeader
          badge="Why Choose Us"
          title="Excellence That Sets Us Apart"
          description="Discover what makes Decent Public School the preferred choice for quality CBSE education in Guwahati."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 mt-8 sm:mt-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-xl sm:rounded-3xl p-2 sm:p-8 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 border border-slate-100 bg-white shadow-lg shadow-slate-200/50 flex flex-col"
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-6 transition-transform group-hover:scale-110",
                  feature.iconClass
                )}
              >
                <feature.icon className="w-4 h-4 sm:w-7 sm:h-7" />
              </div>

              <h3 className="font-serif text-[10px] sm:text-xl font-bold text-slate-900 mb-1 sm:mb-3 leading-tight">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-tight sm:leading-relaxed text-[8px] sm:text-sm flex-grow line-clamp-3 sm:line-clamp-none">
                {feature.description}
              </p>

              {/* Decor */}
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <feature.icon className="w-16 h-16" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
