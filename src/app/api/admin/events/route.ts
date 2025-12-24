import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'src/data/events.json')

export async function GET() {
    try {
        const fileContents = await fs.readFile(dataPath, 'utf8')
        const data = JSON.parse(fileContents)
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const newItem = await request.json()
        const fileContents = await fs.readFile(dataPath, 'utf8')
        const data = JSON.parse(fileContents)

        // Add new item to beginning or sort? Usually events are by date or featured.
        // Let's just prepend.
        const updatedData = [newItem, ...data]

        await fs.writeFile(dataPath, JSON.stringify(updatedData, null, 2))
        return NextResponse.json({ success: true, data: updatedData })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update data' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        const fileContents = await fs.readFile(dataPath, 'utf8')
        const data = JSON.parse(fileContents)

        // Ensure ID types match (string vs number)
        const updatedData = data.filter((item: any) => String(item.id) !== String(id))

        await fs.writeFile(dataPath, JSON.stringify(updatedData, null, 2))
        return NextResponse.json({ success: true, data: updatedData })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
    }
}
