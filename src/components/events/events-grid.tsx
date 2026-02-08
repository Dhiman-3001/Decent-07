"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, MapPin, ArrowRight, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import NextImage from "next/image"

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
  const [isLoading, setIsLoading] = useState(true)

  // Pagination
  const ITEMS_PER_PAGE = 50
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE)

  useEffect(() => {
    fetchItems()
  }, [])


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

  // Filter and paginate events
  const filteredEvents = useMemo(() => {
    return activeCategory === "All"
      ? events
      : events.filter(event => event.category === activeCategory)
  }, [events, activeCategory])

  const displayedEvents = useMemo(() => {
    return filteredEvents.slice(0, displayCount)
  }, [filteredEvents, displayCount])

  const hasMoreEvents = displayCount < filteredEvents.length
  const remainingCount = filteredEvents.length - displayCount

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredEvents.length))
  }

  // Reset display count when category changes
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE)
  }, [activeCategory])

  if (isLoading) {
    return <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
  }

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
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
        </div>

        {/* Items count info */}
        <div className="text-center text-sm text-muted-foreground mb-6">
          Showing {displayedEvents.length} of {filteredEvents.length} events
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
            {displayedEvents.map((event, index) => (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
                className={`relative bg-white rounded-2xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 border border-slate-100 ${event.featured ? "md:col-span-2 lg:col-span-1" : ""
                  }`}
              >
                {/* Event Image */}
                <div
                  className="aspect-[4/3] relative overflow-hidden bg-slate-100 cursor-zoom-in"
                  onClick={() => setSelectedImage(event.image)}
                >
                  <NextImage
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
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
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Load More Button */}
        {hasMoreEvents && (
          <div className="flex justify-center mt-12">
            <Button
              size="lg"
              variant="outline"
              onClick={handleLoadMore}
              className="rounded-full px-8 gap-2 border-2"
            >
              <ChevronDown className="w-5 h-5" />
              Load More ({remainingCount} remaining)
            </Button>
          </div>
        )}

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
                <div className="relative w-full h-[85vh]">
                  <NextImage
                    src={selectedImage}
                    alt="Event Full View"
                    fill
                    className="object-contain"
                  />
                </div>
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
