"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, MapPin, ArrowRight, Plus, Trash2, Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageCropper } from "@/components/admin/image-cropper"
import { cn } from "@/lib/utils"

const categories = ["All", "Events", "Achievements", "Announcements"]

const categoryColors = {
  Events: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Achievements: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Announcements: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
}

type EventItem = {
  id: string | number
  title: string
  category: string
  date: string
  time?: string
  location?: string
  description: string
  image: string
  featured?: boolean
}

export function EventsGrid() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [events, setEvents] = useState<EventItem[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Upload/Add Event State
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [uploadStep, setUploadStep] = useState<"crop" | "details">("crop")
  const [croppedFile, setCroppedFile] = useState<File | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Events",
    date: "",
    time: "",
    location: ""
  })
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    fetchItems()
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      setIsAdmin(data.isAdmin)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/events')
      if (res.ok) {
        const data = await res.json()
        setEvents(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const res = await fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setEvents(events.filter(i => String(i.id) !== String(id)))
      }
    } catch (e) {
      console.error("Delete failed", e)
    }
  }

  const handleCropComplete = (file: File) => {
    setCroppedFile(file)
    setUploadStep("details")
  }

  const handleFormSubmit = async () => {
    if (!croppedFile || !formData.title || !formData.description) {
      alert("Please fill in required fields (Image, Title, Description)")
      return
    }

    setIsUploading(true)
    try {
      // 1. Upload Image
      const fileData = new FormData()
      fileData.append("file", croppedFile)

      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: fileData
      })

      if (!uploadRes.ok) throw new Error("Image upload failed")
      const uploadResult = await uploadRes.json()

      // 2. Add Event Data
      const newEvent = {
        id: Date.now(), // Generate unique ID
        ...formData,
        image: uploadResult.path,
        featured: false // Default to false
      }

      const dataRes = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      })

      if (dataRes.ok) {
        const result = await dataRes.json()
        setEvents(result.data)
        setIsAddOpen(false)
        resetForm()
      }
    } catch (e) {
      console.error(e)
      alert("Failed to add event")
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setCroppedFile(null)
    setUploadStep("crop")
    setFormData({
      title: "",
      description: "",
      category: "Events",
      date: "",
      time: "",
      location: ""
    })
  }

  const filteredEvents = activeCategory === "All"
    ? events
    : events.filter(event => event.category === activeCategory)

  if (isLoading) {
    return <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
  }

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {isAdmin && (
            <Dialog open={isAddOpen} onOpenChange={(open) => {
              setIsAddOpen(open)
              if (!open) resetForm()
            }}>
              <DialogTrigger asChild>
                <Button size="lg" className="rounded-full shadow-lg gap-2">
                  <Plus className="w-5 h-5" /> Add Event / News
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Itenary</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                  {uploadStep === "crop" ? (
                    <ImageCropper
                      aspectRatio={4 / 3} // Standard card ratio
                      onCropConfig={handleCropComplete}
                      onCancel={() => setIsAddOpen(false)}
                    />
                  ) : (
                    <div className="space-y-6">
                      {/* Preview */}
                      {croppedFile && (
                        <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-100 relative group">
                          <img src={URL.createObjectURL(croppedFile)} className="w-full h-full object-cover" />
                          <Button
                            variant="secondary"
                            size="sm"
                            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setUploadStep("crop")}
                          >
                            Change Image
                          </Button>
                        </div>
                      )}

                      <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                              value={formData.category}
                              onValueChange={(val) => setFormData({ ...formData, category: val })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.filter(c => c !== "All").map(c => (
                                  <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                              placeholder="e.g. October 20, 2025"
                              value={formData.date}
                              onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Title / Heading</Label>
                          <Input
                            placeholder="Event Title"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            placeholder="Brief description of the event..."
                            className="h-24"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Time (Optional)</Label>
                            <Input
                              placeholder="e.g. 9:00 AM"
                              value={formData.time}
                              onChange={e => setFormData({ ...formData, time: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Location (Optional)</Label>
                            <Input
                              placeholder="e.g. Main Hall"
                              value={formData.location}
                              onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => setUploadStep("crop")}>Back</Button>
                        <Button onClick={handleFormSubmit} disabled={isUploading}>
                          {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                          Publish Event
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Events Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredEvents.map((event, index) => (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`relative bg-white rounded-2xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 border border-slate-100 ${event.featured ? "md:col-span-2 lg:col-span-1" : ""
                  }`}
              >
                {/* Event Image */}
                <div
                  className="aspect-[4/3] relative overflow-hidden bg-slate-100 cursor-zoom-in"
                  onClick={() => setSelectedImage(event.image)}
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ objectPosition: "center 25%" }}
                  />
                  {event.featured && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-bold backdrop-blur-sm shadow-md">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Category Badge */}
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${categoryColors[event.category as keyof typeof categoryColors]}`}>
                    {event.category}
                  </span>

                  <h3 className="font-serif text-xl font-semibold text-slate-900 mb-3 line-clamp-2">
                    {event.title}
                  </h3>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    {event.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  <Button variant="ghost" className="mt-4 p-0 h-auto text-primary hover:text-primary/80">
                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                {/* Admin Delete Button */}
                {isAdmin && (
                  <button
                    className="absolute top-4 right-4 z-20 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    onClick={(e) => handleDelete(e, event.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                {/* Override featured badge if delete button is there to avoid overlap? No, Featured is top right. Delete might conflict. Move delete to top left. */}
                {isAdmin && (
                  <button
                    className="absolute top-4 left-4 z-20 p-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors"
                    onClick={(e) => handleDelete(e, event.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-4xl max-h-[90vh] w-full rounded-2xl overflow-hidden bg-white"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage}
                  alt="Event Full View"
                  className="w-full h-full object-contain max-h-[85vh]"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
