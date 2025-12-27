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
  Youtube
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
  { href: "/academics#curriculum", label: "CBSE Based Curriculum" },
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
                <p className="text-xs text-primary-foreground/60 font-medium tracking-wide">CBSE Based Curriculum</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Nurturing young minds with quality education, strong values, and holistic development since our establishment. A trusted name in education in Guwahati.
            </p>
            <div className="flex gap-3">
              {[
                {
                  Icon: Facebook,
                  href: "https://www.facebook.com/profile.php?id=61585434036869",
                },
                {
                  Icon: Instagram,
                  href: "https://www.instagram.com/dps_ghy_2007/",
                },
                {
                  Icon: Youtube,
                  href: "https://www.youtube.com/@decentpublicschoolguwahati2915",
                },
                {
                  Icon: (props: any) => (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      {...props}
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  ),
                  href: "https://api.whatsapp.com/send/?phone=916002717101&text=Hello%21+I+would+like+to+inquire+about+admissions+at+Decent+Public+School.&type=phone_number&app_absent=0",
                },
              ].map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
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
