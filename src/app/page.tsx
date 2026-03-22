'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchVideos, fetchFollowingVideos } from '@/store/slices/videoSlice';
import { View } from '@/components/ui/View';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import AppLayout from '@/components/AppLayout';
import { VideoCard } from '@/components/VideoCard';
import { cn } from '@/lib/utils';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { videos, isLoading, error } = useSelector((state: RootState) => state.video);

  const [activeIndex, setActiveIndex] = useState(0);
  const [feedType, setFeedType] = useState<'for-you' | 'following'>('for-you');

  useEffect(() => {
    if (feedType === 'for-you') {
      dispatch(fetchVideos({ refresh: true }));
    } else if (feedType === 'following' && user) {
      dispatch(fetchFollowingVideos({ userId: user.id, refresh: true }));
    }
  }, [dispatch, feedType, user]);

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
      {/* Feed Tabs Feed */}
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-center gap-6 pointer-events-none">
        <button
          onClick={() => setFeedType('following')}
          disabled={!isAuthenticated}
          className={cn(
            "pointer-events-auto text-lg font-bold transition-all drop-shadow-lg",
            feedType === 'following' ? "text-white underline underline-offset-8 decoration-2" : "text-white/60 hover:text-white/80",
            !isAuthenticated && "opacity-30 cursor-not-allowed"
          )}
        >
          Following
        </button>
        <div className="w-[1px] h-6 bg-white/20 mt-1" />
        <button
          onClick={() => setFeedType('for-you')}
          className={cn(
            "pointer-events-auto text-lg font-bold transition-all drop-shadow-lg",
            feedType === 'for-you' ? "text-white underline underline-offset-8 decoration-2" : "text-white/60 hover:text-white/80"
          )}
        >
          For You
        </button>
      </div>

      <div
        className="video-feed w-full max-w-lg mx-auto overflow-y-scroll snap-y snap-mandatory h-screen scrollbar-none"
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
            <Text variant="caption">
              {feedType === 'following'
                ? "Follow some creators to see their latest educational shorts here!"
                : "Be the first to upload an educational short!"}
            </Text>
            {feedType === 'following' ? (
              <Button variant="primary" onClick={() => setFeedType('for-you')}>Discover Creators</Button>
            ) : (
              <Button variant="primary">Become a Creator</Button>
            )}
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
