'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Edit2, Settings, Grid, Heart, Bookmark } from 'lucide-react';
import { RootState, AppDispatch } from '@/store';
import { fetchUserVideos } from '@/store/slices/userSlice';
import AppLayout from '@/components/AppLayout';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { View } from '@/components/ui/View';
import { VideoGrid } from '@/components/VideoGrid';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
    const dispatch = useDispatch<AppDispatch>();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { userVideos, isLoading } = useSelector((state: RootState) => state.user);
    const [activeTab, setActiveTab] = React.useState<'videos' | 'liked' | 'saved'>('videos');

    useEffect(() => {
        if (user) {
            dispatch(fetchUserVideos(user.id));
        }
    }, [dispatch, user]);

    if (!isAuthenticated || !user) {
        return (
            <AppLayout>
                <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
                    <Text variant="h2">Please log in to view your profile</Text>
                    <Button variant="primary" onClick={() => window.location.href = '/auth/login'}>Log In</Button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="w-full max-w-4xl mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="flex flex-col items-center md:items-start md:flex-row gap-8 mb-12">
                    <Avatar src={user.profilePic} name={user.displayName} size="xl" className="border-4 border-surface shadow-xl" />

                    <div className="flex-1 flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex flex-col items-center md:items-start">
                                <Text variant="h2" className="text-white">{user.displayName}</Text>
                                <Text variant="caption">@{user.username}</Text>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Edit2 size={16} /> Edit Profile
                                </Button>
                                <Button variant="outline" size="sm" className="p-2">
                                    <Settings size={16} />
                                </Button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8 justify-center md:justify-start">
                            <StatItem label="Following" value={user.followingCount || 0} />
                            <StatItem label="Followers" value={user.followersCount || 0} />
                            <StatItem label="Likes" value={user.totalLikesReceived || 0} />
                        </div>

                        {/* Bio */}
                        <Text className="text-text-secondary text-center md:text-left max-w-lg">
                            {user.bio || "No bio yet. Tell the world about your learning journey!"}
                        </Text>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border mb-8 overflow-x-auto">
                    <TabItem
                        active={activeTab === 'videos'}
                        onClick={() => setActiveTab('videos')}
                        icon={<Grid size={18} />}
                        label="Videos"
                    />
                    <TabItem
                        active={activeTab === 'liked'}
                        onClick={() => setActiveTab('liked')}
                        icon={<Heart size={18} />}
                        label="Liked"
                    />
                    <TabItem
                        active={activeTab === 'saved'}
                        onClick={() => setActiveTab('saved')}
                        icon={<Bookmark size={18} />}
                        label="Saved"
                    />
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                ) : userVideos.length === 0 ? (
                    <div className="text-center py-20 opacity-50">
                        <Text variant="caption">Nothing to show yet.</Text>
                    </div>
                ) : (
                    <VideoGrid videos={userVideos} />
                )}
            </div>
        </AppLayout>
    );
}

const StatItem = ({ label, value }: { label: string; value: number }) => (
    <div className="flex items-center gap-1.5">
        <span className="text-lg font-bold text-white">{value}</span>
        <span className="text-sm text-text-tertiary">{label}</span>
    </div>
);

const TabItem = ({
    active,
    onClick,
    icon,
    label
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string
}) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center gap-2 px-6 py-4 border-b-2 transition-all duration-200 whitespace-nowrap",
            active
                ? "border-primary text-primary"
                : "border-transparent text-text-tertiary hover:text-white"
        )}
    >
        {icon}
        <span className="text-sm font-bold uppercase tracking-wider">{label}</span>
    </button>
);
