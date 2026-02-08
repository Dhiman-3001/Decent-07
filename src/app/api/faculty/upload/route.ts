import { NextRequest, NextResponse } from 'next/server';
import cloudinary, { CLOUDINARY_FOLDERS, FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES, extractPublicIdFromUrl } from '@/lib/cloudinary';
import fs from 'fs/promises';
import path from 'path';

// Faculty JSON path
const getFacultyPath = () => path.join(process.cwd(), 'src', 'data', 'faculty.json');

interface FacultyMember {
    id: string;
    name: string;
    role: string;
    quote: string;
    cloudinary_url: string;
}

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

// POST - Upload/Update faculty member
export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        if (!await verifyAuth(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const name = formData.get('name') as string;
        const role = formData.get('role') as string;
        const quote = formData.get('quote') as string;
        const existingId = formData.get('existingId') as string | null;
        const existingUrl = formData.get('existingUrl') as string | null;

        if (!name || !role || !quote) {
            return NextResponse.json({ error: 'Name, role, and quote are required' }, { status: 400 });
        }

        // For new faculty, file is required
        if (!existingId && !file) {
            return NextResponse.json({ error: 'Image is required for new faculty' }, { status: 400 });
        }

        let cloudinaryUrl = existingUrl || '';

        // If a new file is provided, upload it
        if (file) {
            // Validate file type
            if (!ALLOWED_FILE_TYPES.IMAGE.includes(file.type)) {
                return NextResponse.json({ error: `Invalid file type. Allowed: ${ALLOWED_FILE_TYPES.IMAGE.join(', ')}` }, { status: 400 });
            }

            // Validate file size
            if (file.size > FILE_SIZE_LIMITS.IMAGE) {
                const limitMB = FILE_SIZE_LIMITS.IMAGE / (1024 * 1024);
                return NextResponse.json({ error: `File too large. Maximum size: ${limitMB}MB` }, { status: 400 });
            }

            // Delete old asset if updating with new image
            if (existingUrl && existingUrl.includes('cloudinary')) {
                const publicId = extractPublicIdFromUrl(existingUrl);
                if (publicId) {
                    try {
                        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
                    } catch (err) {
                        console.warn('Failed to delete old faculty image:', err);
                    }
                }
            }

            // Upload to Cloudinary
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: CLOUDINARY_FOLDERS.FACULTIES,
                        resource_type: 'image',
                        public_id: `faculty_${Date.now()}`,
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

            cloudinaryUrl = uploadResult.secure_url;
        }

        // Read current faculty.json
        const facultyPath = getFacultyPath();
        let facultyData: FacultyMember[] = [];
        try {
            const content = await fs.readFile(facultyPath, 'utf-8');
            facultyData = JSON.parse(content);
        } catch {
            facultyData = [];
        }

        // Create new faculty item or update existing
        const newItem: FacultyMember = {
            id: existingId || `faculty-${Date.now()}`,
            name: name,
            role: role,
            quote: quote,
            cloudinary_url: cloudinaryUrl,
        };

        if (existingId) {
            // Update existing item
            const index = facultyData.findIndex(item => item.id === existingId);
            if (index !== -1) {
                facultyData[index] = newItem;
            } else {
                facultyData.push(newItem);
            }
        } else {
            // Add new item at the end
            facultyData.push(newItem);
        }

        // Save faculty.json
        await fs.writeFile(facultyPath, JSON.stringify(facultyData, null, 4), 'utf-8');

        return NextResponse.json({
            success: true,
            item: newItem,
            message: existingId ? 'Faculty updated successfully' : 'Faculty added successfully'
        });

    } catch (error) {
        console.error('Faculty upload error:', error);
        return NextResponse.json({ error: 'Failed to save faculty' }, { status: 500 });
    }
}
