"use client"

import { motion } from "framer-motion"
import { Shield, Camera, UserCheck, AlertTriangle, Heart, Lock } from "lucide-react"
import { SectionHeader } from "@/components/shared/section-header"

const safetyFeatures = [
  {
    icon: Camera,
    title: "CCTV Surveillance",
    description: "24/7 CCTV monitoring across the campus for complete security.",
  },
  {
    icon: UserCheck,
    title: "Verified Staff",
    description: "All staff members undergo thorough background verification.",
  },
  {
    icon: AlertTriangle,
    title: "Emergency Protocols",
    description: "Well-defined emergency procedures and regular safety drills.",
  },
  {
    icon: Heart,
    title: "First Aid",
    description: "Trained first-aid personnel and medical room on campus.",
  },
  {
    icon: Lock,
    title: "Secure Entry",
    description: "Controlled access with visitor management system.",
  },
  {
    icon: Shield,
    title: "Child Safety Policy",
    description: "Strict child protection policies and anti-bullying measures.",
  },
]

export function SafetySection() {
  return (
    <section className="py-24 bg-gradient-to-b from-amber-50/30 via-orange-50/20 to-white dark:from-slate-900/30 dark:via-slate-900/20 dark:to-background border-y border-amber-200/30 dark:border-slate-800/40">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="Safety First"
          title="A Safe Learning Environment"
          description="Your child's safety is our top priority. We maintain strict security measures throughout the campus."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {safetyFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-900/50 border border-border/50 rounded-2xl p-6 shadow-lg text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-blue-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
