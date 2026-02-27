"use client"

import { motion } from "framer-motion"
import { Image as ImageIcon } from "lucide-react"

export function GalleryHero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-linear-to-br from-indigo-50/50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(var(--primary)/0.05),transparent_60%)] dark:bg-[radial-gradient(circle_at_top_right,oklch(var(--primary)/0.1),transparent_60%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[24px_24px]" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-premium flex items-center justify-center shadow-xl"
                    >
                        <ImageIcon className="w-10 h-10 text-white" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
                    >
                        <span className="text-sky-400">School</span>{" "}
                        <span className="text-foreground dark:text-white">
                            Gallery
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-muted-foreground dark:text-white/70 leading-relaxed"
                    >
                        Moments of joy, learning, and achievements captured through our lens. Take a visual tour of <span className="text-gray font-medium">Decent Public School</span>.
                    </motion.p>
                </div>
            </div>
        </section>
    )
}
