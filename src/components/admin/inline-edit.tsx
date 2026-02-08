"use client"

import { useState, useEffect, useRef, ReactNode } from "react"
import { Edit2, Check, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Hook to check admin status
export function useAdminStatus() {
    const [isAdmin, setIsAdmin] = useState(false)
    const [credentials, setCredentials] = useState<string | null>(null)

    useEffect(() => {
        const checkAuth = () => {
            fetch('/api/auth/me', { cache: 'no-store' })
                .then(res => res.json())
                .then(data => {
                    setIsAdmin(data.isAdmin)
                    // Get credentials from sessionStorage if admin
                    if (data.isAdmin) {
                        const savedCreds = sessionStorage.getItem("admin_creds")
                        setCredentials(savedCreds)
                    } else {
                        setCredentials(null)
                    }
                })
                .catch(() => {
                    setIsAdmin(false)
                    setCredentials(null)
                })
        }

        checkAuth()

        const handleAuthChange = () => checkAuth()
        window.addEventListener('auth-change', handleAuthChange)

        return () => window.removeEventListener('auth-change', handleAuthChange)
    }, [])

    return { isAdmin, credentials }
}

// Editable Text Component
interface EditableTextProps {
    value: string
    onSave: (value: string) => Promise<void> | void
    children: ReactNode
    multiline?: boolean
    inputClassName?: string
}

export function EditableText({ value, onSave, children, multiline = false, inputClassName }: EditableTextProps) {
    const { isAdmin } = useAdminStatus()
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(value)
    const [isSaving, setIsSaving] = useState(false)
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [isEditing])

    useEffect(() => {
        setEditValue(value)
    }, [value])

    if (!isAdmin) {
        return <>{children}</>
    }

    const handleSave = async () => {
        if (editValue === value) {
            setIsEditing(false)
            return
        }

        setIsSaving(true)
        try {
            await onSave(editValue)
            setIsEditing(false)
        } catch (error) {
            console.error("Failed to save:", error)
            setEditValue(value)
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setEditValue(value)
        setIsEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) {
            e.preventDefault()
            handleSave()
        }
        if (e.key === 'Escape') {
            handleCancel()
        }
    }

    if (isEditing) {
        return (
            <div className="relative inline-flex items-center gap-2 w-full">
                {multiline ? (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={cn(
                            "w-full px-3 py-2 rounded-lg border border-blue-500 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y",
                            inputClassName
                        )}
                    />
                ) : (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={cn(
                            "w-full px-3 py-2 rounded-lg border border-blue-500 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500",
                            inputClassName
                        )}
                    />
                )}
                <div className="flex gap-1">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={handleCancel}
                        className="p-2 rounded-lg bg-slate-600 text-white hover:bg-slate-700"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="group relative inline-block cursor-pointer" onClick={() => setIsEditing(true)}>
            {children}
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="p-1.5 rounded-full bg-blue-600 text-white shadow-lg">
                    <Edit2 className="w-3 h-3" />
                </div>
            </div>
        </div>
    )
}

// Note: EditableImage and ImageCropper removed - use Cloudinary for image management
