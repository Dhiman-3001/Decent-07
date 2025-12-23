"use client"

import { motion } from "framer-motion"
import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MapSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 h-full min-h-[400px]"
          >
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.8876!2d91.7898!3d26.1445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a58e32621c005:0x4926e18abc284a10!2sDecent%20Public%20School!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Decent Public School Location"
                className="w-full h-full"
              />
            </div>
          </motion.div>

          {/* Location Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 h-full flex flex-col"
          >
            <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
              <MapPin className="w-7 h-7 text-blue-600" />
            </div>

            <h3 className="font-serif text-2xl font-semibold text-blue-900 mb-4">
              Our Location
            </h3>

            <div className="space-y-4 text-muted-foreground mb-8">
              <p className="font-medium text-orange-500">Decent Public School</p>
              <p>Bikrampur Path, Krishna Nagar</p>
              <p>Japorigog, Guwahati</p>
              <p>Assam - 781005</p>
              <p>India</p>
            </div>

            <div className="space-y-3">
              <a
                href="https://www.google.com/maps/dir/Decent+Public+School,+CBSE/Guwahati,+Assam,+5Q6H%2BHFQ,+Sree+Nagar,+Guwahati,+Assam+781005/@26.1580453,91.7929874,18.67z/data=!4m13!4m12!1m5!1m1!1s0x375a58e32621c005:0x4926e18abc284a10!2m2!1d91.7933514!2d26.1582!1m5!1m1!1s0x375a59d3c3f437a1:0x616a2cc8f24f7020!2m2!1d91.7787436!2d26.1614645?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="gradient" className="w-full">
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </Button>
              </a>
              <p className="text-xs text-center text-muted-foreground">
                Opens in Google Maps
              </p>
            </div>

            <div className="mt-8 pt-6 border-t">
              <h4 className="font-medium text-foreground mb-3">Landmarks</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Near Krishna Nagar Main Road</li>
                <li>• 5 mins from Japorigog Chariali</li>
                <li>• Opposite to Community Hall</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
