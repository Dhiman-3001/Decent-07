"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export function ScrollingBanner() {
    return (
        <div className="absolute top-[85px] md:top-[75px] w-full bg-yellow-300 border-y border-orange-500/50 py-1 overflow-hidden flex z-40 shadow-md">
            <div className="flex animate-marquee whitespace-nowrap items-center">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center mx-6">
                        <span className="text-[10px] md:text-xs font-bold text-[#FF4500] tracking-wide uppercase">
                            Excellence in glorious service to education over 18 long years • Admissions open for the batch 2026-27 • Limited seats available
                        </span>
                        <Link href="/admissions" className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-600 text-white text-[10px] font-bold shadow-lg shadow-orange-500/50 hover:scale-105 transition-transform">
                            <Sparkles className="w-3 h-3 text-yellow-200 animate-pulse" />
                            APPLY
                        </Link>
                    </div>
                ))}
            </div>
            <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 80s linear infinite;
        }
      `}</style>
        </div>
    )
}
