"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Upload, X, Check } from "lucide-react"

interface ImageCropperProps {
    onCropConfig: (file: File) => void
    onCancel: () => void
    aspectRatio?: number // default 1 (square)
}

export function ImageCropper({ onCropConfig, onCancel, aspectRatio = 1 }: ImageCropperProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [zoom, setZoom] = useState(1)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imageRef = useRef<HTMLImageElement | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [originalFile, setOriginalFile] = useState<File | null>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            setOriginalFile(file)
            const reader = new FileReader()
            reader.addEventListener("load", () => {
                setImageSrc(reader.result?.toString() || null)
                setOffset({ x: 0, y: 0 })
                setZoom(1)
            })
            reader.readAsDataURL(file)
        }
    }

    // Draw image on canvas whenever zoom, offset, or imageSrc changes
    useEffect(() => {
        if (!imageSrc || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const image = new Image()
        image.src = imageSrc
        image.onload = () => {
            imageRef.current = image

            // Canvas dimensions fixed for preview
            canvas.width = 400
            canvas.height = 400 / aspectRatio

            // Clear
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = "#000000"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Calculate scaled dimensions
            const scale = Math.max(canvas.width / image.width, canvas.height / image.height) * zoom

            // Center + Offset
            const centerX = canvas.width / 2
            const centerY = canvas.height / 2

            // The image starts at (centerX - width/2) + offset
            const x = centerX - (image.width * scale) / 2 + offset.x
            const y = centerY - (image.height * scale) / 2 + offset.y

            ctx.drawImage(image, x, y, image.width * scale, image.height * scale)
        }
    }, [imageSrc, zoom, offset, aspectRatio])

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true)
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY
        setDragStart({ x: clientX - offset.x, y: clientY - offset.y })
    }

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging) return
        e.preventDefault()
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY
        setOffset({
            x: clientX - dragStart.x,
            y: clientY - dragStart.y
        })
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleCrop = async () => {
        if (!canvasRef.current) return

        canvasRef.current.toBlob((blob) => {
            if (blob && originalFile) {
                const file = new File([blob], originalFile.name, { type: "image/jpeg" })
                onCropConfig(file)
            }
        }, "image/jpeg", 0.9)
    }

    if (!imageSrc) {
        return (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                />
                <Button
                    variant="ghost"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col gap-4 h-auto py-8"
                >
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-slate-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium text-slate-200">Click to upload image</p>
                        <p className="text-sm text-slate-500">JPG, PNG up to 5MB</p>
                    </div>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="relative flex justify-center bg-black/40 rounded-xl overflow-hidden shadow-inner">
                <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto cursor-move touch-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleMouseMove}
                    onTouchEnd={handleMouseUp}
                />
            </div>

            <div className="space-y-4 px-4">
                <div className="flex justify-between text-sm text-slate-400">
                    <span>Zoom</span>
                    <span>{Math.round(zoom * 100)}%</span>
                </div>
                <Slider // Assumes you have a Slider component, otherwise use input range
                    defaultValue={[1]}
                    min={1}
                    max={3}
                    step={0.1}
                    value={[zoom]}
                    onValueChange={(vals) => setZoom(vals[0])}
                />
            </div>

            <div className="flex gap-3 justify-end pt-4">
                <Button variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button onClick={handleCrop} className="bg-blue-600 hover:bg-blue-500">
                    <Check className="w-4 h-4 mr-2" />
                    Apply Crop
                </Button>
            </div>
        </div>
    )
}
