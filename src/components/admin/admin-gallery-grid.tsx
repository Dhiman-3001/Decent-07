"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import NextImage from "next/image"
import {
    Image as ImageIcon,
    Video,
    X,
    Play,
    ChevronDown,
    ExternalLink,
    Loader2,
    Plus,
    Trash2,
    Edit2,
    AlertTriangle,
    ArrowLeft,
    Upload
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UploadModal } from "@/components/admin/upload-modal"
import Link from "next/link"

const categories = ["Images", "Videos"]

// Pagination config
const ITEMS_PER_PAGE_IMAGE = 24
const ITEMS_PER_PAGE_VIDEO = 12
const INITIAL_DISPLAY_IMAGE = 12
const INITIAL_DISPLAY_VIDEO = 8

type GalleryItem = {
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

interface AdminGalleryGridProps {
    credentials: string
}

export function AdminGalleryGrid({ credentials }: AdminGalleryGridProps) {
    const [activeCategory, setActiveCategory] = useState("Images")
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
    const [items, setItems] = useState<GalleryItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [showingMore, setShowingMore] = useState(false)

    // Modal states
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [editItem, setEditItem] = useState<GalleryItem | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<GalleryItem | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Count items by type
    const itemCounts = useMemo(() => {
        const images = items.filter(i => i.type === "image").length
        const videos = items.filter(i => i.type === "video").length
        return { images, videos }
    }, [items])

    const fetchItems = useCallback(async () => {
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
    }, [])

    useEffect(() => {
        fetchItems()
    }, [fetchItems])

    useEffect(() => {
        setCurrentPage(1)
        setShowingMore(false)
    }, [activeCategory, selectedItem])

    // Filter and paginate items
    const filteredItems = useMemo(() => {
        return activeCategory === "All"
            ? items
            : items.filter(item => item.category === activeCategory)
    }, [items, activeCategory])

    // Calculate total pages
    const itemsPerPage = activeCategory === "Videos" ? ITEMS_PER_PAGE_VIDEO : ITEMS_PER_PAGE_IMAGE
    const initialDisplayCount = activeCategory === "Videos" ? INITIAL_DISPLAY_VIDEO : INITIAL_DISPLAY_IMAGE
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

    const displayedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        const end = start + itemsPerPage
        const pageItems = filteredItems.slice(start, end)

        if (!showingMore) {
            return pageItems.slice(0, initialDisplayCount)
        }
        return pageItems
    }, [filteredItems, currentPage, showingMore, itemsPerPage, initialDisplayCount])

    const currentPageItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        const end = start + itemsPerPage
        return filteredItems.slice(start, end)
    }, [filteredItems, currentPage, itemsPerPage])

    const canShowMore = !showingMore && currentPageItems.length > initialDisplayCount
    const remainingOnPage = currentPageItems.length - initialDisplayCount

    const handleShowMore = () => {
        setShowingMore(true)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        setShowingMore(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleEdit = (item: GalleryItem, e: React.MouseEvent) => {
        e.stopPropagation()
        setEditItem(item)
        setShowUploadModal(true)
    }

    const handleDelete = async () => {
        if (!deleteConfirm) return

        setIsDeleting(true)
        try {
            const response = await fetch('/api/cloudinary/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${credentials}`
                },
                body: JSON.stringify({
                    id: deleteConfirm.id,
                    cloudinary_url: deleteConfirm.cloudinary_url,
                    type: deleteConfirm.type
                })
            })

            if (response.ok) {
                await fetchItems()
                setDeleteConfirm(null)
            } else {
                const data = await response.json()
                alert(data.error || 'Failed to delete')
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('Failed to delete media')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleUploadSuccess = () => {
        fetchItems()
        setEditItem(null)
    }

    if (isLoading) {
        return <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
    }

    return (
        <section className="py-24">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Header with Back Link */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/admin" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Dashboard</span>
                    </Link>
                    <Button
                        onClick={() => {
                            setEditItem(null)
                            setShowUploadModal(true)
                        }}
                        className="gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
                    >
                        <Plus className="w-5 h-5" />
                        Upload New
                    </Button>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={cn(
                                    "px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer",
                                    activeCategory === category
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                                        : "bg-muted dark:bg-card/40 text-muted-foreground hover:bg-muted/80 dark:hover:bg-card/60 backdrop-blur-sm border border-border/40"
                                )}
                            >
                                {category}
                                {category === "Images" && ` (${itemCounts.images})`}
                                {category === "Videos" && ` (${itemCounts.videos})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Items count */}
                <div className="text-center text-sm text-muted-foreground mb-6">
                    Showing {displayedItems.length} of {filteredItems.length} items
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
                        {displayedItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.5) }}
                                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
                                onClick={() => setSelectedItem(item)}
                            >
                                {item.cloudinary_url ? (
                                    item.type === "image" ? (
                                        <NextImage
                                            src={item.cloudinary_url}
                                            alt={item.title}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="relative w-full h-full">
                                            <video
                                                src={item.cloudinary_url}
                                                className="w-full h-full object-cover"
                                                muted
                                                preload="metadata"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 group-hover:opacity-0">
                                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                                                    <Play className="w-6 h-6 fill-current" />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800/50 text-slate-400 gap-2">
                                        <Upload className="w-8 h-8 opacity-20" />
                                        <span className="text-[10px] font-medium uppercase tracking-wider opacity-50">Upload Needed</span>
                                    </div>
                                )}

                                {/* Hover Overlay with Admin Actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                                    <p className="text-white text-sm font-medium text-center px-4">{item.title}</p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => handleEdit(item, e)}
                                            className="w-10 h-10 rounded-full bg-blue-500/80 hover:bg-blue-600 flex items-center justify-center text-white transition-colors cursor-pointer"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setDeleteConfirm(item)
                                            }}
                                            className="w-10 h-10 rounded-full bg-red-500/80 hover:bg-red-600 flex items-center justify-center text-white transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Type Badge */}
                                <div className="absolute top-4 left-4">
                                    <div className="w-8 h-8 rounded-lg bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20 text-white">
                                        {item.type === "image" ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Show More Button */}
                {canShowMore && (
                    <div className="flex justify-center mt-12">
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={handleShowMore}
                            className="rounded-full px-8 gap-2 border-2 cursor-pointer"
                        >
                            <ChevronDown className="w-5 h-5" />
                            Show More ({remainingOnPage} remaining)
                        </Button>
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (showingMore || currentPageItems.length <= initialDisplayCount) && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            className="rounded-full px-4 cursor-pointer"
                        >
                            Previous
                        </Button>

                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={cn(
                                    "w-8 h-8 rounded-full text-sm font-medium transition-colors cursor-pointer",
                                    currentPage === i + 1
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted text-muted-foreground"
                                )}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="rounded-full px-4 cursor-pointer"
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>

            {/* Preview Lightbox */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm overflow-y-auto"
                        data-lenis-prevent
                        onClick={() => setSelectedItem(null)}
                    >
                        <div className="min-h-full w-full flex items-center justify-center p-4 md:p-8">
                            <button
                                className="fixed top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-[110] cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedItem(null)
                                }}
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="relative w-full max-w-6xl my-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {selectedItem.type === "image" ? (
                                    <div className="flex flex-col items-center w-full h-[80vh] relative">
                                        <NextImage
                                            src={selectedItem.cloudinary_url}
                                            alt={selectedItem.title}
                                            fill
                                            className="object-contain rounded-2xl shadow-2xl"
                                        />
                                        <div className="mt-6 text-center">
                                            <h3 className="text-white text-xl font-semibold">{selectedItem.title}</h3>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                                            <div className="lg:col-span-3 bg-black/60 relative flex items-center justify-center h-[50vh] lg:h-[75vh] w-full max-w-full rounded-3xl overflow-hidden border border-white/10">
                                                <video
                                                    src={selectedItem.cloudinary_url}
                                                    controls
                                                    autoPlay
                                                    playsInline
                                                    className="w-full h-full object-contain rounded-3xl overflow-hidden focus:outline-none"
                                                    style={{ maxHeight: '100%', maxWidth: '100%' }}
                                                />
                                            </div>

                                            <div className="lg:col-span-2 bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl flex flex-col h-auto lg:h-[75vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                                                <div className="mb-6">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                                            <Video className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <span className="text-xs font-medium text-primary/80 uppercase tracking-wider">Video</span>
                                                    </div>
                                                    <h3 className="text-white text-xl lg:text-2xl font-bold leading-tight">
                                                        {selectedItem.title}
                                                    </h3>
                                                    {selectedItem.title2 && (
                                                        <p className="text-white/60 text-sm mt-1">
                                                            {selectedItem.title2}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">Description</h4>
                                                    <p className="text-white/70 text-sm leading-relaxed">
                                                        {selectedItem.description || "No description available."}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {(selectedItem.links?.youtube || selectedItem.links?.facebook || selectedItem.links?.instagram) && (
                                            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                                                <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">Watch Full Video:</span>
                                                {selectedItem.links?.youtube && (
                                                    <a
                                                        href={selectedItem.links.youtube}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 hover:text-red-300 transition-all duration-300 text-sm font-medium cursor-pointer"
                                                    >
                                                        YouTube
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                                {selectedItem.links?.facebook && (
                                                    <a
                                                        href={selectedItem.links.facebook}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-300 text-sm font-medium cursor-pointer"
                                                    >
                                                        Facebook
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                                {selectedItem.links?.instagram && (
                                                    <a
                                                        href={selectedItem.links.instagram}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-400 hover:text-purple-300 transition-all duration-300 text-sm font-medium cursor-pointer"
                                                    >
                                                        Instagram
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Upload Modal */}
            <UploadModal
                isOpen={showUploadModal}
                onClose={() => {
                    setShowUploadModal(false)
                    setEditItem(null)
                }}
                onSuccess={handleUploadSuccess}
                editItem={editItem}
                credentials={credentials}
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
                                    <h3 className="text-lg font-semibold text-white">Delete {deleteConfirm.type === "image" ? "Image" : "Video"}?</h3>
                                    <p className="text-sm text-slate-400">This action cannot be undone.</p>
                                </div>
                            </div>

                            <div className="mb-6 p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                                <p className="text-sm text-slate-300 truncate">{deleteConfirm.title}</p>
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
