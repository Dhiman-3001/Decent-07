"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const contactDetails = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["Bikrampur Path, Krishna Nagar", "Japorigog, Guwahati", "Assam - 781005"],
    textClass: "text-blue-400",
    bgClass: "bg-blue-900/20",
    borderClass: "border-blue-500/20",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+91 60027 17101"],
    textClass: "text-green-400",
    bgClass: "bg-green-900/20",
    borderClass: "border-green-500/20",
    action: { label: "Call Now", href: "tel:+916002717101" },
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["decentpublicschool2007@gmail.com"],
    textClass: "text-indigo-400",
    bgClass: "bg-indigo-900/20",
    borderClass: "border-indigo-500/20",
    action: { label: "Send Email", href: "mailto:decentpublicschool2007@gmail.com" },
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["Monday - Friday: 8:00 AM - 4:00 PM", "Saturday: 8:00 AM - 1:00 PM", "Sunday: Closed"],
    textClass: "text-amber-400",
    bgClass: "bg-amber-900/20",
    borderClass: "border-amber-500/20",
  },
]

export function ContactInfo() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactDetails.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-slate-900 hover:bg-slate-800 transition-colors duration-300 rounded-2xl p-6 shadow-xl text-center border border-slate-800"
            >
              <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4 border ${item.bgClass} ${item.borderClass}`}>
                <item.icon className={`w-7 h-7 ${item.textClass}`} />
              </div>
              <h3 className="font-serif text-lg font-semibold text-white mb-3">
                {item.title}
              </h3>
              <div className={`space-y-1 text-slate-400 mb-4 ${item.title === "Working Hours" ? "text-xs" : "text-sm"}`}>
                {item.details.map((detail, i) => (
                  <p key={i}>{detail}</p>
                ))}
              </div>
              {item.action && (
                <a href={item.action.href}>
                  <Button variant="outline" size="sm" className="w-full border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white">
                    {item.action.label}
                  </Button>
                </a>
              )}
            </motion.div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-green-50 dark:bg-green-900/20 rounded-2xl p-8 text-center"
        >
          <MessageCircle className="w-12 h-12 mx-auto text-green-600 mb-4" />
          <h3 className="font-serif text-2xl font-semibold text-blue-900 dark:text-white mb-2">
            Quick Response on WhatsApp
          </h3>
          <p className="text-muted-foreground mb-6">
            Get instant answers to your queries. Chat with us on WhatsApp for quick assistance.
          </p>
          <a
            href="https://wa.me/916002717101?text=Hello! I would like to inquire about admissions at Decent Public School."
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-green-600 hover:bg-green-700">
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
