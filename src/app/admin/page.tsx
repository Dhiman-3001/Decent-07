"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Settings, FileText, Image, Calendar, Users, Home, CheckCircle, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const sections = [
        { icon: Home, label: "Home Page", href: "/", description: "Edit hero section, testimonials" },
        { icon: Users, label: "About Page", href: "/about", description: "Edit principal message, faculty" },
        { icon: FileText, label: "Contact Page", href: "/contact", description: "Edit contact information" },
        { icon: Image, label: "Gallery Management", href: "/admin/gallery", description: "Upload, edit, delete gallery media", highlight: true },
        { icon: Calendar, label: "Events", href: "/events", description: "View events" },
    ]

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12">
            <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
                        <Settings className="w-4 h-4" />
                        <span className="text-sm font-medium">Admin Dashboard</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Content Management
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Edit text content across the website. Click on any section below to navigate and edit inline.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={section.href}>
                                <div className={`bg-slate-900/50 border rounded-2xl p-6 hover:bg-slate-900 transition-all duration-300 cursor-pointer group ${section.highlight
                                        ? 'border-blue-500/50 hover:border-blue-400'
                                        : 'border-slate-800 hover:border-blue-500/50'
                                    }`}>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${section.highlight
                                            ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                                            : 'bg-blue-500/10 group-hover:bg-blue-500/20'
                                        }`}>
                                        <section.icon className={`w-6 h-6 ${section.highlight ? 'text-white' : 'text-blue-400'}`} />
                                    </div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-semibold text-white">
                                            {section.label}
                                        </h3>
                                        {section.highlight && (
                                            <ExternalLink className="w-4 h-4 text-blue-400" />
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-400">
                                        {section.description}
                                    </p>
                                    {section.highlight && (
                                        <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-400">
                                            <span>Cloudinary Powered</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl max-w-2xl mx-auto"
                >
                    <div className="flex items-start gap-4">
                        <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-emerald-400 font-medium mb-1">Cloudinary Integration Active</h3>
                            <p className="text-emerald-200/70 text-sm">
                                Gallery images and videos are now managed through Cloudinary.
                                Use the Gallery Management section to upload, edit, or delete media files with automatic cloud storage.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
