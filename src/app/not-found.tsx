"use client"

import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-serif text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
          404
        </h1>
        <h2 className="font-serif text-2xl font-semibold text-blue-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Sorry, the page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/">
            <Button variant="gradient">
              <Home className="w-5 h-5" />
              Go Home
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
