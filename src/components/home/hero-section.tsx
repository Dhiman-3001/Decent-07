"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { EditableText, useAdminStatus } from "@/components/admin/inline-edit"

interface HeroContent {
  badgeText: string
  subBadgeText: string
  heading1: string
  heading2: string
  description: string
  heroImage: string
}

const defaultContent: HeroContent = {
  badgeText: "Admissions Open for the Session 2026-27",
  subBadgeText: "Limited seats available | Scholarship up to 90% on new admissions",
  heading1: "Shaping Minds",
  heading2: "for Tomorrow",
  description: "Decent Public School combines traditional values with modern academic excellence. We nurture intellectual curiosity, moral integrity, and social responsibility in every student.",
  heroImage: "/Heads/Saraswati_maa_Lands.png"
}

export function HeroSection() {
  const { isAdmin } = useAdminStatus()
  const [content, setContent] = useState<HeroContent>(defaultContent)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/content?section=home&subsection=hero')
      if (res.ok) {
        const data = await res.json()
        if (data) setContent({ ...defaultContent, ...data })
      }
    } catch (error) {
      console.error("Failed to load hero content:", error)
    } finally {
      //
    }
  }

  const updateContent = async (field: keyof HeroContent, value: string) => {
    const newContent = { ...content, [field]: value }
    setContent(newContent)

    await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section: 'home',
        subsection: 'hero',
        data: newContent
      })
    })
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-40 md:pt-28 pb-12 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(var(--primary)/0.05),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,oklch(var(--secondary)/0.05),transparent_60%)]" />

      {/* Animated Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />



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
              {isAdmin ? (
                <EditableText
                  value={content.badgeText}
                  onSave={(v) => updateContent('badgeText', v)}
                  inputClassName="text-sm"
                >
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-semibold tracking-wide backdrop-blur-sm shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_currentColor]" />
                    {content.badgeText}
                  </span>
                </EditableText>
              ) : (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-semibold tracking-wide backdrop-blur-sm shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_currentColor]" />
                  {content.badgeText}
                </span>
              )}

              {isAdmin ? (
                <EditableText
                  value={content.subBadgeText}
                  onSave={(v) => updateContent('subBadgeText', v)}
                  inputClassName="text-sm"
                >
                  <p className="text-blue-200/80 text-sm font-medium tracking-wide">
                    {content.subBadgeText.split('|')[0]}
                    {content.subBadgeText.includes('|') && (
                      <span className="text-amber-400">
                        |{content.subBadgeText.split('|')[1]}
                      </span>
                    )}
                  </p>
                </EditableText>
              ) : (
                <p className="text-blue-200/80 text-sm font-medium tracking-wide">
                  {content.subBadgeText.split('|')[0]}
                  {content.subBadgeText.includes('|') && (
                    <span className="text-amber-400">
                      |{content.subBadgeText.split('|')[1]}
                    </span>
                  )}
                </p>
              )}
            </motion.div>

            {/* Mobile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="lg:hidden relative h-62.5 w-full block my-6"
            >
              <div className="absolute inset-0 bg-slate-900/50 rounded-4xl border border-white/10 backdrop-blur-sm overflow-hidden shadow-2xl">
                <Image
                  src={content.heroImage}
                  alt="Hero"
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-linear-to-br from-blue-500 to-cyan-400 rounded-2xl opacity-20 blur-xl animate-float" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-linear-to-br from-violet-500 to-fuchsia-400 rounded-full opacity-20 blur-2xl animate-float [animation-delay:2s]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {isAdmin ? (
                <div className="space-y-2">
                  <EditableText
                    value={content.heading1}
                    onSave={(v) => updateContent('heading1', v)}
                  >
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                      <span className="text-sky-400">{content.heading1}</span>
                    </h1>
                  </EditableText>
                  <EditableText
                    value={content.heading2}
                    onSave={(v) => updateContent('heading2', v)}
                  >
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                      <span className="text-white font-bold relative inline-block pb-2">
                        {content.heading2}
                        <svg className="absolute w-full h-2 -bottom-1 left-0 text-blue-500/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                          <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                        </svg>
                      </span>
                    </h1>
                  </EditableText>
                </div>
              ) : (
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                  <span className="text-sky-400">{content.heading1}</span> <br />
                  <span className="text-white font-bold relative inline-block pb-2">
                    {content.heading2}
                    <svg className="absolute w-full h-2 -bottom-1 left-0 text-blue-500/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                  </span>
                </h1>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {isAdmin ? (
                <EditableText
                  value={content.description}
                  onSave={(v) => updateContent('description', v)}
                  multiline
                >
                  <p className="text-base text-slate-300 leading-relaxed max-w-lg font-light">
                    <span className="text-yellow-300 font-medium">Decent Public School</span> {content.description.replace('Decent Public School ', '')}
                  </p>
                </EditableText>
              ) : (
                <p className="text-base text-slate-300 leading-relaxed max-w-lg font-light">
                  <span className="text-yellow-300 font-medium">Decent Public School</span> {content.description.replace('Decent Public School ', '')}
                </p>
              )}
            </motion.div>

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

          {/* Right Image - Desktop Only */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="hidden lg:block relative h-75 lg:h-125 w-full lg:mt-0"
          >
            <div className="absolute inset-0 bg-slate-900/50 rounded-4xl border border-white/10 backdrop-blur-sm overflow-hidden shadow-2xl">
              <Image
                src={content.heroImage}
                alt="Hero"
                fill
                className="object-cover object-center"
                priority
              />
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-linear-to-br from-blue-500 to-cyan-400 rounded-2xl opacity-20 blur-xl animate-float" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-linear-to-br from-violet-500 to-fuchsia-400 rounded-full opacity-20 blur-2xl animate-float [animation-delay:2s]" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
