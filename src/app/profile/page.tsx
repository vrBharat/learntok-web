'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { Edit2, Settings } from 'lucide-react';
import { RootState } from '@/store';
import AppLayout from '@/components/AppLayout';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

export default function ProfilePage() {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

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

                        {/* Bio */}
                        <Text className="text-text-secondary text-center md:text-left max-w-lg">
                            {user.bio || "No bio yet. Tell the world about your learning journey!"}
                        </Text>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
