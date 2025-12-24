import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'src/data/gallery.json')

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

        // Add new item to beginning
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
        let data = JSON.parse(fileContents)

        const itemToDelete = data.find((item: any) => item.id === id)
        if (!itemToDelete) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        }

        // 1. Delete the item from JSON
        const updatedData = data.filter((item: any) => item.id !== id)

        // 2. Determine type and prefixes
        const isImage = itemToDelete.id.startsWith('img-')
        const isVideo = itemToDelete.id.startsWith('vid-')

        if (!isImage && !isVideo) {
            // Just save JSON if unknown type
            await fs.writeFile(dataPath, JSON.stringify(updatedData, null, 2))
            return NextResponse.json({ success: true, data: updatedData })
        }

        const prefix = isImage ? 'img-' : 'vid-'
        const dirPath = path.join(process.cwd(), isImage ? 'public/gallery/images' : 'public/gallery/videos')

        // 3. Delete the actual file
        try {
            // Extract filename from src (e.g., /gallery/images/img-1.jpeg -> img-1.jpeg)
            const fileName = itemToDelete.src.split('/').pop()
            if (fileName) {
                await fs.unlink(path.join(dirPath, fileName))
            }
        } catch (e) {
            console.error("Failed to delete file", e)
            // Continue to re-serialize even if file delete failed (maybe it didn't exist)
        }

        // 4. Re-serialize (Rename) subsequent files
        // Filter items of the same type
        const sameTypeItems = updatedData.filter((item: any) => item.id.startsWith(prefix))
        const otherItems = updatedData.filter((item: any) => !item.id.startsWith(prefix))

        // Sort by ID number
        sameTypeItems.sort((a: any, b: any) => {
            const numA = parseInt(a.id.replace(prefix, ''))
            const numB = parseInt(b.id.replace(prefix, ''))
            return numA - numB
        })

        const reSerializedItems = []

        for (let i = 0; i < sameTypeItems.length; i++) {
            const item = sameTypeItems[i]
            const currentNum = parseInt(item.id.replace(prefix, ''))
            const expectedNum = i + 1 // 1-based index

            if (currentNum !== expectedNum) {
                // Need to rename
                const oldFileName = item.src.split('/').pop()
                const ext = path.extname(oldFileName)
                const newId = `${prefix}${expectedNum}`
                const newFileName = `${newId}${ext}`

                const oldPath = path.join(dirPath, oldFileName)
                const newPath = path.join(dirPath, newFileName)

                try {
                    await fs.rename(oldPath, newPath)

                    // Update item
                    item.id = newId

                    // Update SRC - preserve path structure
                    const srcPath = isImage ? '/gallery/images/' : '/gallery/videos/'
                    item.src = `${srcPath}${newFileName}`

                } catch (e) {
                    console.error(`Failed to rename ${oldFileName} to ${newFileName}`, e)
                }
            }
            reSerializedItems.push(item)
        }

        // Combine back
        const finalData = [...otherItems, ...reSerializedItems]

        // Sort entire data by some logic? Usually newer first.
        // The original POST prepends new items. 
        // But here we might have lost the original mixed order if we separate content types.
        // Actually, the user's gallery usually shows all mixed.
        // To preserve original relative order of mixed content is hard if we re-serialize IDs.
        // But usually, IDs imply order. 
        // Let's just concatenation. The GalleryGrid sorts or displays as is. 
        // Ideally we should keep the original order of `updatedData` but with updated IDs.
        // But since we modified objects in `sameTypeItems` (references), `updatedData` might be updated?
        // No, `sameTypeItems` is a filtered new array but elements are references.
        // Yes, objects are references. So `item.id = newId` updates the object inside `updatedData`.

        // Wait, `updatedData` still has the gaps in valid objects.
        // So checking `currentNum !== expectedNum` logic relies on the sorted order.
        // So we MUST use the sorted `reSerializedItems` for that type.

        // Let's Re-Sort everything cleanly to be safe or just save the modified objects.
        // Since we mutated the objects in `sameTypeItems`, which are references to objects in `updatedData`?
        // `filter` creates a shallow copy of the array, but elements are shared.
        // So modifying `item.id` inside `sameTypeItems` loop ALSO modifies it in `updatedData`.

        // So `updatedData` now contains the re-serialized items with new IDs/Srcs.
        // But `updatedData` order is unchanged (minus deleted item).
        // This is perfect.

        await fs.writeFile(dataPath, JSON.stringify(updatedData, null, 2))
        return NextResponse.json({ success: true, data: updatedData })

    } catch (error) {
        console.error("Delete error", error)
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
    }
}
