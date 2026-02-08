import { NextRequest, NextResponse } from 'next/server';
import cloudinary, { CLOUDINARY_FOLDERS, FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES, extractPublicIdFromUrl } from '@/lib/cloudinary';
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

// POST - Upload new media to Cloudinary
export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        if (!await verifyAuth(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const type = formData.get('type') as 'image' | 'video';
        const title = formData.get('title') as string;
        const title2 = formData.get('title2') as string | null;
        const description = formData.get('description') as string | null;
        const youtube = formData.get('youtube') as string | null;
        const facebook = formData.get('facebook') as string | null;
        const instagram = formData.get('instagram') as string | null;
        const existingUrl = formData.get('existingUrl') as string | null;
        const existingId = formData.get('existingId') as string | null;

        if (!file || !type || !title) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = type === 'image' ? ALLOWED_FILE_TYPES.IMAGE : ALLOWED_FILE_TYPES.VIDEO;
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` }, { status: 400 });
        }

        // Validate file size
        const sizeLimit = type === 'image' ? FILE_SIZE_LIMITS.IMAGE : FILE_SIZE_LIMITS.VIDEO;
        if (file.size > sizeLimit) {
            const limitMB = sizeLimit / (1024 * 1024);
            return NextResponse.json({ error: `File too large. Maximum size: ${limitMB}MB` }, { status: 400 });
        }

        // Delete old asset if updating
        if (existingUrl) {
            const publicId = extractPublicIdFromUrl(existingUrl);
            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId, {
                        resource_type: type === 'video' ? 'video' : 'image'
                    });
                } catch (err) {
                    console.warn('Failed to delete old asset:', err);
                }
            }
        }

        // Upload to Cloudinary
        const folder = type === 'image' ? CLOUDINARY_FOLDERS.GALLERY_IMAGES : CLOUDINARY_FOLDERS.GALLERY_VIDEOS;
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise<{
            secure_url: string;
            public_id: string;
        }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: type === 'video' ? 'video' : 'image',
                    public_id: `${folder}_${Date.now()}`,
                    overwrite: true,
                },
                (error, result) => {
                    if (result) {
                        resolve({ secure_url: result.secure_url, public_id: result.public_id });
                    } else {
                        reject(error);
                    }
                }
            );
            uploadStream.end(buffer);
        });

        // Read current gallery.json
        const galleryPath = getGalleryPath();
        let galleryData: GalleryItem[] = [];
        try {
            const content = await fs.readFile(galleryPath, 'utf-8');
            galleryData = JSON.parse(content);
        } catch {
            galleryData = [];
        }

        // Create new gallery item or update existing
        const newItem: GalleryItem = {
            id: existingId || `${type === 'image' ? 'img' : 'vid'}-${Date.now()}`,
            type: type,
            cloudinary_url: uploadResult.secure_url,
            title: title,
            category: type === 'image' ? 'Images' : 'Videos',
        };

        if (type === 'video') {
            newItem.title2 = title2 || '';
            newItem.description = description || '';
            newItem.links = {
                youtube: youtube || '',
                facebook: facebook || '',
                instagram: instagram || '',
            };
        }

        if (existingId) {
            // Update existing item
            const index = galleryData.findIndex(item => item.id === existingId);
            if (index !== -1) {
                galleryData[index] = { ...galleryData[index], ...newItem };
            } else {
                galleryData.push(newItem);
            }
        } else {
            // Add new item at the beginning
            galleryData.unshift(newItem);
        }

        // Save gallery.json
        await fs.writeFile(galleryPath, JSON.stringify(galleryData, null, 4), 'utf-8');

        return NextResponse.json({
            success: true,
            item: newItem,
            message: existingId ? 'Media updated successfully' : 'Media uploaded successfully'
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
    }
}

// Type definition
interface GalleryItem {
    id: string;
    type: 'image' | 'video';
    cloudinary_url: string;
    title: string;
    title2?: string;
    category: 'Images' | 'Videos';
    description?: string;
    links?: {
        youtube?: string;
        facebook?: string;
        instagram?: string;
    };
}
