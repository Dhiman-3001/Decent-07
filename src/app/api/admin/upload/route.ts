import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())

        // Determine the next serial number
        const galleryDir = path.join(process.cwd(), 'public/gallery/images')

        // Ensure directory exists
        try {
            await fs.access(galleryDir)
        } catch {
            await fs.mkdir(galleryDir, { recursive: true })
        }

        const files = await fs.readdir(galleryDir)

        // Filter for img-X.ext format
        const imgFiles = files.filter(f => /^img-\d+\.(jpg|jpeg|png)$/i.test(f))

        let maxNum = 0
        imgFiles.forEach(f => {
            const match = f.match(/^img-(\d+)\./i)
            if (match) {
                const num = parseInt(match[1])
                if (num > maxNum) maxNum = num
            }
        })

        const nextNum = maxNum + 1
        // Get extension from original file or default to .jpeg if blob
        const ext = path.extname(file.name) || '.jpeg'
        const fileName = `img-${nextNum}${ext}`
        const filePath = path.join(galleryDir, fileName)

        await fs.writeFile(filePath, buffer)

        return NextResponse.json({
            success: true,
            path: `/gallery/images/${fileName}`,
            id: `img-${nextNum}`
        })
    } catch (error) {
        console.error('Upload failed:', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}
