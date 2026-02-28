import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchVideos } from '@/store/slices/videoSlice';
import { View } from '@/components/ui/View';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import AppLayout from '@/components/AppLayout';
import { VideoCard } from '@/components/VideoCard';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { videos, isLoading, error } = useSelector((state: RootState) => state.video);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchVideos({ refresh: true }));
  }, [dispatch]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const itemHeight = e.currentTarget.clientHeight;
    const index = Math.round(scrollTop / itemHeight);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <AppLayout>
      <div
        className="video-feed w-full max-w-lg mx-auto overflow-y-scroll snap-y snap-mandatory h-[calc(100vh-64px)] scrollbar-none"
        onScroll={handleScroll}
      >
        {isLoading && videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <Text variant="caption">Loading personalized feed...</Text>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
            <Text variant="h3">Something went wrong</Text>
            <Text variant="caption">{error}</Text>
            <Button onClick={() => dispatch(fetchVideos({ refresh: true }))}>Try Again</Button>
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
            <Text variant="h3">No videos found</Text>
            <Text variant="caption">Be the first to upload an educational short!</Text>
            <Button variant="primary">Become a Creator</Button>
          </div>
        ) : (
          videos.map((video, index) => (
            <div key={video.id} className="snap-start w-full h-full flex items-center justify-center">
              <VideoCard video={video} isActive={index === activeIndex} />
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
}
