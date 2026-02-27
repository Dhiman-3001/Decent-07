"use client"

import { motion } from "framer-motion"
import {
  FileText,
  ClipboardCheck,
  UserCheck,
  CreditCard,
  PartyPopper
} from "lucide-react"
import { SectionHeader } from "@/components/shared/section-header"

const steps = [
  {
    icon: FileText,
    title: "Submit Application",
    description: "Collect the application form from the school office and fill it up. Submit all the required documents.",
    step: 1,
  },
  {
    icon: ClipboardCheck,
    title: "Document Verification",
    description: "Our team will verify all submitted documents and check eligibility criteria for the requested class.",
    step: 2,
  },
  {
    icon: UserCheck,
    title: "Interaction Session",
    description: "A brief interaction with the student and parents to understand the child's learning needs and expectations.",
    step: 3,
  },
  {
    icon: CreditCard,
    title: "Fee Payment",
    description: "Upon selection, complete the admission by paying the required fees. Multiple payment options available.",
    step: 4,
  },
  {
    icon: PartyPopper,
    title: "Welcome to DPS!",
    description: "Congratulations! Your child is now part of the Decent Public School family. Orientation details will follow.",
    step: 5,
  },
]

export function AdmissionProcess() {
  return (
    <section className="py-24 bg-linear-to-b from-white via-blue-50/50 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="How to Apply"
          title="Admission Process"
          description="A simple 5-step process to secure your child's admission at Decent Public School."
        />

        <div className="max-w-4xl mx-auto mt-16">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-linear-to-b from-blue-600 via-indigo-600 to-violet-600 hidden md:block" />

            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative flex gap-6"
                >
                  {/* Step Number */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        Step {step.step}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-slate-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
