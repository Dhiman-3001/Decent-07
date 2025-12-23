"use client"

import { motion } from "framer-motion"
import { Baby, BookOpen, GraduationCap } from "lucide-react"
import { SectionHeader } from "@/components/shared/section-header"
import { cn } from "@/lib/utils"

const sections = [
  {
    id: "primary",
    icon: Baby,
    title: "Primary Section",
    grades: "Nursery to Class 5",
    description:
      "Building strong foundations through play-based learning, phonics, and activity-oriented teaching. Focus on developing reading, writing, and basic mathematical skills.",
    subjects: [
      "English",
      "Hindi",
      "Mathematics",
      "Environmental Studies",
      "General Knowledge",
      "Art & Craft",
      "Physical Education",
    ],
    colorClass: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
    dotClass: "bg-emerald-500",
  },
  {
    id: "middle",
    icon: BookOpen,
    title: "Middle School",
    grades: "Class 6 to Class 8",
    description:
      "Transitioning to subject-specific learning with emphasis on conceptual understanding. Introduction to science, social studies, and computer education.",
    subjects: [
      "English",
      "Hindi",
      "Mathematics",
      "Science",
      "Social Science",
      "Sanskrit/Assamese",
      "Computer Science",
      "Art Education",
    ],
    colorClass: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    dotClass: "bg-blue-500",
  },
  {
    id: "secondary",
    icon: GraduationCap,
    title: "Secondary School",
    grades: "Class 9 to Class 10",
    description:
      "Rigorous preparation for board examinations with focus on analytical skills and exam techniques. Career guidance and counseling support provided.",
    subjects: [
      "English",
      "Hindi",
      "Mathematics",
      "Science (Physics, Chemistry, Biology)",
      "Social Science",
      "Information Technology",
      "Physical Education",
    ],
    colorClass: "text-violet-600 bg-violet-100 dark:bg-violet-900/30",
    dotClass: "bg-violet-500",
  },
]

export function AcademicSections() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-blue-400 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="Academic Structure"
          title="Our Academic Sections"
          description="Structured learning pathways designed for each stage of student development."
        />

        <div className="space-y-8 mt-16">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 border border-slate-100"
            >
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center", section.colorClass)}>
                      <section.icon className="w-7 h-7" />
                    </div>
                    <div className="-mt-1.5">
                      <h3 className="font-serif text-2xl font-semibold text-blue-900 dark:text-white leading-none mb-1">
                        {section.title}
                      </h3>
                      <p className="text-base font-semibold text-muted-foreground leading-tight">
                        {section.grades}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-white mb-3">
                    Subjects Offered
                  </h4>
                  <ul className="space-y-2">
                    {section.subjects.map((subject) => (
                      <li
                        key={subject}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <span className={cn("w-1.5 h-1.5 rounded-full", section.dotClass)} />
                        {subject}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
