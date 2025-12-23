"use client"

import { motion } from "framer-motion"
import { Download, Smartphone, Bell, Calendar, FileText, Sparkles, CheckCircle } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/shared/section-header"

export function DigitalFruitApp() {
    return (
        <section className="py-12 md:py-16">
            <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-950 shadow-2xl">
                    {/* Background Patterns */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[80px]" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

                    <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-12 items-center relative z-10 p-8 md:p-12">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6 order-2 lg:order-1"
                        >
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-400/10 text-blue-200 border border-blue-400/20 text-xs font-medium mb-4 backdrop-blur-md">
                                    <Smartphone className="w-3.5 h-3.5" />
                                    Official School Companion
                                </div>
                                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                                    Your School in <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-sky-200 to-white">Your Pocket</span>
                                </h2>
                                <p className="text-blue-100/80 text-base md:text-lg leading-relaxed max-w-lg">
                                    Digital Fruit seamlessly connects parents, students, and teachers. Access real-time academic progress, attendance records, and important circulars instantly.
                                </p>
                            </div>

                            {/* Feature List */}
                            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                                {[
                                    { icon: Bell, text: "Instant Notifications" },
                                    { icon: Sparkles, text: "Online Results & Report Cards" },
                                    { icon: FileText, text: "Course Content" },
                                    { icon: Calendar, text: "Curriculum & Syllabus access" }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-blue-50 text-base whitespace-nowrap">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 flex-shrink-0">
                                            <item.icon className="w-4 h-4 text-blue-300" />
                                        </div>
                                        <span className="truncate">{item.text}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-2 text-center lg:text-left">
                                <a
                                    href="https://play.google.com/store/apps/details?id=com.cs.digitalfruit.df&hl=en_IN"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block w-full sm:w-auto"
                                >
                                    <Button size="lg" className="bg-white text-indigo-950 hover:bg-blue-50 shadow-xl shadow-blue-900/20 h-14 w-full sm:w-auto px-10 rounded-xl group transition-all duration-300 transform hover:-translate-y-0.5 hover:bg-gray-200 hover:cursor-pointer">
                                        <Download className="w-5 h-5 mr-3 text-blue-600 group-hover:scale-110 transition-transform" />
                                        <div className="text-left">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-none mb-1">Get it on </div>
                                            <div className="text-base font-bold leading-none font-sans">Google Play</div>
                                        </div>
                                    </Button>
                                </a>
                            </div>
                        </motion.div>

                        {/* Right Visual */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="relative flex items-center justify-center lg:justify-end py-8 lg:py-0 order-1 lg:order-2"
                        >
                            {/* Decorative Elements */}
                            <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full animate-pulse" />

                            {/* Floating Icons Container */}
                            <div className="relative">
                                {/* Main Card Container */}
                                <div className="relative z-10 p-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl">
                                    <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-[2rem] overflow-hidden shadow-inner ring-1 ring-white/20 bg-white">
                                        <Image
                                            src="/School-app/App_Logo.jpg"
                                            alt="Digital Fruit App Interface"
                                            fill
                                            sizes="(max-width: 768px) 160px, 208px"
                                            className="object-cover"
                                        />
                                        {/* Glossy Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <motion.div
                                    className="absolute -bottom-3 -left-7 w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg border border-white/20 z-20"
                                >
                                    <Calendar className="w-6 h-6 text-white" />
                                </motion.div>

                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
