"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = ["All", "Events", "Achievements", "Announcements"]

const events = [
  {
    id: 1,
    title: "Science Exhibition 2025",
    category: "Events",
    date: "October 20, 2025",
    time: "9:00 AM - 2:30 PM",
    location: "Main Exhibition Hall",
    description: "Our annual science exhibition showcased the innovative spirit of our students with over 50 creative projects and working models.",
    image: "/gallery/images/img-19.jpeg",
    featured: true,
  },
  {
    id: 2,
    title: "CBSE Class 10 Toppers",
    category: "Achievements",
    date: "Academic Year 2018-2025",
    description: "Celebrating the consistent academic excellence of our students who secured top positions in the CBSE Class 10 Board Examinations.",
    image: "/gallery/images/img-1.jpeg",
    featured: true,
  },
  {
    id: 3,
    title: "Annual School Picnic",
    category: "Events",
    date: "February 5, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "Chandubi",
    description: "Students across classes 9th, 10th and all faculty members enjoyed a day of relaxation and bonding at our annual school picnic, creating lasting memories together.",
    image: "/gallery/images/img-11.jpeg",
    featured: false,
  },
  {
    id: 4,
    title: "Farewell Ceremony Batch 2024-25",
    category: "Events",
    date: "February 28, 2025",
    time: "11:00 AM",
    location: "School Classroom",
    description: "A heartfelt farewell was organized to wish the 2024-25 batch success and happiness in their future academic journeys.",
    image: "/gallery/images/img-8.jpeg",
    featured: false,
  },
  {
    id: 5,
    title: "Teacher's Day Celebration",
    category: "Events",
    date: "September 5, 2025",
    time: "10:30 AM",
    location: "School Assembly Hall",
    description: "Students expressed their gratitude through cultural performances and tokens of appreciation for our dedicated teaching staff.",
    image: "/gallery/images/img-6.jpeg",
    featured: false,
  },
  {
    id: 6,
    title: "Cultural Celebration: Bihu",
    category: "Events",
    date: "Festive Season 2025",
    description: "Encapsulating the vibrant spirit of Assam with Bihu dances celebrated in unity by the DPS family.",
    image: "/gallery/images/img-18.jpeg",
    featured: false,
  },
]

const categoryColors = {
  Events: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Achievements: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Announcements: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
}

export function EventsGrid() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const filteredEvents = activeCategory === "All"
    ? events
    : events.filter(event => event.category === activeCategory)

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
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
                className={`bg-white rounded-2xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 border border-slate-100 ${event.featured ? "md:col-span-2 lg:col-span-1" : ""
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
