"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, Variants, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { SectionHeader } from "@/components/shared/section-header"
import { cn } from "@/lib/utils"
import { useAdminStatus } from "@/components/admin/inline-edit"
import { Edit2, Loader2, Trash2, Plus, AlertTriangle, X } from "lucide-react"
import { FacultyModal } from "@/components/admin/faculty-modal"
import { Button } from "@/components/ui/button"

interface FacultyMember {
    id: string
    name: string
    role: string
    quote: string
    cloudinary_url: string
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1, y: 0,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
}

export function FacultySection() {
    const { isAdmin, credentials } = useAdminStatus()
    const [faculty, setFaculty] = useState<FacultyMember[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false)
    const [editItem, setEditItem] = useState<FacultyMember | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<FacultyMember | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const fetchFaculty = useCallback(async () => {
        try {
            const res = await fetch('/api/faculty')
            if (res.ok) {
                const data = await res.json()
                if (data && Array.isArray(data)) setFaculty(data)
            }
        } catch (error) {
            console.error("Failed to load faculty:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchFaculty()
    }, [fetchFaculty])

    const handleDelete = async () => {
        if (!deleteConfirm || !credentials) return

        setIsDeleting(true)
        try {
            const response = await fetch('/api/faculty/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${credentials}`
                },
                body: JSON.stringify({
                    id: deleteConfirm.id,
                    cloudinary_url: deleteConfirm.cloudinary_url
                })
            })

            if (response.ok) {
                await fetchFaculty()
                setDeleteConfirm(null)
            } else {
                const data = await response.json()
                alert(data.error || 'Failed to delete')
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('Failed to delete faculty member')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleEdit = (member: FacultyMember) => {
        setEditItem(member)
        setShowAddModal(true)
    }

    const handleModalSuccess = () => {
        fetchFaculty()
        setEditItem(null)
    }

    // Get image source - strictly Cloudinary only
    const getImageSrc = (member: FacultyMember) => {
        if (member.cloudinary_url && member.cloudinary_url.length > 0) {
            return member.cloudinary_url
        }
        // No fallbacks to local code, use a generic placeholder or handled by component
        return ""
    }

    // Filter out Principal and Vice Principal from the general faculty grid
    const filteredFaculty = faculty.filter(m => m.id !== 'principal' && m.id !== 'vice-principal')

    // Academic Coordinator should be shown as lead faculty (full width)
    const leadFaculty = filteredFaculty.find(m => m.role === "Academic Coordinator")
    // Other faculty members shown side by side
    const otherFaculty = filteredFaculty.filter(m => m.role !== "Academic Coordinator")

    if (isLoading) {
        return <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
    }

    return (
        <section className="py-32 bg-slate-50/50 overflow-hidden text-blue-900 relative">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <SectionHeader
                        badge="Faculty Members"
                        title="Meet Our Dedicated Educators"
                        description="The passionate mentors who inspire excellence and nurture the growth of every student at Decent Public School."
                    />

                    {/* Admin Add Button */}
                    {isAdmin && (
                        <Button
                            onClick={() => {
                                setEditItem(null)
                                setShowAddModal(true)
                            }}
                            className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 cursor-pointer shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Add Faculty
                        </Button>
                    )}
                </div>

                {/* Lead Faculty */}
                {leadFaculty && (
                    <div className="mt-20 sm:mt-32 max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group bg-white rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(15,23,42,0.1)] border border-slate-100 ring-1 ring-slate-100/50 relative"
                        >
                            {/* Admin Controls for Lead Faculty */}
                            {isAdmin && (
                                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(leadFaculty)}
                                        className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors cursor-pointer shadow-lg"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(leadFaculty)}
                                        className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors cursor-pointer shadow-lg"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <div className="grid lg:grid-cols-5 items-stretch">
                                <div className="lg:col-span-2 relative aspect-[4/3] lg:aspect-square">
                                    {getImageSrc(leadFaculty) ? (
                                        <Image
                                            src={getImageSrc(leadFaculty)}
                                            alt={leadFaculty.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 1024px) 100vw, 40vw"
                                            priority
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 gap-2">
                                            <p className="text-xs">Photo Coming Soon</p>
                                        </div>
                                    )}
                                </div>
                                <div className="lg:col-span-3 p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-6 sm:space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center lg:justify-start gap-4">
                                            <span className="font-serif text-4xl sm:text-6xl font-extralight text-primary/20 italic select-none">01</span>
                                            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                                                {leadFaculty.role}
                                            </span>
                                        </div>
                                        <h3 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 leading-tight">
                                            {leadFaculty.name}
                                        </h3>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute -top-6 -left-4 text-6xl text-primary/10 font-serif lg:block hidden">"</span>
                                        <p className="text-lg sm:text-2xl text-slate-600 italic font-serif leading-relaxed relative z-10 text-balance">
                                            "{leadFaculty.quote}"
                                        </p>
                                        <p className="mt-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
                                            Educator & Mentor
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Other Faculty Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex flex-wrap justify-center gap-x-4 sm:gap-x-10 gap-y-20 sm:gap-y-36 mt-28 sm:mt-40"
                >
                    {otherFaculty.map((member, index) => (
                        <motion.div
                            key={member.id}
                            variants={itemVariants}
                            className="group relative w-[calc(50%-1rem)] sm:w-[calc(50%-2.5rem)] lg:w-[calc(33.33%-2.5rem)] xl:w-[calc(25%-2.5rem)] min-w-[150px]"
                        >
                            {/* Admin Controls for Each Faculty */}
                            {isAdmin && (
                                <div className="absolute -top-2 -right-2 z-30 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(member)}
                                        className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors cursor-pointer shadow-lg"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(member)}
                                        className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors cursor-pointer shadow-lg"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            )}

                            {/* Numbering */}
                            <div className="absolute -top-10 -left-2 sm:-left-6 z-20 flex items-center gap-2 sm:gap-4 pointer-events-none">
                                <span className="font-serif text-4xl sm:text-7xl font-extralight tracking-tighter transition-all duration-1000 select-none text-transparent [text-stroke:1px_rgba(15,23,42,0.15)] group-hover:[text-stroke:1px_var(--color-primary)] group-hover:text-primary/10 group-hover:-translate-y-4 group-hover:scale-110">
                                    {(index + 2).toString().padStart(2, '0')}
                                </span>
                                <div className="h-[1px] w-6 sm:w-12 bg-slate-200 origin-left scale-x-0 group-hover:scale-x-100 group-hover:bg-primary/30 transition-all duration-700 delay-100" />
                            </div>

                            <div className="relative z-10 h-full">
                                <div className="relative aspect-[4/5] rounded-[1.5rem] sm:rounded-[2.5rem] bg-white shadow-[0_10px_30px_-15px_rgba(15,23,42,0.1)] transition-all duration-700 group-hover:shadow-[0_40px_70px_-20px_rgba(15,23,42,0.15)] group-hover:-translate-y-4 ring-1 ring-slate-100/50 group-hover:ring-primary/10">
                                    <div className="absolute inset-0 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden">
                                        {getImageSrc(member) ? (
                                            <Image
                                                src={getImageSrc(member)}
                                                alt={member.name}
                                                fill
                                                className="object-cover transition-transform duration-1000"
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 gap-2">
                                                <p className="text-xs">Photo Coming Soon</p>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-8 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-8 group-hover:translate-y-0 text-center sm:text-left">
                                            <div className="space-y-2 sm:space-y-4">
                                                <div className="hidden sm:flex items-center gap-3">
                                                    <div className="h-[1px] w-8 bg-primary" />
                                                    <span className="text-white text-[10px] uppercase tracking-[0.3em] font-black">
                                                        Educator
                                                    </span>
                                                </div>
                                                <h4 className="text-white font-serif text-sm sm:text-xl font-bold leading-tight">
                                                    {member.name}
                                                </h4>
                                                <p className="text-white/70 text-[10px] sm:text-sm italic leading-relaxed line-clamp-3 sm:line-clamp-none">
                                                    "{member.quote}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 sm:mt-10 px-1 sm:px-2 text-center sm:text-left">
                                    <h3 className="text-lg sm:text-2xl font-serif font-bold text-slate-900 group-hover:text-primary transition-colors duration-500 leading-tight">
                                        {member.name}
                                    </h3>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-4 mt-2 sm:mt-4">
                                        <div className="h-[2px] w-6 sm:w-10 bg-primary/20 group-hover:w-12 sm:group-hover:w-20 group-hover:bg-primary transition-all duration-700 ease-in-out" />
                                        <p className="text-slate-400 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] whitespace-nowrap">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Add/Edit Faculty Modal */}
            <FacultyModal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false)
                    setEditItem(null)
                }}
                onSuccess={handleModalSuccess}
                editItem={editItem}
                credentials={credentials || ""}
            />

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setDeleteConfirm(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-700 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Delete Faculty Member?</h3>
                                    <p className="text-sm text-slate-400">This will also delete their photo from cloud storage.</p>
                                </div>
                            </div>

                            <div className="mb-6 p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                                <p className="text-sm text-slate-300">{deleteConfirm.name}</p>
                                <p className="text-xs text-slate-500">{deleteConfirm.role}</p>
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteConfirm(null)}
                                    disabled={isDeleting}
                                    className="cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="gap-2 bg-red-600 hover:bg-red-700 cursor-pointer"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
