"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { SectionHeader } from "@/components/shared/section-header"

const testimonials = [
  {
    name: "Mrs. Priya Sharma",
    role: "Parent (Class 8)",
    content:
      "My daughter has been studying here for the last few years. The teachers are sincere and give proper attention to students. Discipline is good and we are satisfied with her progress.",
    rating: 4,
  },
  {
    name: "Mr. Rajesh Kumar",
    role: "Parent (Class 5)",
    content:
      "The school environment is safe and teachers are cooperative. We get regular updates about our child. Fees are reasonable compared to other schools in the area.",
    rating: 4,
  },
  {
    name: "Anita Devi",
    role: "Parent (Class 10)",
    content:
      "The teachers helped my daughter a lot during her board preparation. They were supportive and guided students properly. We are thankful to the school staff.",
    rating: 5,
  },
  {
    name: "Rohit Das",
    role: "Student (Class 9)",
    content:
      "Teachers explain topics clearly and are helpful when we ask doubts. I like the school discipline and sports activities.",
    rating: 4,
  },
  {
    name: "Puja Kalita",
    role: "Student (Class 7)",
    content:
      "I enjoy coming to school. Teachers are kind and help us in studies and activities. Our classrooms are clean and comfortable.",
    rating: 4,
  },
  {
    name: "Aman Hazarika",
    role: "Student (Class 10)",
    content:
      "The school helped me stay focused on my studies. Teachers guide us well, especially during exams.",
    rating: 4,
  },
]


export function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 via-slate-100/50 to-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="Testimonials"
          title="What Parents Say About Us"
          description="Hear from our school community about their experience with Decent Public School."
        />

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 mt-8 sm:mt-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-6 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 relative border border-slate-100"
            >
              <Quote className="absolute top-2 right-2 sm:top-6 sm:right-6 w-4 h-4 sm:w-8 sm:h-8 text-primary/10" />

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
