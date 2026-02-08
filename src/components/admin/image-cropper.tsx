"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ZoomIn, ZoomOut, RotateCcw, Check, Move } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageCropperProps {
    imageSrc: string
    onCropComplete: (croppedBlob: Blob) => void
    onCancel: () => void
    aspectRatio?: number // width/height ratio, default is 1 (square)
    borderRadius?: number // in pixels, for curved edges
}

interface CropArea {
    x: number
    y: number
    width: number
    height: number
}

export function ImageCropper({
    imageSrc,
    onCropComplete,
    onCancel,
    aspectRatio = 1,
    borderRadius = 24,
}: ImageCropperProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)

    const [scale, setScale] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [imageLoaded, setImageLoaded] = useState(false)
    const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 300, height: 300 })
    const [isProcessing, setIsProcessing] = useState(false)

    // Calculate crop area based on container size
    useEffect(() => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.clientWidth
            const containerHeight = containerRef.current.clientHeight
            const maxCropWidth = Math.min(containerWidth * 0.8, 400)
            const cropWidth = maxCropWidth
            const cropHeight = cropWidth / aspectRatio

            setCropArea({
                x: (containerWidth - cropWidth) / 2,
                y: (containerHeight - cropHeight) / 2,
                width: cropWidth,
                height: cropHeight,
            })
        }
    }, [aspectRatio])

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        setIsDragging(true)
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }, [position])

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        })
    }, [isDragging, dragStart])

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        setScale(prev => Math.max(0.5, Math.min(3, prev + delta)))
    }, [])

    const handleZoomIn = () => setScale(prev => Math.min(3, prev + 0.2))
    const handleZoomOut = () => setScale(prev => Math.max(0.5, prev - 0.2))
    const handleReset = () => {
        setScale(1)
        setPosition({ x: 0, y: 0 })
    }

    const generateCrop = async () => {
        if (!imageRef.current || !containerRef.current) return

        setIsProcessing(true)

        const image = imageRef.current
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            setIsProcessing(false)
            return
        }

        // Set canvas size to crop area size
        canvas.width = cropArea.width
        canvas.height = cropArea.height

        // Calculate the actual crop coordinates
        const imageRect = image.getBoundingClientRect()
        const containerRect = containerRef.current.getBoundingClientRect()

        // Image position relative to container
        const imageX = (containerRect.width - imageRect.width) / 2 + position.x
        const imageY = (containerRect.height - imageRect.height) / 2 + position.y

        // Crop area position in image coordinates
        const sourceX = (cropArea.x - imageX) / scale
        const sourceY = (cropArea.y - imageY) / scale
        const sourceWidth = cropArea.width / scale
        const sourceHeight = cropArea.height / scale

        // Calculate natural image ratios
        const naturalWidth = image.naturalWidth
        const naturalHeight = image.naturalHeight
        const displayWidth = imageRect.width / scale
        const displayHeight = imageRect.height / scale

        const ratioX = naturalWidth / displayWidth
        const ratioY = naturalHeight / displayHeight

        // Draw white background (for transparency)
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw the cropped portion
        ctx.drawImage(
            image,
            sourceX * ratioX,
            sourceY * ratioY,
            sourceWidth * ratioX,
            sourceHeight * ratioY,
            0,
            0,
            cropArea.width,
            cropArea.height
        )

        // Convert to blob
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    onCropComplete(blob)
                }
                setIsProcessing(false)
            },
            'image/jpeg',
            0.95
        )
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onCancel}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-slate-700 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <Move className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Crop Image</h3>
                                <p className="text-sm text-slate-400">Drag to position, scroll to zoom</p>
                            </div>
                        </div>
                        <button
                            onClick={onCancel}
                            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Crop Area */}
                    <div
                        ref={containerRef}
                        className="relative h-[400px] bg-slate-950 overflow-hidden cursor-move"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onWheel={handleWheel}
                    >
                        {/* Image */}
                        <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{
                                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                            }}
                        >
                            <img
                                ref={imageRef}
                                src={imageSrc}
                                alt="Crop preview"
                                className="max-w-full max-h-full object-contain select-none"
                                draggable={false}
                                onLoad={() => setImageLoaded(true)}
                            />
                        </div>

                        {/* Overlay mask */}
                        <div className="absolute inset-0 pointer-events-none">
                            {/* Dark overlay with transparent crop window */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: `
                                        linear-gradient(to right, rgba(0,0,0,0.7) ${cropArea.x}px, transparent ${cropArea.x}px, transparent ${cropArea.x + cropArea.width}px, rgba(0,0,0,0.7) ${cropArea.x + cropArea.width}px),
                                        linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.7) ${cropArea.y}px, transparent ${cropArea.y}px, transparent ${cropArea.y + cropArea.height}px, rgba(0,0,0,0.7) ${cropArea.y + cropArea.height}px, rgba(0,0,0,0.7) 100%)
                                    `
                                }}
                            />

                            {/* Crop border with curved edges */}
                            <div
                                className="absolute border-2 border-white/80 shadow-lg"
                                style={{
                                    left: cropArea.x,
                                    top: cropArea.y,
                                    width: cropArea.width,
                                    height: cropArea.height,
                                    borderRadius: `${borderRadius}px`,
                                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)',
                                }}
                            />

                            {/* Corner indicators */}
                            <div
                                className="absolute w-4 h-4 border-l-2 border-t-2 border-white"
                                style={{
                                    left: cropArea.x - 2,
                                    top: cropArea.y - 2,
                                    borderRadius: `${borderRadius / 4}px 0 0 0`,
                                }}
                            />
                            <div
                                className="absolute w-4 h-4 border-r-2 border-t-2 border-white"
                                style={{
                                    left: cropArea.x + cropArea.width - 14,
                                    top: cropArea.y - 2,
                                    borderRadius: `0 ${borderRadius / 4}px 0 0`,
                                }}
                            />
                            <div
                                className="absolute w-4 h-4 border-l-2 border-b-2 border-white"
                                style={{
                                    left: cropArea.x - 2,
                                    top: cropArea.y + cropArea.height - 14,
                                    borderRadius: `0 0 0 ${borderRadius / 4}px`,
                                }}
                            />
                            <div
                                className="absolute w-4 h-4 border-r-2 border-b-2 border-white"
                                style={{
                                    left: cropArea.x + cropArea.width - 14,
                                    top: cropArea.y + cropArea.height - 14,
                                    borderRadius: `0 0 ${borderRadius / 4}px 0`,
                                }}
                            />
                        </div>

                        {/* Loading indicator */}
                        {!imageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="p-4 border-t border-slate-700 flex items-center justify-between gap-4">
                        {/* Zoom controls + Reset */}
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleZoomOut}
                                className="h-10 w-10 p-0 cursor-pointer"
                                title="Zoom Out"
                            >
                                <ZoomOut className="w-4 h-4" />
                            </Button>
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg h-10">
                                <span className="text-sm text-slate-400">Zoom:</span>
                                <span className="text-sm font-medium text-white">{Math.round(scale * 100)}%</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleZoomIn}
                                className="h-10 w-10 p-0 cursor-pointer"
                                title="Zoom In"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleReset}
                                className="gap-2 h-10 cursor-pointer px-4"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset
                            </Button>
                        </div>

                        {/* Apply Crop */}
                        <Button
                            onClick={generateCrop}
                            disabled={isProcessing || !imageLoaded}
                            className="gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer h-10 px-6 rounded-xl"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" />
                                    Apply Crop
                                </>
                            )}
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
