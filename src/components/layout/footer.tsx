"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Twitter
} from "lucide-react"

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/academics", label: "Academics" },
  { href: "/admissions", label: "Admissions" },
  { href: "/gallery", label: "Gallery" },
  { href: "/events", label: "Events & News" },
  { href: "/contact", label: "Contact Us" },
]

const academicLinks = [
  { href: "/academics#primary", label: "Primary Section" },
  { href: "/academics#middle", label: "Middle School" },
  { href: "/academics#secondary", label: "Secondary School" },
  { href: "/academics#curriculum", label: "CBSE Curriculum" },
]

export function Footer() {
  return (
    <footer className="bg-[#050510] text-slate-300 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* School Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 col-span-2 lg:col-span-1"
          >
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-premium flex items-center justify-center shadow-lg shadow-primary/20">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-amber-400">
                  Decent Public School
                </h3>
                <p className="text-xs text-primary-foreground/60 font-medium tracking-wide">CBSE Curriculum</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Nurturing young minds with quality education, strong values, and holistic development since our establishment. A trusted name in CBSE education in Guwahati.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-primary border border-white/5 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/50"
                  aria-label="Social media link"
                >
                  <Icon className="w-5 h-5 text-white" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:pl-12 col-span-1"
          >
            <h4 className="font-serif text-lg font-semibold text-white mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-all duration-200 hover:pl-2 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Academics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="col-span-1"
          >
            <h4 className="font-serif text-lg font-semibold text-white mb-6">
              Academics
            </h4>
            <ul className="space-y-3">
              {academicLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-all duration-200 hover:pl-2 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="col-span-2 lg:col-span-1"
          >
            <h4 className="font-serif text-lg font-semibold text-white mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-400">
                  Bikrampur Path, Krishna Nagar,<br />
                  Japorigog, Guwahati,<br />
                  Assam - 781005
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-slate-400">+91 60027 17101</span>
              </li>
              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-slate-400">decentpublicschool2007@gmail.com</span>
              </li>
              <li className="flex gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="text-sm text-slate-400 space-y-1">
                  <p>Mon - Fri: 8:30 AM - 2:30 PM</p>
                  <p>Sat: 8:30 AM - 12:30 PM</p>
                  <p>Sun: Closed</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 relative z-10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex justify-center items-center">
            <p className="text-sm text-slate-500">
              © 2025 Decent Public School. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
