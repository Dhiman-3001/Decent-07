"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })

            if (response.ok) {
                // Success: Authenticated
                // Store credentials for API calls that require Basic Auth
                const creds = btoa(`${username}:${password}`)
                sessionStorage.setItem("admin_creds", creds)

                window.dispatchEvent(new Event('auth-change'))
                router.push('/admin')
                router.refresh()
            } else {
                // Failed: Show error
                const data = await response.json()
                setError(data.error || "Login failed")
                setIsLoading(false)
            }
        } catch (error) {
            console.error("Login error", error)
            setError("Something went wrong. Please try again.")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans pt-20">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(var(--primary)/0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,oklch(var(--secondary)/0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-[450px] p-8 md:p-12 relative z-10"
            >
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col items-center text-center">
                    {/* Logo */}
                    <motion.div
                        className="mb-8 relative"
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                            <Image
                                src="/School-app/School_Logo_Final.png"
                                alt="Decent Public School"
                                width={48}
                                height={48}
                                className="object-contain"
                            />
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="space-y-2 mb-8"
                    >
                        <h1 className="text-2xl font-medium text-white tracking-tight">Sign in</h1>
                        <p className="text-slate-400 text-sm">Use your Decent Public School Account</p>
                    </motion.div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="w-full space-y-5">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="space-y-4"
                        >
                            <div className="group relative">
                                <Input
                                    type="text"
                                    name="username_field_no_autofill"
                                    autoComplete="off"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 h-14 rounded-xl px-4 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all"
                                    required
                                />
                            </div>

                            <div className="group relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="password_field_no_autofill"
                                    autoComplete="new-password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 h-14 rounded-xl px-4 pr-12 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </motion.div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="pt-4 flex items-center justify-between w-full"
                        >
                            <button type="button" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                                Forgot password?
                            </button>

                            <Button
                                type="submit"
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 h-10 font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] cursor-pointer"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}
