"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Heart, Stethoscope, Camera, Users, Target } from "lucide-react"
import { SectionHeader } from "@/components/shared/section-header"
import { cn } from "@/lib/utils"

const features = [
    {
        icon: Stethoscope,
        title: "First Aid Facilities",
        description: "Fully equipped first aid station with trained staff available during school hours for immediate medical attention.",
        iconClass: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
    },
    {
        icon: ShieldCheck,
        title: "Safe Environment",
        description: "Secure campus with strictly monitored entry and exit points, ensuring a protected learning space for every child.",
        iconClass: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
    },
    {
        icon: Users,
        title: "Verified Staff",
        description: "All teaching and support staff undergo thorough background verification and regular professional training.",
        iconClass: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
    },
    {
        icon: Camera,
        title: "CCTV Surveillance",
        description: "24/7 high-definition camera monitoring across classrooms, corridors, and playgrounds for complete campus safety.",
        iconClass: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
    },
    {
        icon: Heart,
        title: "Regular PTM Sessions",
        description: "Consistent Parent-Teacher Meetings to discuss student progress, well-being, and collaborative growth strategies.",
        iconClass: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
    },
    {
        icon: Target,
        title: "Individual Attention",
        description: "Maintaining an optimal student-teacher ratio to focus on the emotional and academic needs of every individual.",
        iconClass: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
    }
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5
        }
    }
}

export function CareSection() {
    return (
        <section className="py-24 bg-slate-50/50 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <SectionHeader
                    badge="Safety & Well-being"
                    title="Our Commitment to Care"
                    description="At Decent Public School, your child's safety and well-being are our highest priorities. We provide a nurturing environment where every student feels respected and cared for."
                />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-8 mt-8 sm:mt-16"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            variants={itemVariants}
                            className="group bg-white rounded-xl sm:rounded-3xl p-2 sm:p-8 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 border border-slate-100"
                        >
                            <div className={cn(
                                "w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-6 transition-transform group-hover:scale-110",
                                feature.iconClass
                            )}>
                                <feature.icon className="w-4 h-4 sm:w-7 sm:h-7" />
                            </div>
                            <h3 className="font-serif text-[10px] sm:text-xl font-bold text-slate-900 mb-1 sm:mb-4 leading-tight">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 leading-tight sm:leading-relaxed text-[8px] sm:text-base line-clamp-3 sm:line-clamp-none">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
