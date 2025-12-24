"use client"

import { motion } from "framer-motion"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"



export function HeroSection() {


  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-40 md:pt-32 pb-12 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(var(--primary)/0.05),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,oklch(var(--secondary)/0.05),transparent_60%)]" />

      {/* Animated Particles/Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-3 items-center lg:items-start"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-semibold tracking-wide backdrop-blur-sm shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_currentColor]" />
                Admissions Open for the Session 2025-26
              </span>
              <p className="text-blue-200/80 text-sm font-medium tracking-wide">
                Limited seats available | <span className="text-amber-400">Scholarship up to 90% on new admissions</span>
              </p>
            </motion.div>

            {/* Mobile Video Placeholder - Visible only on mobile, placed between texts */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="lg:hidden relative h-[250px] w-full block my-6"
            >
              <div className="absolute inset-0 bg-slate-900/50 rounded-[2rem] border border-white/10 backdrop-blur-sm overflow-hidden shadow-2xl">
                <Image
                  src="/Heads/Saraswati_maa_Lands.png"
                  alt="Saraswati Maa"
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl opacity-20 blur-xl animate-float" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-400 rounded-full opacity-20 blur-2xl animate-float [animation-delay:2s]" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight"
            >
              <span className="text-sky-400">Shaping Minds</span> <br />
              <span className="text-white font-bold relative inline-block pb-2">
                for Tomorrow
                <svg className="absolute w-full h-2 -bottom-1 left-0 text-blue-500/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base text-slate-300 leading-relaxed max-w-lg font-light"
            >
              <span className="text-yellow-300 font-medium">Decent Public School</span> combines traditional values with modern academic excellence.
              We nurture intellectual curiosity, moral integrity, and social responsibility in every student.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center lg:justify-start"
            >

              <Link href="/admissions" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto shadow-xl shadow-blue-900/20 px-6 h-12 rounded-xl text-base"
                >
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Admissions criteria
                </Button>
              </Link>

              <Link href="/gallery" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/10 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm px-6 h-12 rounded-xl text-base"
                >
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  View Gallery
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Slideshow - Desktop Only */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="hidden lg:block relative h-[300px] lg:h-[500px] w-full lg:mt-0"
          >
            <div className="absolute inset-0 bg-slate-900/50 rounded-[2rem] border border-white/10 backdrop-blur-sm overflow-hidden shadow-2xl">
              <Image
                src="/Heads/Saraswati_maa_Lands.png"
                alt="Saraswati Maa"
                fill
                className="object-cover object-center"
                priority
              />

              {/* Corner Accents - kept for style */}
              <div className="absolute top-0 right-0 p-6 z-10 w-full h-full pointer-events-none">
              </div>
            </div>

            {/* Floating Elements for depth */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl opacity-20 blur-xl animate-float" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-400 rounded-full opacity-20 blur-2xl animate-float [animation-delay:2s]" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
