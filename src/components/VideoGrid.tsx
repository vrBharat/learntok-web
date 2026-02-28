'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Play } from 'lucide-react';
import { Video } from '@/types';
import { Text } from './ui/Text';

interface VideoGridProps {
    videos: Video[];
    onVideoClick?: (video: Video) => void;
}

export const VideoGrid = ({ videos, onVideoClick }: VideoGridProps) => {
    return (
        <div className="grid grid-cols-3 gap-1 md:gap-4">
            {videos.map((video) => (
                <div
                    key={video.id}
                    className="relative aspect-[9/16] bg-surface-light rounded-lg overflow-hidden cursor-pointer group hover:scale-[1.02] transition-transform duration-200"
                    onClick={() => onVideoClick?.(video)}
                >
                    <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

                    <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white">
                        <Play size={14} fill="white" />
                        <span className="text-xs font-bold">{video.viewsCount || 0}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
