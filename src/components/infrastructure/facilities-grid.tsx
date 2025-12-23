"use client"

import { motion } from "framer-motion"
import {
  Monitor,
  FlaskConical,
  BookOpen,
  Dumbbell,
  Music,
  Laptop,
  Bus,
  Utensils
} from "lucide-react"
import { SectionHeader } from "@/components/shared/section-header"

const facilities = [
  {
    icon: Monitor,
    title: "Smart Classrooms",
    description: "Air-conditioned classrooms equipped with interactive whiteboards, projectors, and audio-visual aids for enhanced learning.",
    features: ["Interactive Boards", "Projectors", "AC Rooms", "Ergonomic Furniture"],
  },
  {
    icon: FlaskConical,
    title: "Science Laboratories",
    description: "Well-equipped Physics, Chemistry, and Biology labs with modern equipment for practical learning and experiments.",
    features: ["Physics Lab", "Chemistry Lab", "Biology Lab", "Safety Equipment"],
  },
  {
    icon: Laptop,
    title: "Computer Lab",
    description: "State-of-the-art computer lab with latest systems and high-speed internet for digital literacy and coding education.",
    features: ["Modern Computers", "High-Speed Internet", "Coding Classes", "Digital Learning"],
  },
  {
    icon: BookOpen,
    title: "Library",
    description: "Extensive collection of books, journals, and digital resources to encourage reading habits and research skills.",
    features: ["10,000+ Books", "Digital Resources", "Reading Room", "Reference Section"],
  },
  {
    icon: Dumbbell,
    title: "Sports Facilities",
    description: "Spacious playground and indoor sports facilities for physical education and various sports activities.",
    features: ["Playground", "Indoor Games", "Sports Equipment", "Trained Coaches"],
  },
  {
    icon: Music,
    title: "Activity Rooms",
    description: "Dedicated spaces for music, dance, art, and other co-curricular activities to nurture creative talents.",
    features: ["Music Room", "Dance Studio", "Art Room", "Activity Hall"],
  },
  {
    icon: Bus,
    title: "Transport",
    description: "Safe and reliable school bus service covering major areas of Guwahati with GPS tracking for parents' peace of mind.",
    features: ["GPS Tracking", "Trained Drivers", "Wide Coverage", "Safety Features"],
  },
  {
    icon: Utensils,
    title: "Cafeteria",
    description: "Hygienic cafeteria serving nutritious meals and snacks prepared under strict quality standards.",
    features: ["Hygienic Kitchen", "Nutritious Food", "Affordable Prices", "Clean Dining"],
  },
]

export function FacilitiesGrid() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="Our Facilities"
          title="World-Class Infrastructure"
          description="Modern facilities designed to support comprehensive education and holistic development."
        />

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <facility.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-xl font-semibold text-blue-900 dark:text-white mb-2">
                    {facility.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {facility.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {facility.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
