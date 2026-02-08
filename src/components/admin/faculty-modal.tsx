"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, User, Loader2, Quote, Briefcase, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ImageCropper } from "./image-cropper"

interface FacultyMember {
    id: string
    name: string
    role: string
    quote: string
    cloudinary_url: string
}

interface FacultyModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    editItem?: FacultyMember | null
    credentials: string
}

export function FacultyModal({ isOpen, onClose, onSuccess, editItem, credentials }: FacultyModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(editItem?.cloudinary_url || null)
    const [showCropper, setShowCropper] = useState(false)
    const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form fields
    const [name, setName] = useState(editItem?.name || "")
    const [role, setRole] = useState(editItem?.role || "Faculty Member")
    const [quote, setQuote] = useState(editItem?.quote || "")

    const fileInputRef = useRef<HTMLInputElement>(null)

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            if (editItem) {
                setName(editItem.name)
                setRole(editItem.role)
                setQuote(editItem.quote)
                setPreviewUrl(editItem.cloudinary_url || null)
            } else {
                resetForm()
            }
        }
    }, [isOpen, editItem])

    const resetForm = () => {
        setSelectedFile(null)
        setPreviewUrl(null)
        setCroppedBlob(null)
        setName("")
        setRole("Faculty Member")
        setQuote("")
        setError(null)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setError(null)

        // Validate file type
        const isImage = file.type.startsWith("image/")
        if (!isImage) {
            setError("Please select an image file (JPEG, PNG, WebP)")
            return
        }

        // Validate file size (6MB max)
        if (file.size > 6 * 1024 * 1024) {
            setError("File too large. Maximum size: 6MB")
            return
        }

        setSelectedFile(file)

        // Create preview URL and show cropper
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        setShowCropper(true)
    }

    const handleCropComplete = (blob: Blob) => {
        setCroppedBlob(blob)
        setPreviewUrl(URL.createObjectURL(blob))
        setShowCropper(false)
    }

    const handleCropCancel = () => {
        setShowCropper(false)
        setSelectedFile(null)
        setPreviewUrl(editItem?.cloudinary_url || null)
    }

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError("Name is required")
            return
        }
        if (!quote.trim()) {
            setError("Quote is required")
            return
        }

        // For new faculty, image is required
        const hasNewImage = croppedBlob
        if (!editItem && !hasNewImage) {
            setError("Please select an image")
            return
        }

        setIsUploading(true)
        setError(null)

        try {
            const formData = new FormData()

            if (hasNewImage) {
                const fileToUpload = new File([croppedBlob], selectedFile?.name || "faculty.jpg", { type: "image/jpeg" })
                formData.append("file", fileToUpload)
            }

            formData.append("name", name)
            formData.append("role", role)
            formData.append("quote", quote)

            if (editItem) {
                formData.append("existingId", editItem.id)
                formData.append("existingUrl", editItem.cloudinary_url)
            }

            const response = await fetch("/api/faculty/upload", {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${credentials}`
                },
                body: formData
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Upload failed")
            }

            onSuccess()
            onClose()
            resetForm()

        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setIsUploading(false)
        }
    }

    if (!isOpen) return null

    return (
        <>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl my-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-slate-900 flex items-center justify-between p-6 border-b border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        {editItem ? "Edit Faculty" : "Add New Faculty"}
                                    </h2>
                                    <p className="text-sm text-slate-400">
                                        {editItem ? "Update faculty details" : "Add a new faculty member"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Image Upload Area */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">
                                    Faculty Photo
                                    {editItem && <span className="text-slate-500 ml-2">(Leave empty to keep current)</span>}
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                {previewUrl ? (
                                    <div className="relative rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 aspect-[4/5] max-w-[200px] mx-auto">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                                        >
                                            <span className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm text-sm">
                                                Change Photo
                                            </span>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-48 rounded-2xl border-2 border-dashed border-slate-700 hover:border-slate-500 bg-slate-800/50 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-slate-300 transition-all cursor-pointer"
                                    >
                                        <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium">Click to select photo</p>
                                            <p className="text-xs text-slate-500">Max 6MB, JPEG/PNG/WebP</p>
                                        </div>
                                    </button>
                                )}
                            </div>

                            {/* Name Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter faculty name..."
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                                />
                            </div>

                            {/* Role Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" />
                                    Role
                                </label>
                                <Select value={role} onValueChange={setRole}>
                                    <SelectTrigger className="w-full h-12 rounded-xl bg-slate-800 border-slate-700 text-white focus:ring-emerald-500/20 focus:border-emerald-500 transition-all hover:cursor-pointer">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700 text-white z-[200]">
                                        <SelectItem value="Academic Coordinator" className="focus:bg-emerald-500/10 focus:text-white cursor-pointer py-3">
                                            Academic Coordinator
                                        </SelectItem>
                                        <SelectItem value="Faculty Member" className="focus:bg-emerald-500/10 focus:text-white cursor-pointer py-3">
                                            Faculty Member
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Quote Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <Quote className="w-4 h-4" />
                                    Quote <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    value={quote}
                                    onChange={(e) => setQuote(e.target.value)}
                                    placeholder="Enter an inspiring quote..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-slate-900 p-6 border-t border-slate-700 flex items-center justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                disabled={isUploading}
                                className="cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isUploading}
                                className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 cursor-pointer"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {editItem ? "Updating..." : "Adding..."}
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        {editItem ? "Update" : "Add Faculty"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Image Cropper Modal */}
            {showCropper && previewUrl && (
                <ImageCropper
                    imageSrc={previewUrl}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                    aspectRatio={4 / 5}
                    borderRadius={24}
                />
            )}
        </>
    )
}
