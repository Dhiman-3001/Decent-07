"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, Quote, Plus, Trash2, Edit2, Loader2, Save, X } from "lucide-react"
import { SectionHeader } from "@/components/shared/section-header"
import { useAdminStatus } from "@/components/admin/inline-edit"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
}

const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Mrs. Priya Sharma",
    role: "Parent (Class 8)",
    content: "My daughter has been studying here for the last few years. The teachers are sincere and give proper attention to students. Discipline is good and we are satisfied with her progress.",
    rating: 4,
  },
  {
    id: "2",
    name: "Mr. Rajesh Kumar",
    role: "Parent (Class 5)",
    content: "The school environment is safe and teachers are cooperative. We get regular updates about our child. Fees are reasonable compared to other schools in the area.",
    rating: 4,
  },
  {
    id: "3",
    name: "Anita Devi",
    role: "Parent (Class 10)",
    content: "The teachers helped my daughter a lot during her board preparation. They were supportive and guided students properly. We are thankful to the school staff.",
    rating: 5,
  },
]

export function Testimonials() {
  const { isAdmin } = useAdminStatus()
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/admin/content?section=home&subsection=testimonials')
      if (res.ok) {
        const data = await res.json()
        if (data && Array.isArray(data)) setTestimonials(data)
      }
    } catch (error) {
      console.error("Failed to load testimonials:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveTestimonials = async (newTestimonials: Testimonial[]) => {
    await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section: 'home',
        subsection: 'testimonials',
        data: newTestimonials
      })
    })
  }

  const handleAdd = async () => {
    if (!formData.name || !formData.content) return

    setIsSaving(true)
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      ...formData
    }

    const newTestimonials = [...testimonials, newTestimonial]
    setTestimonials(newTestimonials)
    await saveTestimonials(newTestimonials)

    setFormData({ name: "", role: "", content: "", rating: 5 })
    setIsAddOpen(false)
    setIsSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return

    const newTestimonials = testimonials.filter(t => t.id !== id)
    setTestimonials(newTestimonials)
    await saveTestimonials(newTestimonials)
  }

  const handleUpdate = async (id: string, updates: Partial<Testimonial>) => {
    const newTestimonials = testimonials.map(t =>
      t.id === id ? { ...t, ...updates } : t
    )
    setTestimonials(newTestimonials)
    await saveTestimonials(newTestimonials)
    setEditingId(null)
  }

  return (
    <section className="py-24 bg-linear-to-b from-slate-50 via-slate-100/50 to-slate-50 relative">
      {/* Admin Indicator */}
      {isAdmin && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/90 text-white text-xs font-medium">
          <Edit2 className="w-3 h-3" />
          Editing Testimonials
        </div>
      )}

      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <SectionHeader
            badge="Testimonials"
            title="What Parents Say About Us"
            description="Hear from our school community about their experience with Decent Public School."
          />

          {isAdmin && (
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full shadow-lg gap-2">
                  <Plus className="w-4 h-4" /> Add Testimonial
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-100">
                <DialogHeader>
                  <DialogTitle>Add Testimonial</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Mrs. Priya Sharma"
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g., Parent (Class 8)"
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write the testimonial..."
                      className="bg-slate-800 border-slate-700 min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rating (1-5)</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button
                          key={r}
                          onClick={() => setFormData({ ...formData, rating: r })}
                          className="p-1"
                        >
                          <Star
                            className={`w-6 h-6 ${r <= formData.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-slate-600"
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={handleAdd}
                    disabled={isSaving}
                    className="w-full"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Add Testimonial
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 mt-8 sm:mt-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group bg-white rounded-xl sm:rounded-2xl p-2 sm:p-6 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 relative border border-slate-100"
            >
              <Quote className="absolute top-2 right-2 sm:top-6 sm:right-6 w-4 h-4 sm:w-8 sm:h-8 text-primary/10" />

              {/* Admin Controls */}
              {isAdmin && (
                <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="p-1.5 rounded-lg bg-red-500 text-white shadow-lg hover:bg-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Rating */}
              <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-2 h-2 sm:w-4 sm:h-4 ${i < testimonial.rating
                      ? "text-secondary fill-secondary"
                      : "text-slate-200"
                      }`}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-[8px] sm:text-base text-slate-600 leading-tight sm:leading-relaxed mb-2 sm:mb-6 line-clamp-4 sm:line-clamp-none">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-3">
                <div className="w-6 h-6 sm:w-12 sm:h-12 rounded-full bg-gradient-premium flex items-center justify-center text-white font-semibold text-[8px] sm:text-base">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-[9px] sm:text-base leading-tight">
                    {testimonial.name}
                  </div>
                  <div className="text-[7px] sm:text-sm text-slate-500 leading-tight">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
