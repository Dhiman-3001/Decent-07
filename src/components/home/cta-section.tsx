"use client"

import { motion } from "framer-motion"
import { ArrowRight, Phone, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AdmissionModal } from "@/components/shared/admission-modal"

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-primary" />
      <div className="absolute inset-0 bg-gradient-premium opacity-90" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float [animation-delay:2s]" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 text-sm font-medium mb-6 backdrop-blur-sm"
          >
            <Calendar className="w-4 h-4" />
            Admissions Open for 2026-27
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Give Your Child the Gift of{" "}
            <span className="text-secondary">Quality Education</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Join Decent Public School and be part of a community that values academic excellence, moral values, and holistic development. Limited seats available.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/admissions">
              <Button
                size="xl"
                className="bg-white text-primary hover:bg-white/90 shadow-xl shadow-black/10"
              >
                Admission Criteria
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a
              href="https://api.whatsapp.com/send/?phone=916002717101&text=Hello%21+I+would+like+to+inquire+about+admissions+at+Decent+Public+School.&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="xl"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm"
              >
                <Phone className="w-5 h-5 mr-2" />
                Understand More
              </Button>
            </a>
          </motion.div>


        </div>
      </div>
    </section >
  )
}
