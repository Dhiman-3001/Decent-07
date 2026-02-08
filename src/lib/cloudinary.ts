import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Folder names in Cloudinary
export const CLOUDINARY_FOLDERS = {
    GALLERY_IMAGES: 'gallery_images',
    GALLERY_VIDEOS: 'gallery_videos',
    FACULTIES: 'faculties',
} as const;

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
    IMAGE: 6 * 1024 * 1024,  // 6MB
    VIDEO: 20 * 1024 * 1024, // 20MB
} as const;

// Allowed file types
export const ALLOWED_FILE_TYPES = {
    IMAGE: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'] as string[],
    VIDEO: ['video/mp4', 'video/webm', 'video/quicktime'] as string[],
};

// Extract public ID from Cloudinary URL
export function extractPublicIdFromUrl(url: string): string | null {
    try {
        // URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{version}/{public_id}.{ext}
        const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
        const match = url.match(regex);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}

// Generate optimized URL with transformations
export function getOptimizedImageUrl(publicId: string, options?: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
}): string {
    const transformations: string[] = [];

    if (options?.width) transformations.push(`w_${options.width}`);
    if (options?.height) transformations.push(`h_${options.height}`);
    if (options?.quality) transformations.push(`q_${options.quality}`);
    if (options?.format) transformations.push(`f_${options.format}`);

    transformations.push('c_fill');

    const transformStr = transformations.length > 0 ? transformations.join(',') + '/' : '';

    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${transformStr}${publicId}`;
}
