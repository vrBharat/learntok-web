'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, Heart, MessageCircle, UserPlus, Info } from 'lucide-react';
import { RootState, AppDispatch } from '@/store';
import AppLayout from '@/components/AppLayout';
import { Text } from '@/components/ui/Text';
import { View } from '@/components/ui/View';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    // In a real app, notifications would be in a slice. For now, let's mock or check if we have a slice.
    // I noticed 'notifications' was in COLECTIONS but maybe not in a slice yet.
    const notifications: any[] = [];

    if (!isAuthenticated) {
        return (
            <AppLayout>
                <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
                    <Bell size={64} className="text-text-tertiary opacity-20" />
                    <Text variant="h2">Stay updated</Text>
                    <Text variant="caption">Log in to see your likes, comments, and followers.</Text>
                    <button
                        onClick={() => window.location.href = '/auth/login'}
                        className="mt-4 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-glow"
                    >
                        Log In
                    </button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="w-full max-w-2xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <Text variant="h2">Inbox</Text>
                    <button className="text-sm font-bold text-primary hover:underline">Mark all as read</button>
                </div>

                <div className="flex flex-col gap-1">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                            <div className="p-6 bg-surface-light rounded-full">
                                <Bell size={48} />
                            </div>
                            <Text variant="caption">All caught up! No new notifications.</Text>
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <NotificationItem key={notif.id} notif={notif} />
                        ))
                    )}

                    {/* Mock Notifications for UI demonstration during development */}
                    <div className="mt-8 flex flex-col gap-1">
                        <Text variant="tiny" className="px-4 mb-2 uppercase tracking-widest opacity-50">Recent Activities</Text>
                        <MockNotification
                            type="like"
                            user="Sarah Jenkins"
                            action="liked your video"
                            time="2m ago"
                            videoThumbnail="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100"
                        />
                        <MockNotification
                            type="follow"
                            user="Alex Chen"
                            action="started following you"
                            time="1h ago"
                        />
                        <MockNotification
                            type="comment"
                            user="Education First"
                            action="replied to your comment: 'Great explanation!'"
                            time="5h ago"
                            videoThumbnail="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100"
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

const NotificationItem = ({ notif }: { notif: any }) => (
    <div className="flex items-center gap-4 p-4 hover:bg-surface-light rounded-2xl transition-all cursor-pointer border border-transparent hover:border-border/50 group">
        <Avatar name={notif.senderName} src={notif.senderAvatar} size="md" />
        <div className="flex-1">
            <Text className="text-sm">
                <span className="font-bold text-white tracking-tight">{notif.senderName}</span>
                <span className="text-text-secondary ml-1">{notif.message}</span>
            </Text>
            <Text variant="tiny" className="mt-0.5 opacity-50">{notif.time}</Text>
        </div>
        {notif.videoThumbnail && (
            <img src={notif.videoThumbnail} className="h-12 w-12 rounded-lg object-cover" alt="Video" />
        )}
    </div>
);

const MockNotification = ({ type, user, action, time, videoThumbnail }: any) => {
    const icons = {
        like: <Heart size={14} className="fill-red-500 text-red-500" />,
        comment: <MessageCircle size={14} className="fill-blue-500 text-blue-500" />,
        follow: <UserPlus size={14} className="fill-green-500 text-green-500" />,
        info: <Info size={14} className="fill-yellow-500 text-yellow-500" />,
    };

    return (
        <div className="flex items-center gap-4 p-4 hover:bg-surface-light rounded-2xl transition-all cursor-pointer border border-transparent hover:border-border/50 group animate-in slide-in-from-right duration-300">
            <div className="relative">
                <Avatar name={user} size="md" />
                <div className="absolute -bottom-1 -right-1 bg-background p-1 rounded-full border border-border shadow-lg">
                    {icons[type as keyof typeof icons]}
                </div>
            </div>
            <div className="flex-1">
                <Text className="text-sm">
                    <span className="font-bold text-white tracking-tight">{user}</span>
                    <span className="text-text-secondary ml-1">{action}</span>
                </Text>
                <Text variant="tiny" className="mt-0.5 opacity-50">{time}</Text>
            </div>
            {videoThumbnail && (
                <div className="relative group/thumb">
                    <img src={videoThumbnail} className="h-12 w-12 rounded-lg object-cover border border-border" alt="Video" />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity rounded-lg" />
                </div>
            )}
        </div>
    );
};
