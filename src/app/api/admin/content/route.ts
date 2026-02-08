import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs/promises'
import path from 'path'

// Helper to check admin auth
async function isAuthenticated() {
    const cookieStore = await cookies()
    return cookieStore.get('dps_admin_session')?.value === 'authenticated'
}

// Get content file path
function getContentPath(section: string, subsection: string) {
    return path.join(process.cwd(), 'src', 'data', `${section}-${subsection}.json`)
}

// GET - Fetch content
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    const subsection = searchParams.get('subsection')

    if (!section || !subsection) {
        return NextResponse.json({ error: 'Missing section or subsection' }, { status: 400 })
    }

    try {
        const filePath = getContentPath(section, subsection)
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

        // Ensure data directory exists
        const dataDir = path.join(process.cwd(), 'src', 'data')
        await fs.mkdir(dataDir, { recursive: true })

        // Write content
        const filePath = getContentPath(section, subsection)
        await fs.writeFile(filePath, JSON.stringify(data, null, 2))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Content update error:', error)
        return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
    }
}
