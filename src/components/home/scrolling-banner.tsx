"use client"

import { motion } from "framer-motion"

export function ScrollingBanner() {
    return (
        <div className="absolute top-[85px] md:top-[90px] w-full bg-yellow-300 border-y border-orange-500/50 py-1 overflow-hidden flex z-40 shadow-md">
            <div className="flex animate-marquee whitespace-nowrap">
                <span className="text-[10px] md:text-xs font-bold text-sky-900 mx-6 tracking-wide uppercase">
                    Excellence in glorious service to education over 18 long years • Admissions open for the batch 2026-27 • Limited seats available, apply soon
                </span>
                <span className="text-[10px] md:text-xs font-bold text-sky-900 mx-6 tracking-wide uppercase">
                    Excellence in glorious service to education over 18 long years • Admissions open for the batch 2026-27 • Limited seats available, apply soon
                </span>
                <span className="text-[10px] md:text-xs font-bold text-sky-900 mx-6 tracking-wide uppercase">
                    Excellence in glorious service to education over 18 long years • Admissions open for the batch 2026-27 • Limited seats available, apply soon
                </span>
                <span className="text-[10px] md:text-xs font-bold text-sky-900 mx-6 tracking-wide uppercase">
                    Excellence in glorious service to education over 18 long years • Admissions open for the batch 2026-27 • Limited seats available, apply soon
                </span>
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
