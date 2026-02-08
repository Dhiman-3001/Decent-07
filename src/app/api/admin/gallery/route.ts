import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// Get gallery data path
const getGalleryPath = () => path.join(process.cwd(), 'src', 'data', 'gallery.json')

// GET - Fetch gallery items (public)
export async function GET() {
    try {
        const filePath = getGalleryPath()
        const content = await fs.readFile(filePath, 'utf-8')
        return NextResponse.json(JSON.parse(content))
    } catch {
        // Return empty array if file doesn't exist
        return NextResponse.json([])
    }
}

// Note: POST and DELETE endpoints removed - use Cloudinary for media management
