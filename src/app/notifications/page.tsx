'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, Heart, MessageCircle, UserPlus, Info } from 'lucide-react';
import { RootState, AppDispatch } from '@/store';
import { fetchNotifications, markAsRead } from '@/store/slices/notificationSlice';
import AppLayout from '@/components/AppLayout';
import { Text } from '@/components/ui/Text';
import { View } from '@/components/ui/View';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { notifications, isLoading } = useSelector((state: RootState) => state.notification);

    useEffect(() => {
        if (isAuthenticated && user) {
            dispatch(fetchNotifications({ userId: user.id, refresh: true }));
        }
    }, [dispatch, isAuthenticated, user]);

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
                    {isLoading && notifications.length === 0 ? (
                        <div className="flex justify-center py-20">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                            <div className="p-6 bg-surface-light rounded-full">
                                <Bell size={48} />
                            </div>
                            <Text variant="caption">All caught up! No new notifications.</Text>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {notifications.map((notif) => (
                                <NotificationItem
                                    key={notif.id}
                                    notif={notif}
                                    onRead={() => dispatch(markAsRead(notif.id))}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

const NotificationItem = ({ notif, onRead }: { notif: any, onRead: () => void }) => {
    const icons = {
        like: <Heart size={14} className="fill-red-500 text-red-500" />,
        comment: <MessageCircle size={14} className="fill-blue-500 text-blue-500" />,
        follow: <UserPlus size={14} className="fill-green-500 text-green-500" />,
        system: <Info size={14} className="fill-yellow-500 text-yellow-500" />,
        video_approved: <Info size={14} className="fill-green-500 text-green-500" />,
        video_rejected: <Info size={14} className="fill-red-500 text-red-500" />,
        streak: <Info size={14} className="fill-orange-500 text-orange-500" />,
        badge: <Info size={14} className="fill-purple-500 text-purple-500" />,
    };

    const timeString = notif.createdAt
        ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })
        : '';

    return (
        <div
            onClick={onRead}
            className={cn(
                "flex items-center gap-4 p-4 hover:bg-surface-light rounded-2xl transition-all cursor-pointer border border-transparent hover:border-border/50 group animate-in slide-in-from-right duration-300",
                !notif.read && "bg-primary/5 border-primary/20"
            )}
        >
            <div className="relative">
                <Avatar name={notif.data?.senderName || "System"} src={notif.data?.senderAvatar} size="md" />
                <div className="absolute -bottom-1 -right-1 bg-background p-1 rounded-full border border-border shadow-lg">
                    {icons[notif.type as keyof typeof icons] || <Bell size={14} />}
                </div>
            </div>
            <div className="flex-1">
                <Text className="text-sm">
                    <span className="font-bold text-white tracking-tight">{notif.data?.senderName || notif.title}</span>
                    <span className="text-text-secondary ml-1">{notif.body}</span>
                </Text>
                <Text variant="tiny" className="mt-0.5 opacity-50">{timeString}</Text>
            </div>
            {notif.data?.videoThumbnail && (
                <div className="relative group/thumb">
                    <img src={notif.data.videoThumbnail} className="h-12 w-12 rounded-lg object-cover border border-border" alt="Video" />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity rounded-lg" />
                </div>
            )}
            {!notif.read && (
                <div className="h-2 w-2 rounded-full bg-primary shadow-glow" />
            )}
        </div>
    );
};
