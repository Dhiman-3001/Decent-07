"use client"

import { motion } from "framer-motion"
import { Phone, MessageCircle, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"


export function AdmissionCTA() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="relative z-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Apply?
              </h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Take the first step towards your child&apos;s bright future. Contact us today or visit our campus for more information.
              </p>

              <div className="grid sm:grid-cols-3 gap-4">
                <a
                  href="tel:+916002717101"
                  className="flex items-center justify-center gap-3 text-white bg-white/10 hover:bg-white/20 transition-all rounded-xl py-4 backdrop-blur-sm"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Us</span>
                </a>
                <a
                  href="https://wa.me/916002717101"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 text-white bg-white/10 hover:bg-white/20 transition-all rounded-xl py-4 backdrop-blur-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp Us</span>
                </a>
                <a
                  href="https://www.google.com/maps/place/Decent+Public+School,+CBSE/@26.1582469,91.7931213,18.84z/data=!4m15!1m8!3m7!1s0x375a58e32621c005:0x4926e18abc284a10!2sDecent+Public+School,+CBSE!8m2!3d26.1582!4d91.7933514!10e1!16s%2Fg%2F1pyqfqh_j!3m5!1s0x375a58e32621c005:0x4926e18abc284a10!8m2!3d26.1582!4d91.7933514!16s%2Fg%2F1pyqfqh_j?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 text-white bg-white/10 hover:bg-white/20 transition-all rounded-xl py-4 backdrop-blur-sm"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Visit Campus</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
