"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"
import Image from "next/image"

export function VicePrincipalMessage() {
    return (
        <section className="py-24 bg-gradient-to-b from-white via-orange-200 to-white">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="grid lg:grid-cols-5 gap-12 items-center">
                        {/* Mobile Header (Visible only on mobile) */}
                        <div className="lg:hidden text-center mb-8">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 text-sm font-medium mb-4">
                                Vice Principal&apos;s Message
                            </span>
                            <h2 className="font-serif text-3xl font-bold text-blue-900">
                                A Message from Vice Principal
                            </h2>
                        </div>

                        {/* Content (Left) */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-3 order-2 lg:order-1"
                        >
                            <div className="hidden lg:block">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 text-sm font-medium mb-4">
                                    Vice Principal&apos;s Message
                                </span>

                                <h2 className="font-serif text-3xl md:text-4xl font-bold text-blue-900 mb-6">
                                    A Message from Vice Principal
                                </h2>
                            </div>

                            <div className="relative group">
                                <Quote className="absolute -top-4 -left-6 w-12 h-12 text-orange-500/10 transition-colors group-hover:text-orange-500/20" />
                                <div className="space-y-6 text-muted-foreground leading-relaxed pl-8 border-l-2 border-orange-500/10">
                                    <p className="text-lg font-medium text-foreground/90">
                                        Dear Parents and Students,
                                    </p>
                                    <p>
                                        Education is a shared commitment between dedicated teachers, motivated students, and enthusiastic parents. As Vice Principal, I am delighted to welcome you to another promising academic year at <span className="text-orange-500 font-medium">Decent Public School</span>.
                                    </p>
                                    <p>
                                        Our goal is to foster an inclusive community where every student feels valued and inspired to learn. We strive to maintain high academic standards while ensuring the emotional and social well-being of our children.
                                    </p>
                                    <p>
                                        Together, let us build a foundation of trust and excellence that empowers our students to face the future with confidence.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-orange-100 text-right lg:text-left">
                                <p className="font-serif text-xl font-semibold text-foreground">
                                    Mr. Jintu Patowary
                                </p>
                                <p className="text-muted-foreground">
                                    Vice Principal, <span className="text-orange-500">Decent Public School</span>
                                </p>
                            </div>
                        </motion.div>

                        {/* Image (Right) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-2 order-1 lg:order-2"
                        >
                            <div className="relative">
                                <div className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-orange-50 to-white dark:from-card dark:to-card/80 overflow-hidden shadow-2xl border border-border/50 relative">
                                    <Image
                                        src="/Heads/Jintu_Final_new_1.png"
                                        alt="Mr. Jintu Patowary - Vice Principal"
                                        fill
                                        className="object-cover object-top hover:scale-105 transition-transform duration-700"
                                        priority
                                        sizes="(max-width: 768px) 100vw, 400px"
                                    />
                                    {/* Overlay for text readability if needed */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                {/* Decorative element */}
                                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-500/5 rounded-3xl -z-10 blur-2xl" />
                                <div className="absolute -top-6 -left-6 w-32 h-32 bg-rose-500/5 rounded-3xl -z-10 blur-2xl" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
