"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Lock, Eye, EyeOff, AlertCircle, ImageIcon, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminGalleryGrid } from "@/components/admin/admin-gallery-grid"
import { GalleryHero } from "@/components/gallery/gallery-hero"

export default function AdminGalleryPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [credentials, setCredentials] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Check for existing auth on mount
    useEffect(() => {
        const savedCreds = sessionStorage.getItem("admin_creds")
        if (savedCreds) {
            setCredentials(savedCreds)
            setIsAuthenticated(true)
        }
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        const creds = btoa(`${username}:${password}`)

        try {
            // Test credentials by making a request
            const response = await fetch("/api/admin/auth", {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${creds}`,
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                setCredentials(creds)
                sessionStorage.setItem("admin_creds", creds)
                setIsAuthenticated(true)
            } else {
                setError("Invalid username or password")
            }
        } catch {
            setError("Authentication failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = () => {
        setCredentials("")
        setIsAuthenticated(false)
        sessionStorage.removeItem("admin_creds")
        setUsername("")
        setPassword("")
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 shadow-2xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                                <ImageIcon className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Gallery Admin</h1>
                            <p className="text-slate-400">Sign in to manage gallery content</p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter admin username"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter admin password"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                                    <AlertCircle className="w-4 h-4" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2 cursor-pointer"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Lock className="w-4 h-4" />
                                )}
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Admin Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Settings className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-white">Gallery Admin</span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="cursor-pointer"
                    >
                        Logout
                    </Button>
                </div>
            </div>

            <GalleryHero />
            <AdminGalleryGrid credentials={credentials} />
        </main>
    )
}
