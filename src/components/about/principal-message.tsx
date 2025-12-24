"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"
import Image from "next/image"

export function PrincipalMessage() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-blue-200 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Mobile Header (Visible only on mobile) */}
            <div className="lg:hidden text-center mb-8">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Principal&apos;s Message
              </span>
              <h2 className="font-serif text-3xl font-bold text-blue-900">
                A Message from Our Principal
              </h2>
            </div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="relative">
                <div className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-indigo-100 to-white dark:from-card dark:to-card/80 overflow-hidden shadow-2xl border border-border/50 relative">
                  <Image
                    src="/Heads/Binoy_Chat.png"
                    alt="Mr. Binoy Saikia - Principal"
                    fill
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  {/* Overlay for text readability if needed, but keeping it clean for now */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/5 rounded-3xl -z-10 blur-2xl" />
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary/5 rounded-3xl -z-10 blur-2xl" />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="hidden lg:block">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  Principal&apos;s Message
                </span>

                <h2 className="font-serif text-3xl md:text-4xl font-bold text-blue-900 mb-6">
                  A Message from Our Principal
                </h2>
              </div>

              <div className="relative group">
                <Quote className="absolute -top-4 -left-6 w-12 h-12 text-primary/10 transition-colors group-hover:text-primary/20" />
                <div className="space-y-6 text-muted-foreground leading-relaxed pl-8 border-l-2 border-primary/10">
                  <p className="text-lg font-medium text-foreground/90">
                    Dear Parents and Students,
                  </p>
                  <p>
                    Welcome to <span className="text-orange-500 font-medium">Decent Public School</span>, where we believe that every child is unique and possesses unlimited potential. Our commitment is to provide an environment that nurtures this potential through quality education, strong values, and holistic development.
                  </p>
                  <p>
                    At DPS, we go beyond textbooks. Our dedicated faculty works tirelessly to ensure that students not only excel academically but also develop critical thinking, creativity, and character. We prepare our students not just for examinations, but for life.
                  </p>
                  <p>
                    I invite you to be part of our school family, where together we can shape the future leaders of tomorrow.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t text-right lg:text-left">
                <p className="font-serif text-xl font-semibold text-foreground">
                  Mr. Binoy Saikia
                </p>
                <p className="text-muted-foreground">
                  Principal, <span className="text-orange-500">Decent Public School</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
