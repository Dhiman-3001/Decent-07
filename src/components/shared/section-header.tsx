"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  badge?: string
  title: string
  description?: string
  centered?: boolean
  className?: string
  light?: boolean
}

export function SectionHeader({
  badge,
  title,
  description,
  centered = true,
  className,
  light = false,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "max-w-3xl",
        centered && "mx-auto text-center",
        className
      )}
    >
      {badge && (
        <span className={cn(
          "inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4",
          light ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
        )}>
          {badge}
        </span>
      )}
      <h2 className={cn(
        "font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4",
        light ? "text-white" : "text-blue-900"
      )}>
        {title}
      </h2>
      {description && (
        <p className={cn(
          "text-lg leading-relaxed",
          light ? "text-white/80" : "text-muted-foreground"
        )}>
          {description}
        </p>
      )}
    </motion.div>
  )
}
