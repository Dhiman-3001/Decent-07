"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/academics", label: "Academics" },
  { href: "/admissions", label: "Admissions" },
  { href: "/gallery", label: "Gallery" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "py-2" : "py-4 md:py-6"
      )}
    >
      <nav className={cn(
        "mx-auto transition-[max-width,background-color,border-color,box-shadow,padding] duration-500 ease-in-out",
        isOpen
          ? "max-w-full rounded-3xl bg-background/95 backdrop-blur-md border border-border/40 shadow-lg px-6"
          : scrolled
            ? "max-w-6xl rounded-full bg-background/80 backdrop-blur-md border border-border/40 shadow-lg px-6"
            : "max-w-full px-6 md:px-12 bg-transparent border-transparent shadow-none"
      )}>
        <div
          className="flex items-center justify-between h-14 md:h-16 lg:cursor-auto cursor-pointer"
          onClick={() => {
            if (window.innerWidth < 1024) {
              setIsOpen(!isOpen)
            }
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group relative z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Image
                src="/School-app/School_Logo_Final.png"
                alt="Decent Public School Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block leading-tight">
              <h1 className={cn(
                "font-serif text-lg font-bold transition-colors duration-300",
                "text-orange-500"
              )}>
                Decent Public School
              </h1>
              <p className={cn(
                "text-[10px] uppercase tracking-wider font-medium transition-colors duration-300",
                (scrolled || isOpen)
                  ? "text-muted-foreground"
                  : "text-muted-foreground dark:text-white/60"
              )}>
                Under CBSE Board
              </p>
            </div>
          </Link>

          {/* Mobile Center Title */}
          <div className="absolute left-1/2 -translate-x-1/2 sm:hidden text-center z-40 w-full px-12 pointer-events-none">
            <h1 className={cn(
              "font-serif text-lg font-bold transition-colors duration-300 whitespace-nowrap",
              "text-orange-500"
            )}>
              Decent Public School
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  pathname === link.href
                    ? scrolled
                      ? "text-primary font-semibold"
                      : "text-primary dark:text-white font-semibold"
                    : scrolled
                      ? "text-muted-foreground hover:text-foreground"
                      : "text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white"
                )}
              >
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className={cn(
                      "absolute inset-0 rounded-full -z-10",
                      scrolled ? "bg-primary/10" : "bg-primary/5 dark:bg-white/20"
                    )}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href="https://www.google.com/local/place/fid/0x375a58e32621c005:0x4926e18abc284a10/photosphere?iu=https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid%3DICsiJP7ujLSHGUZVZswzrA%26cb_client%3Dsearch.gws-prod.gps%26yaw%3D16.13418%26pitch%3D0%26thumbfov%3D100%26w%3D0%26h%3D0&ik=CAISFklDc2lKUDd1akxTSEdVWlZac3d6ckE%3D&sa=X&ved=2ahUKEwjM257noNORAxUnRmwGHVLSL8EQpx96BAgrEBI"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block ml-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Button variant="gradient" size="sm" className="rounded-full px-6 shadow-primary/25">
                Virtual tour
              </Button>
            </a>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full ml-1"
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(!isOpen)
              }}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 border-t border-border/50 mt-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block px-4 py-3 rounded-xl text-base font-medium transition-all",
                        pathname === link.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="pt-2 px-2"
                >
                  <a
                    href="https://www.google.com/local/place/fid/0x375a58e32621c005:0x4926e18abc284a10/photosphere?iu=https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid%3DICsiJP7ujLSHGUZVZswzrA%26cb_client%3Dsearch.gws-prod.gps%26yaw%3D16.13418%26pitch%3D0%26thumbfov%3D100%26w%3D0%26h%3D0&ik=CAISFklDc2lKUDd1akxTSEdVWlZac3d6ckE%3D&sa=X&ved=2ahUKEwjM257noNORAxUnRmwGHVLSL8EQpx96BAgrEBI"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button variant="gradient" className="w-full rounded-xl">
                      Virtual tour
                    </Button>
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
