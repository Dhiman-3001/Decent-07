"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Quote, Edit2 } from "lucide-react"
import Image from "next/image"
import { useAdminStatus } from "@/components/admin/inline-edit"
import { FacultyModal } from "@/components/admin/faculty-modal"

interface FacultyMember {
  id: string
  name: string
  role: string
  quote: string
  cloudinary_url: string
}

export function PrincipalMessage() {
  const { isAdmin, credentials } = useAdminStatus()
  const [member, setMember] = useState<FacultyMember | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    fetchPrincipal()
  }, [])

  const fetchPrincipal = async () => {
    try {
      const res = await fetch('/api/faculty')
      if (res.ok) {
        const data: FacultyMember[] = await res.json()
        const principal = data.find(m => m.id === 'principal')
        if (principal) setMember(principal)
      }
    } catch (error) {
      console.error("Failed to load principal message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="py-24 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
  }

  if (!member) return null

  // Split quote by newlines to get segments
  const messageParagraphs = member.quote.split('\n').filter((p: string) => p.trim() !== '')

  return (
    <section className="py-24 bg-gradient-to-b from-white via-blue-200 to-white relative">
      {/* Admin Edit Button */}
      {isAdmin && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-lg transition-all"
          >
            <Edit2 className="w-4 h-4" />
            Edit Principal Message
          </button>
        </div>
      )}

      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Mobile Header */}
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
                <div className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-indigo-100 to-white overflow-hidden shadow-2xl border border-border/50 relative">
                  {member.cloudinary_url ? (
                    <Image
                      src={member.cloudinary_url}
                      alt={`${member.name} - ${member.role}`}
                      fill
                      className="object-cover object-top hover:scale-105 transition-transform duration-700"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 gap-2">
                      <p className="text-xs">Photo Coming Soon</p>
                    </div>
                  )}
                </div>
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
                <div className="space-y-6 text-muted-foreground leading-relaxed pl-8 border-l-2 border-primary/10 whitespace-pre-wrap">
                  {messageParagraphs.map((para: string, i: number) => (
                    <p key={i} className={i === 0 ? "text-lg font-medium text-foreground/90" : ""}>
                      {para.includes('Decent Public School') ? (
                        <>
                          {para.split('Decent Public School')[0]}
                          <span className="text-orange-500 font-medium">Decent Public School</span>
                          {para.split('Decent Public School')[1]}
                        </>
                      ) : para}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t text-right lg:text-left">
                <p className="font-serif text-xl font-semibold text-foreground">
                  {member.name}
                </p>
                <p className="text-muted-foreground">
                  {member.role}, <span className="text-orange-500">Decent Public School</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <FacultyModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          setShowEditModal(false)
          fetchPrincipal()
        }}
        editItem={member}
        credentials={credentials || ""}
      />
    </section>
  )
}
