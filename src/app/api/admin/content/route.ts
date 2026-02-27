import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs/promises'
import path from 'path'

// Helper to check admin auth
async function isAuthenticated() {
    const cookieStore = await cookies()
    return cookieStore.get('dps_admin_session')?.value === 'authenticated'
}

// Strict whitelist of allowed section-subsection combinations
const ALLOWED_CONTENT_KEYS = new Set([
    'home-hero',
    'home-cta',
    'about-hero',
    'about-principal',
    'about-mission',
    'admissions-hero',
    'admissions-criteria',
    'academics-hero',
    'contact-hero',
    'events-hero',
    'gallery-hero',
    'infrastructure-hero',
])

// Sanitize and validate content key
function sanitizeKey(value: string): string | null {
    // Only allow alphanumeric characters, hyphens, and underscores
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
        return null
    }
    return value.toLowerCase()
}

// Get content file path with validation
function getContentPath(section: string, subsection: string): string | null {
    const sanitizedSection = sanitizeKey(section)
    const sanitizedSubsection = sanitizeKey(subsection)

    if (!sanitizedSection || !sanitizedSubsection) {
        return null
    }

    const key = `${sanitizedSection}-${sanitizedSubsection}`

    // Check against whitelist for write operations
    const filePath = path.join(process.cwd(), 'src', 'data', `${key}.json`)

    // Ensure resolved path doesn't escape data directory (defense in depth)
    const dataDir = path.join(process.cwd(), 'src', 'data')
    const resolved = path.resolve(filePath)
    if (!resolved.startsWith(dataDir)) {
        return null
    }

    return filePath
}

// GET - Fetch content
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    const subsection = searchParams.get('subsection')

    if (!section || !subsection) {
        return NextResponse.json({ error: 'Missing section or subsection' }, { status: 400 })
    }

    const filePath = getContentPath(section, subsection)
    if (!filePath) {
        return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    try {
        const content = await fs.readFile(filePath, 'utf-8')
        return NextResponse.json(JSON.parse(content))
    } catch {
        // Return null if file doesn't exist (will use defaults)
        return NextResponse.json(null)
    }
}

// PUT - Update content (admin only)
export async function PUT(request: Request) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { section, subsection, data } = await request.json()

        if (!section || !subsection || !data) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const filePath = getContentPath(section, subsection)
        if (!filePath) {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
        }

        // Validate that the content key is in our whitelist for writes
        const key = `${sanitizeKey(section)}-${sanitizeKey(subsection)}`
        if (!ALLOWED_CONTENT_KEYS.has(key)) {
            return NextResponse.json({ error: 'Content section not allowed' }, { status: 403 })
        }

        // Ensure data directory exists
        const dataDir = path.join(process.cwd(), 'src', 'data')
        await fs.mkdir(dataDir, { recursive: true })

        // Validate data is a plain object and limit size
        const jsonStr = JSON.stringify(data, null, 2)
        if (jsonStr.length > 50000) {
            return NextResponse.json({ error: 'Content too large' }, { status: 413 })
        }

        // Write content
        await fs.writeFile(filePath, jsonStr)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Content update error:', error)
        return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
    }
}
