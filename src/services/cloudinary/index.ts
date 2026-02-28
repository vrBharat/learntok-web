/**
 * Cloudinary Service
 * Handles video and image uploads to Cloudinary
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dnpg8bv6g';
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'LearnTok';

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`;

export interface UploadResult {
    success: boolean;
    url?: string;
    thumbnailUrl?: string;
    publicId?: string;
    duration?: number;
    error?: string;
}

export interface UploadProgress {
    progress: number;
    status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
}

/**
 * Upload a video to Cloudinary
 */
export const uploadVideo = async (
    file: File,
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
    try {
        onProgress?.({ progress: 0, status: 'uploading' });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('resource_type', 'video');

        const response = await fetch(`${CLOUDINARY_UPLOAD_URL}/video/upload`, {
            method: 'POST',
            body: formData,
        });

        onProgress?.({ progress: 80, status: 'processing' });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Upload failed');
        }

        const data = await response.json();

        onProgress?.({ progress: 100, status: 'complete' });

        return {
            success: true,
            url: data.secure_url,
            thumbnailUrl: generateThumbnailUrl(data.public_id),
            publicId: data.public_id,
            duration: data.duration,
        };
    } catch (error: any) {
        onProgress?.({ progress: 0, status: 'error' });
        console.error('Cloudinary upload error:', error);
        return {
            success: false,
            error: error.message || 'Failed to upload video',
        };
    }
};

/**
 * Upload an image to Cloudinary
 */
export const uploadImage = async (
    file: File,
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
    try {
        onProgress?.({ progress: 0, status: 'uploading' });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        const response = await fetch(`${CLOUDINARY_UPLOAD_URL}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        onProgress?.({ progress: 80, status: 'processing' });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Upload failed');
        }

        const data = await response.json();

        onProgress?.({ progress: 100, status: 'complete' });

        return {
            success: true,
            url: data.secure_url,
            publicId: data.public_id,
        };
    } catch (error: any) {
        onProgress?.({ progress: 0, status: 'error' });
        console.error('Cloudinary upload error:', error);
        return {
            success: false,
            error: error.message || 'Failed to upload image',
        };
    }
};

/**
 * Generate video thumbnail URL from public ID
 */
export const generateThumbnailUrl = (publicId: string, options?: {
    width?: number;
    height?: number;
    startOffset?: number;
}): string => {
    const { width = 720, height = 1280, startOffset = 1 } = options || {};
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/w_${width},h_${height},c_fill,so_${startOffset}/${publicId}.jpg`;
};

/**
 * Get optimized video URL with transformations
 */
export const getOptimizedVideoUrl = (publicId: string, options?: {
    width?: number;
    height?: number;
    quality?: string;
}): string => {
    const { width = 720, height = 1280, quality = 'auto' } = options || {};
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/w_${width},h_${height},c_fill,q_${quality}/${publicId}.mp4`;
};

/**
 * Get optimized image URL with transformations
 */
export const getOptimizedImageUrl = (publicId: string, options?: {
    width?: number;
    height?: number;
    quality?: string;
}): string => {
    const { width = 400, height = 400, quality = 'auto' } = options || {};
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},h_${height},c_fill,q_${quality}/${publicId}`;
};

export default {
    uploadVideo,
    uploadImage,
    generateThumbnailUrl,
    getOptimizedVideoUrl,
    getOptimizedImageUrl,
};
