import { NextRequest, NextResponse } from 'next/server';
import cloudinary, { extractPublicIdFromUrl } from '@/lib/cloudinary';
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

// DELETE - Remove faculty member and their Cloudinary image
export async function DELETE(request: NextRequest) {
    try {
        // Verify authentication
        if (!await verifyAuth(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, cloudinary_url } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Faculty ID is required' }, { status: 400 });
        }

        // Delete from Cloudinary if URL exists and is a Cloudinary URL
        if (cloudinary_url && cloudinary_url.includes('cloudinary')) {
            const publicId = extractPublicIdFromUrl(cloudinary_url);
            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
                    console.log('Deleted from Cloudinary:', publicId);
                } catch (err) {
                    console.warn('Failed to delete from Cloudinary:', err);
                    // Continue with local deletion even if Cloudinary fails
                }
            }
        }

        // Read current faculty.json
        const facultyPath = getFacultyPath();
        let facultyData: FacultyMember[] = [];
        try {
            const content = await fs.readFile(facultyPath, 'utf-8');
            facultyData = JSON.parse(content);
        } catch {
            return NextResponse.json({ error: 'Faculty data not found' }, { status: 404 });
        }

        // Remove the faculty member
        const initialLength = facultyData.length;
        facultyData = facultyData.filter(item => item.id !== id);

        if (facultyData.length === initialLength) {
            return NextResponse.json({ error: 'Faculty member not found' }, { status: 404 });
        }

        // Save updated faculty.json
        await fs.writeFile(facultyPath, JSON.stringify(facultyData, null, 4), 'utf-8');

        return NextResponse.json({
            success: true,
            message: 'Faculty member deleted successfully'
        });

    } catch (error) {
        console.error('Faculty delete error:', error);
        return NextResponse.json({ error: 'Failed to delete faculty' }, { status: 500 });
    }
}
