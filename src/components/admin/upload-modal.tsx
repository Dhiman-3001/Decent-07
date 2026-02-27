"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, Image as ImageIcon, Video, Loader2, Link as LinkIcon, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageCropper } from "./image-cropper"

interface UploadModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    editItem?: GalleryItem | null
    credentials: string
}

interface GalleryItem {
    id: string
    type: "image" | "video"
    cloudinary_url: string
    title: string
    title2?: string
    category: "Images" | "Videos" | string
    description?: string
    links?: {
        youtube?: string
        facebook?: string
        instagram?: string
    }
}

type UploadType = "image" | "video"

export function UploadModal({ isOpen, onClose, onSuccess, editItem, credentials }: UploadModalProps) {
    const [uploadType, setUploadType] = useState<UploadType>(editItem?.type || "image")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(editItem?.cloudinary_url || null)
    const [showCropper, setShowCropper] = useState(false)
    const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form fields
    const [title, setTitle] = useState(editItem?.title || "")
    const [title2, setTitle2] = useState(editItem?.title2 || "")
    const [description, setDescription] = useState(editItem?.description || "")
    const [youtubeLink, setYoutubeLink] = useState(editItem?.links?.youtube || "")
    const [facebookLink, setFacebookLink] = useState(editItem?.links?.facebook || "")
    const [instagramLink, setInstagramLink] = useState(editItem?.links?.instagram || "")

    const fileInputRef = useRef<HTMLInputElement>(null)

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            if (editItem) {
                setUploadType(editItem.type)
                setTitle(editItem.title)
                setTitle2(editItem.title2 || "")
                setDescription(editItem.description || "")
                setYoutubeLink(editItem.links?.youtube || "")
                setFacebookLink(editItem.links?.facebook || "")
                setInstagramLink(editItem.links?.instagram || "")
                setPreviewUrl(editItem.cloudinary_url)
            } else {
                resetForm()
            }
        }
    }, [isOpen, editItem])

    const resetForm = () => {
        setUploadType("image")
        setSelectedFile(null)
        setPreviewUrl(null)
        setCroppedBlob(null)
        setTitle("")
        setTitle2("")
        setDescription("")
        setYoutubeLink("")
        setFacebookLink("")
        setInstagramLink("")
        setError(null)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setError(null)

        // Validate file type
        const isImage = file.type.startsWith("image/")
        const isVideo = file.type.startsWith("video/")

        if (uploadType === "image" && !isImage) {
            setError("Please select an image file (JPEG, PNG, WebP)")
            return
        }
        if (uploadType === "video" && !isVideo) {
            setError("Please select a video file (MP4, WebM)")
            return
        }

        // Validate file size
        const maxSize = uploadType === "image" ? 6 * 1024 * 1024 : 20 * 1024 * 1024
        if (file.size > maxSize) {
            setError(`File too large. Maximum size: ${uploadType === "image" ? "6MB" : "20MB"}`)
            return
        }

        setSelectedFile(file)

        // Create preview URL
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)

        // For images, show cropper
        if (uploadType === "image") {
            setShowCropper(true)
        }
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
        if (!title.trim()) {
            setError("Title is required")
            return
        }

        // Check if we have new file or editing without file change
        const hasNewFile = uploadType === "image" ? croppedBlob : selectedFile
        if (!editItem && !hasNewFile) {
            setError(`Please select ${uploadType === "image" ? "an image" : "a video"} to upload`)
            return
        }

        setIsUploading(true)
        setError(null)

        try {
            const formData = new FormData()

            if (hasNewFile) {
                const fileToUpload = uploadType === "image" && croppedBlob
                    ? new File([croppedBlob], selectedFile?.name || "cropped.jpg", { type: "image/jpeg" })
                    : selectedFile!
                formData.append("file", fileToUpload)
            }

            formData.append("type", uploadType)
            formData.append("title", title)

            if (uploadType === "video") {
                formData.append("title2", title2)
                formData.append("description", description)
                formData.append("youtube", youtubeLink)
                formData.append("facebook", facebookLink)
                formData.append("instagram", instagramLink)
            }

            if (editItem) {
                formData.append("existingId", editItem.id)
                formData.append("existingUrl", editItem.cloudinary_url)
            }

            const response = await fetch("/api/cloudinary/upload", {
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
                        className="bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl my-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-slate-900 flex items-center justify-between p-6 border-b border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <Upload className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        {editItem ? "Update Media" : "Upload New Media"}
                                    </h2>
                                    <p className="text-sm text-slate-400">
                                        {editItem ? "Modify the existing media item" : "Add a new image or video to the gallery"}
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
                            {/* Type Selection */}
                            {!editItem && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Media Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => {
                                                setUploadType("image")
                                                setSelectedFile(null)
                                                setPreviewUrl(null)
                                                setCroppedBlob(null)
                                            }}
                                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${uploadType === "image"
                                                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                                                : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600"
                                                }`}
                                        >
                                            <ImageIcon className="w-6 h-6" />
                                            <div className="text-left">
                                                <p className="font-medium">Image</p>
                                                <p className="text-xs opacity-70">Max 6MB, JPEG/PNG/WebP</p>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setUploadType("video")
                                                setSelectedFile(null)
                                                setPreviewUrl(null)
                                                setCroppedBlob(null)
                                            }}
                                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${uploadType === "video"
                                                ? "border-purple-500 bg-purple-500/10 text-purple-400"
                                                : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600"
                                                }`}
                                        >
                                            <Video className="w-6 h-6" />
                                            <div className="text-left">
                                                <p className="font-medium">Video</p>
                                                <p className="text-xs opacity-70">Max 20MB, MP4/WebM</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* File Upload Area */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">
                                    {uploadType === "image" ? "Image File" : "Video File"}
                                    {editItem && <span className="text-slate-500 ml-2">(Leave empty to keep current)</span>}
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept={uploadType === "image" ? "image/jpeg,image/png,image/webp" : "video/mp4,video/webm"}
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                {previewUrl ? (
                                    <div className="relative rounded-2xl overflow-hidden bg-slate-800 border border-slate-700">
                                        {uploadType === "image" ? (
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-full h-48 object-cover"
                                            />
                                        ) : (
                                            <video
                                                src={previewUrl}
                                                className="w-full h-48 object-cover"
                                                controls
                                            />
                                        )}
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                                        >
                                            <span className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                                Change {uploadType === "image" ? "Image" : "Video"}
                                            </span>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-40 rounded-2xl border-2 border-dashed border-slate-700 hover:border-slate-500 bg-slate-800/50 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-slate-300 transition-all cursor-pointer"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center">
                                            {uploadType === "image" ? <ImageIcon className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium">Click to select {uploadType}</p>
                                            <p className="text-xs text-slate-500">or drag and drop</p>
                                        </div>
                                    </button>
                                )}
                            </div>

                            {/* Title Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter title..."
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>

                            {/* Video-specific fields */}
                            {uploadType === "video" && (
                                <>
                                    {/* Secondary Title */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Secondary Title (Optional)</label>
                                        <input
                                            type="text"
                                            value={title2}
                                            onChange={(e) => setTitle2(e.target.value)}
                                            placeholder="e.g., Performance details..."
                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Description</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Enter video description..."
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                        />
                                    </div>

                                    {/* Social Links */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                            <LinkIcon className="w-4 h-4" />
                                            Social Media Links (Optional)
                                        </label>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="url"
                                                    value={youtubeLink}
                                                    onChange={(e) => setYoutubeLink(e.target.value)}
                                                    placeholder="YouTube URL"
                                                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="url"
                                                    value={facebookLink}
                                                    onChange={(e) => setFacebookLink(e.target.value)}
                                                    placeholder="Facebook URL"
                                                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="url"
                                                    value={instagramLink}
                                                    onChange={(e) => setInstagramLink(e.target.value)}
                                                    placeholder="Instagram URL"
                                                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

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
                                className="gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {editItem ? "Updating..." : "Uploading..."}
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        {editItem ? "Update" : "Upload"}
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
                    aspectRatio={1}
                    borderRadius={24}
                />
            )}
        </>
    )
}
