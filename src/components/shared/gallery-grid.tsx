"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Image as ImageIcon, Video, X, Maximize2, Play } from "lucide-react"
import { cn } from "@/lib/utils"

const categories = ["All", "Images", "Videos"]

const galleryItems = [
    { id: "img-1", type: "image", src: "/gallery/images/img-1.jpeg", title: "CBSE 10 Toppers list (2018-2025)", category: "Images" },
    { id: "img-2", type: "image", src: "/gallery/images/img-2.jpeg", title: "School Activity", category: "Images" },
    { id: "img-3", type: "image", src: "/gallery/images/img-3.jpeg", title: "Zubeen Garg Commemoration Ceremony", category: "Images" },
    { id: "img-4", type: "image", src: "/gallery/images/img-4.jpeg", title: "School Activity", category: "Images" },
    { id: "img-5", type: "image", src: "/gallery/images/img-5.jpeg", title: "School Activity", category: "Images" },
    { id: "img-6", type: "image", src: "/gallery/images/img-6.jpeg", title: "Teacher's Day Celebration", category: "Images" },
    { id: "img-7", type: "image", src: "/gallery/images/img-7.jpeg", title: "Teacher Staff", category: "Images" },
    { id: "img-8", type: "image", src: "/gallery/images/img-8.jpeg", title: "Farewell of Batch 2024-25", category: "Images" },
    { id: "img-9", type: "image", src: "/gallery/images/img-9.jpeg", title: "Holi Celebration", category: "Images" },
    { id: "img-10", type: "image", src: "/gallery/images/img-10.jpeg", title: "Farewell Batch 2024-25", category: "Images" },
    { id: "img-11", type: "image", src: "/gallery/images/img-11.jpeg", title: "School Picnic (2024-25)", category: "Images" },
    { id: "img-12", type: "image", src: "/gallery/images/img-12.jpeg", title: "Class 10th Batch (2024-25)", category: "Images" },
    { id: "img-13", type: "image", src: "/gallery/images/img-13.jpeg", title: "School Picnic (2024-25)", category: "Images" },
    { id: "img-14", type: "image", src: "/gallery/images/img-14.jpeg", title: "School Picnic (2024-25)", category: "Images" },
    { id: "img-15", type: "image", src: "/gallery/images/img-15.jpeg", title: "School Picnic (2024-25)", category: "Images" },
    { id: "img-16", type: "image", src: "/gallery/images/img-16.jpeg", title: "School Picnic (2024-25)", category: "Images" },
    { id: "img-17", type: "image", src: "/gallery/images/img-17.jpeg", title: "Zubeen Garg Tribute Ceremony", category: "Images" },
    { id: "img-18", type: "image", src: "/gallery/images/img-18.jpeg", title: "Bihu Celebration", category: "Images" },
    { id: "img-19", type: "image", src: "/gallery/images/img-19.jpeg", title: "Science Exhibition", category: "Images" },
    { id: "img-20", type: "image", src: "/gallery/images/img-20.jpeg", title: "Science Exhibition", category: "Images" },
    { id: "img-21", type: "image", src: "/gallery/images/img-21.jpeg", title: "Science Exhibition", category: "Images" },
    { id: "img-22", type: "image", src: "/gallery/images/img-22.jpeg", title: "Science Exhibition", category: "Images" },
    { id: "img-23", type: "image", src: "/gallery/images/img-23.jpeg", title: "Science Exhibition", category: "Images" },
    { id: "img-24", type: "image", src: "/gallery/images/img-24.jpeg", title: "Science Exhibition", category: "Images" },
    { id: "img-25", type: "image", src: "/gallery/images/img-25.jpeg", title: "Science Exhibition", category: "Images" },
    { id: "vid-1", type: "video", src: "/gallery/videos/vid-1.mp4", title: "School Sports Week", category: "Videos" },
    { id: "vid-2", type: "video", src: "/gallery/videos/vid-2.mp4", title: "Science Exhibition Highlights", category: "Videos" },
]

export function GalleryGrid() {
    const [activeCategory, setActiveCategory] = useState("All")
    const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null)

    const filteredItems = activeCategory === "All"
        ? galleryItems
        : galleryItems.filter(item => item.category === activeCategory)

    return (
        <section className="py-24">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
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
