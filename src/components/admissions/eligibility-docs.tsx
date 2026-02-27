"use client"

import { motion } from "framer-motion"
import { CheckCircle, FileCheck } from "lucide-react"
import { SectionHeader } from "@/components/shared/section-header"

const eligibility = [
  { class: "Nursery", age: "3+ years as on 31st March" },
  { class: "LKG", age: "4+ years as on 31st March" },
  { class: "UKG", age: "5+ years as on 31st March" },
  { class: "Class 1", age: "6+ years as on 31st March" },
  { class: "Class 2-8", age: "Age appropriate + Previous class passed" },
  { class: "Class 9-10", age: "Age appropriate + Previous class passed" },
]

const documents = [
  "Completed admission form",
  "Birth certificate (original + photocopy)",
  "Aadhaar card of student (photocopy)",
  "Aadhaar card of both parents (photocopy)",
  "4 recent passport-size photographs",
  "Transfer Certificate (for Class 2 onwards)",
  "Report card of previous class",
  "Caste certificate (if applicable)",
  "Address proof (Electricity bill/Ration card)",
  "APAAR ID of the student"
]

export function EligibilityDocs() {
  return (
    <section className="py-24 bg-linear-to-b from-white via-blue-300 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="Requirements"
          title="Eligibility & Documents"
          description="Check the eligibility criteria and prepare the required documents for admission."
        />

        <div className="grid lg:grid-cols-2 gap-8 mt-16">
          {/* Eligibility */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-slate-100 rounded-2xl px-6 py-8 sm:p-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-blue-900 dark:text-white">
                Age Eligibility
              </h3>
            </div>

            <div className="space-y-4">
              {eligibility.map((item, index) => (
                <motion.div
                  key={item.class}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0"
                >
                  <span className="font-medium text-slate-900">{item.class}</span>
                  <span className="text-sm text-slate-600 text-right pl-4">{item.age}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-slate-100 rounded-2xl px-6 py-8 sm:p-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-blue-900 dark:text-white">
                Required Documents
              </h3>
            </div>

            <ul className="space-y-5">
              {documents.map((doc, index) => (
                <motion.li
                  key={doc}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{doc}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
