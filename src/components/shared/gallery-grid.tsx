"use client"

import NextImage from "next/image"
import { useState, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Image as ImageIcon, Video, X, Maximize2, Play, ChevronDown, ExternalLink, Loader2 } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import galleryData from "@/data/gallery.json"

const categories = ["Images", "Videos"]

// Pagination config
const ITEMS_PER_PAGE_IMAGE = 24
const ITEMS_PER_PAGE_VIDEO = 12
const INITIAL_DISPLAY_IMAGE = 12
const INITIAL_DISPLAY_VIDEO = 8

type GalleryItem = {
    id: string
    type: "image" | "video"
    cloudinary_url: string // Cloudinary URL for media
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

export function GalleryGrid() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "Images")
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
    const [items, setItems] = useState<GalleryItem[]>(galleryData as GalleryItem[])
    const [isLoading, setIsLoading] = useState(true)

    // Video Player State
    const [videoQuality, setVideoQuality] = useState("1080")
    const [savedTime, setSavedTime] = useState(0)
    const [isBuffering, setIsBuffering] = useState(true)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [loadingProgress, setLoadingProgress] = useState(0)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1)
    const [showingMore, setShowingMore] = useState(false)

    // Count items by type
    const itemCounts = useMemo(() => {
        const images = items.filter(i => i.type === "image").length
        const videos = items.filter(i => i.type === "video").length
        return { images, videos }
    }, [items])

    useEffect(() => {
        fetchItems()
    }, [])

    // Reset video state when opening new item
    useEffect(() => {
        if (selectedItem) {
            setVideoQuality("1080")
            setSavedTime(0)
            setIsBuffering(true)
            setLoadingProgress(0)
        }
    }, [selectedItem])

    // Better buffering check interval
    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isBuffering && selectedItem?.type === 'video') {
            interval = setInterval(() => {
                if (videoRef.current) {
                    const vid = videoRef.current
                    if (vid.duration > 0 && vid.buffered.length > 0) {
                        const loaded = vid.buffered.end(vid.buffered.length - 1)
                        const progress = (loaded / vid.duration) * 100
                        setLoadingProgress(Math.min(progress, 100))

                        if (progress >= 15) {
                            setIsBuffering(false)
                            vid.play().catch(console.error)
                        }
                    }
                }
            }, 50) // Check every 50ms for smoother updates
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isBuffering, selectedItem])



    const handleCategoryChange = (category: string) => {
        setActiveCategory(category)
        setCurrentPage(1)
        setShowingMore(false)
        router.replace(`${pathname}?category=${category}&page=1`, { scroll: false })
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

        // If not showing more, only show initial subset
        if (!showingMore) {
            return pageItems.slice(0, initialDisplayCount)
        }
        return pageItems
    }, [filteredItems, currentPage, showingMore, itemsPerPage, initialDisplayCount])

    // Check if "Show More" should be visible
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
        router.replace(`${pathname}?category=${activeCategory}&page=${page}`, { scroll: false })
    }

    if (isLoading) {
        return <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
    }

    return (
        <section className="py-24">
            <div className="container mx-auto px-4 lg:px-8">

                {/* Filter Tabs */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
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

                {/* Items count and showing info */}
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
                                            {/* Generate a thumbnail from Cloudinary video by changing extension to .jpg */}
                                            <NextImage
                                                src={item.cloudinary_url.replace(/\.[^/.]+$/, ".jpg")}
                                                alt={item.title}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
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
                                        <ImageIcon className="w-8 h-8 opacity-20" />
                                        <span className="text-[10px] font-medium uppercase tracking-wider opacity-50">Coming Soon</span>
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
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Show More Button (within current page) */}
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
                        {/* Previous Page */}
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            className="rounded-full px-4 cursor-pointer"
                        >
                            Previous
                        </Button>

                        {/* Page Numbers */}
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

                        {/* Next Page */}
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="rounded-full px-4 cursor-pointer"
                        >
                            Next Section
                        </Button>
                    </div>
                )}
            </div>

            {/* Lightbox */}
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
                                    // Image Lightbox - Simple centered view
                                    <div className="flex flex-col items-center w-full h-[80vh] relative">
                                        <NextImage
                                            src={selectedItem.cloudinary_url}
                                            alt={selectedItem.title}
                                            fill
                                            className="object-contain rounded-2xl shadow-2xl"
                                        />
                                        <div className="mt-6 text-center">
                                            <h3 className="text-white text-xl font-semibold">{selectedItem.title}</h3>
                                            {selectedItem.description && (
                                                <p className="text-white/60 text-sm mt-2 max-w-2xl">{selectedItem.description}</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    // Video Lightbox - Premium Two-Column Layout
                                    <div className="flex flex-col gap-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                                            {/* Left Column - Video Player */}
                                            <div className="lg:col-span-3 bg-black/60 relative flex items-center justify-center h-[50vh] lg:h-[75vh] w-full max-w-full rounded-3xl overflow-hidden border border-white/10 group/video">
                                                {(() => {
                                                    const optimizedUrl = selectedItem.cloudinary_url.replace(
                                                        '/video/upload/',
                                                        `/video/upload/f_mp4,vc_h264,q_auto,h_${videoQuality},c_limit/`
                                                    ).replace(/\.[^/.]+$/, '.mp4');

                                                    return (
                                                        <>
                                                            {/* Loading Overlay with Progress */}
                                                            <AnimatePresence>
                                                                {isBuffering && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: 1 }}
                                                                        exit={{ opacity: 0 }}
                                                                        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
                                                                    >
                                                                        {/* Video Poster/Thumbnail Background while loading */}
                                                                        <div className="absolute inset-0 opacity-20 bg-center bg-cover blur-md"
                                                                            style={{
                                                                                backgroundImage: `url(${selectedItem.cloudinary_url.replace(/\.[^/.]+$/, ".jpg")})`
                                                                            }}
                                                                        />

                                                                        <div className="relative z-10 flex flex-col items-center gap-3">
                                                                            <div className="relative">
                                                                                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                                    <span className="text-[8px] font-bold text-white/50">
                                                                                        {Math.round(loadingProgress)}%
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <span className="text-white/60 text-xs font-medium tracking-widest uppercase animate-pulse">
                                                                                Buffering Video
                                                                            </span>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>

                                                            <video
                                                                ref={videoRef}
                                                                key={selectedItem.id} // Use ID to persist element ref, src change triggers load
                                                                src={optimizedUrl}
                                                                controls={!isBuffering}
                                                                autoPlay={false} // Disable autoplay to handle manually
                                                                playsInline
                                                                preload="auto"
                                                                className={cn(
                                                                    "w-full h-full object-contain focus:outline-none transition-opacity duration-500",
                                                                    isBuffering ? "opacity-0" : "opacity-100"
                                                                )}
                                                                style={{ maxHeight: '100%', maxWidth: '100%' }}
                                                                onLoadedMetadata={(e) => {
                                                                    if (savedTime > 0) {
                                                                        e.currentTarget.currentTime = savedTime
                                                                    }
                                                                }}
                                                                onProgress={(e) => {
                                                                    const vid = e.currentTarget;
                                                                    if (vid.duration > 0) {
                                                                        const buffered = vid.buffered;
                                                                        if (buffered.length > 0) {
                                                                            const loaded = buffered.end(buffered.length - 1);
                                                                            const progress = (loaded / vid.duration) * 100;
                                                                            setLoadingProgress(Math.min(progress, 100));

                                                                            // Wait for 15% buffer before playing
                                                                            if (progress >= 15 && isBuffering) {
                                                                                setIsBuffering(false);
                                                                                vid.play().catch(console.error);
                                                                            }
                                                                        }
                                                                    }
                                                                }}
                                                                onWaiting={() => {
                                                                    // Only trigger buffering if we really stalled, but don't reset full load logic
                                                                    // if simply seeking.
                                                                    // For now, let's keep it simple: initial load is the main concern.
                                                                }}
                                                            >
                                                                <source src={optimizedUrl} type="video/mp4" />
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        </>
                                                    );
                                                })()}
                                            </div>

                                            {/* Right Column - Details Card */}
                                            <div className="lg:col-span-2 bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl flex flex-col h-auto lg:h-[75vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                                {/* Title */}
                                                <div className="mb-6">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                                                <Video className="w-4 h-4 text-primary" />
                                                            </div>
                                                            <span className="text-xs font-medium text-primary/80 uppercase tracking-wider">Video</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm p-1 rounded-lg border border-white/10">
                                                            {["1080", "720", "480"].map((q) => (
                                                                <button
                                                                    key={q}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        if (videoRef.current) {
                                                                            setSavedTime(videoRef.current.currentTime)
                                                                        }
                                                                        setVideoQuality(q)
                                                                        setIsBuffering(true) // Re-trigger buffering for new quality source
                                                                        setLoadingProgress(0)
                                                                    }}
                                                                    className={cn(
                                                                        "px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer",
                                                                        videoQuality === q
                                                                            ? "bg-primary/20 text-primary shadow-sm"
                                                                            : "text-white/40 hover:text-white/70 hover:bg-white/5"
                                                                    )}
                                                                >
                                                                    {q}p
                                                                </button>
                                                            ))}
                                                        </div>
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

                                                {/* Description */}
                                                <div className="flex-1">
                                                    <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">Description</h4>
                                                    <p className="text-white/70 text-sm leading-relaxed">
                                                        {selectedItem.description || "Experience this memorable moment from Decent Public School. Watch the video to relive the event."}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Full Video Links - Below both cards */}
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
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                        </svg>
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
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                        </svg>
                                                        Facebook
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                                {selectedItem.links?.instagram && (
                                                    <a
                                                        href={selectedItem.links.instagram}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/30 text-purple-400 hover:text-purple-300 transition-all duration-300 text-sm font-medium cursor-pointer"
                                                    >
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                                        </svg>
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
        </section >
    )
}
