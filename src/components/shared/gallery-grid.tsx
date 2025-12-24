"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Image as ImageIcon, Video, X, Maximize2, Play, Plus, Trash2, Loader2, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageCropper } from "@/components/admin/image-cropper"
import galleryData from "@/data/gallery.json"

const categories = ["All", "Images", "Videos"]

type GalleryItem = {
    id: string
    type: "image" | "video"
    src: string
    title: string
    category: "Images" | "Videos" | string
}

export function GalleryGrid() {
    const [activeCategory, setActiveCategory] = useState("All")
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
    const [items, setItems] = useState<GalleryItem[]>(galleryData as GalleryItem[])
    const [isAdmin, setIsAdmin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Upload State
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [uploadStep, setUploadStep] = useState<"crop" | "details">("crop")
    const [croppedFile, setCroppedFile] = useState<File | null>(null)
    const [newTitle, setNewTitle] = useState("")
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
            const res = await fetch('/api/admin/gallery')
            if (res.ok) {
                const data = await res.json()
                setItems(data)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        if (!confirm("Are you sure you want to delete this item?")) return

        try {
            const res = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                const data = await res.json()
                setItems(data.data || items.filter(i => i.id !== id))
            }
        } catch (e) {
            console.error("Delete failed", e)
        }
    }

    const handleCropComplete = (file: File) => {
        setCroppedFile(file)
        setUploadStep("details")
    }

    const handleUploadSubmit = async () => {
        if (!croppedFile || !newTitle) {
            alert("Please provide an image and caption")
            return
        }

        setIsUploading(true)
        try {
            // 1. Upload Image
            const formData = new FormData()
            formData.append("file", croppedFile)

            const uploadRes = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            })

            const uploadData = await uploadRes.json()

            if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed")

            // 2. Add to Gallery Data
            const newItem = {
                id: uploadData.id,
                type: "image",
                src: uploadData.path,
                title: newTitle,
                category: "Images"
            }

            const dataRes = await fetch('/api/admin/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            })

            if (dataRes.ok) {
                const result = await dataRes.json()
                setItems(result.data)
                setIsUploadOpen(false)
                resetUploadForm()
            }
        } catch (e) {
            console.error(e)
            alert("Failed to add image. Check console.")
        } finally {
            setIsUploading(false)
        }
    }

    const resetUploadForm = () => {
        setCroppedFile(null)
        setNewTitle("")
        setUploadStep("crop")
    }

    const filteredItems = activeCategory === "All"
        ? items
        : items.filter(item => item.category === activeCategory)

    if (isLoading) {
        return <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
    }

    return (
        <section className="py-24">
            <div className="container mx-auto px-4 lg:px-8">

                {/* Admin Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={cn(
                                    "px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                                    activeCategory === category
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                                        : "bg-muted dark:bg-card/40 text-muted-foreground hover:bg-muted/80 dark:hover:bg-card/60 backdrop-blur-sm border border-border/40"
                                )}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {isAdmin && (
                        <Dialog open={isUploadOpen} onOpenChange={(open) => {
                            setIsUploadOpen(open)
                            if (!open) resetUploadForm()
                        }}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="rounded-full shadow-lg gap-2">
                                    <Plus className="w-5 h-5" /> Upload Media
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-xl bg-slate-900 border-slate-800 text-slate-100">
                                <DialogHeader>
                                    <DialogTitle>Upload to Gallery</DialogTitle>
                                </DialogHeader>

                                <div className="py-4">
                                    {uploadStep === "crop" ? (
                                        <ImageCropper
                                            aspectRatio={1} // Square for grid
                                            onCropConfig={handleCropComplete}
                                            onCancel={() => setIsUploadOpen(false)}
                                        />
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="aspect-square w-32 mx-auto rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
                                                {croppedFile && <img src={URL.createObjectURL(croppedFile)} className="w-full h-full object-cover" />}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Caption / Subtitle</Label>
                                                <Input
                                                    value={newTitle}
                                                    onChange={(e) => setNewTitle(e.target.value)}
                                                    placeholder="Enter image caption..."
                                                    className="bg-slate-800 border-slate-700 text-white"
                                                />
                                            </div>

                                            <div className="flex justify-end gap-3 pt-4">
                                                <Button variant="ghost" onClick={() => setUploadStep("crop")}>Back</Button>
                                                <Button onClick={handleUploadSubmit} disabled={isUploading}>
                                                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                                                    Upload Item
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {/* Gallery Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                        {filteredItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.02 }}
                                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
                                onClick={() => setSelectedItem(item)}
                            >
                                {item.type === "image" ? (
                                    <img
                                        src={item.src}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="relative w-full h-full">
                                        <video
                                            src={item.src}
                                            className="w-full h-full object-cover"
                                            muted
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                                                <Play className="w-6 h-6 fill-current" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="text-white text-center p-4">
                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-2 border border-white/30">
                                            {item.type === "image" ? <Maximize2 className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                        </div>
                                        <p className="text-sm font-medium">{item.title}</p>
                                    </div>
                                </div>

                                {/* Type Badge */}
                                <div className="absolute top-4 left-4">
                                    <div className="w-8 h-8 rounded-lg bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20 text-white">
                                        {item.type === "image" ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                                    </div>
                                </div>

                                {/* Admin Delete Button */}
                                {isAdmin && (
                                    <button
                                        className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-red-600/90 text-white flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors z-20"
                                        onClick={(e) => handleDelete(e, item.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8"
                        onClick={() => setSelectedItem(null)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white hover:text-slate-300 transition-colors z-[110]"
                            onClick={(e) => {
                                e.stopPropagation()
                                setSelectedItem(null)
                            }}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-full max-h-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedItem.type === "image" ? (
                                <img
                                    src={selectedItem.src}
                                    alt={selectedItem.title}
                                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                                />
                            ) : (
                                <video
                                    src={selectedItem.src}
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
                                />
                            )}

                            <div className="absolute -bottom-12 left-0 right-0 text-center">
                                <h3 className="text-white text-lg font-medium">{selectedItem.title}</h3>
                                <p className="text-white/60 text-sm">{selectedItem.category}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
