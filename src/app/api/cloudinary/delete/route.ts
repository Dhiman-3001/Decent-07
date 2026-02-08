import { NextRequest, NextResponse } from 'next/server';
import cloudinary, { extractPublicIdFromUrl } from '@/lib/cloudinary';
import fs from 'fs/promises';
import path from 'path';

// Gallery JSON path
const getGalleryPath = () => path.join(process.cwd(), 'src', 'data', 'gallery.json');

// Helper to verify admin authentication
async function verifyAuth(request: NextRequest): Promise<boolean> {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return false;
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    return username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD;
}

// DELETE - Remove media from Cloudinary and gallery.json
export async function DELETE(request: NextRequest) {
    try {
        // Verify authentication
        if (!await verifyAuth(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, cloudinary_url, type } = await request.json();

        if (!id || !cloudinary_url) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Delete from Cloudinary
        const publicId = extractPublicIdFromUrl(cloudinary_url);
        if (publicId) {
            try {
                await cloudinary.uploader.destroy(publicId, {
                    resource_type: type === 'video' ? 'video' : 'image'
                });
            } catch (err) {
                console.warn('Failed to delete from Cloudinary:', err);
            }
        }

        // Read and update gallery.json
        const galleryPath = getGalleryPath();
        let galleryData: Array<{ id: string;[key: string]: unknown }> = [];

        try {
            const content = await fs.readFile(galleryPath, 'utf-8');
            galleryData = JSON.parse(content);
        } catch {
            return NextResponse.json({ error: 'Gallery data not found' }, { status: 404 });
        }

        // Remove item
        const filteredData = galleryData.filter(item => item.id !== id);

        if (filteredData.length === galleryData.length) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        // Save updated gallery.json
        await fs.writeFile(galleryPath, JSON.stringify(filteredData, null, 4), 'utf-8');

        return NextResponse.json({
            success: true,
            message: 'Media deleted successfully'
        });

    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
    }
}
