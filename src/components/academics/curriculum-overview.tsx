"use client"

import { motion } from "framer-motion"
import { CheckCircle, Award } from "lucide-react"
import { SectionHeader } from "@/components/shared/section-header"

const highlights = [
  "CBSE Based Curriculum",
  "Comprehensive curriculum from Nursery to Class 10",
  "Focus on conceptual understanding over rote learning",
  "Regular assessments and progress tracking",
  "Remedial classes for students needing extra support",
  "Career guidance and counseling",
  "Integration of technology in teaching",
  "Activity-based learning approach",
]

export function CurriculumOverview() {
  return (
    <section className="py-24" id="curriculum">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="Curriculum"
          title="CBSE Based Curriculum"
          description="A comprehensive educational framework fostering academic excellence and holistic growth."
        />
        <div className="grid lg:grid-cols-2 gap-16 items-center mt-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >

            {/* Mobile Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative lg:hidden mb-8"
            >
              <div className="aspect-square rounded-3xl bg-linear-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 overflow-hidden shadow-xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                      <Award className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-blue-900 dark:text-white mb-2">
                      CBSE Based
                    </h3>
                    <p className="text-muted-foreground">
                      Curriculum
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl -z-10" />
            </motion.div>

            <p className="text-muted-foreground leading-relaxed mb-8">
              Our CBSE curriculum is thoughtfully designed to provide a strong academic foundation while encouraging creativity and critical thinking. We follow the latest NCERT guidelines and continuously update our teaching methods to meet evolving educational standards.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative hidden lg:block"
          >
            <div className="aspect-square rounded-3xl bg-linear-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 overflow-hidden shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                    <Award className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-blue-900 dark:text-white mb-2">
                    CBSE Based
                  </h3>
                  <p className="text-muted-foreground">
                    Curriculum
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
