'use client';

import React from 'react';
import { BookOpen, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';

export const Header = () => {
    const router = useRouter();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-8">
            <div className="flex items-center gap-2 md:hidden" onClick={() => router.push('/')}>
                <div className="bg-primary p-1.5 rounded-lg">
                    <BookOpen size={20} className="text-white" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">LearnTok</span>
            </div>

            <div className="hidden md:flex flex-1 max-w-xl mx-auto px-4">
                <div className="relative w-full">
                    <input
                        className="w-full bg-surface-light border border-border rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        placeholder="Search educational shorts..."
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                        <User size={16} />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {isAuthenticated && user ? (
                    <div
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => router.push('/profile')}
                    >
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-medium text-white line-clamp-1">{user.displayName}</span>
                            <span className="text-[10px] text-text-tertiary">@{user.username}</span>
                        </div>
                        <Avatar src={user.profilePic} name={user.displayName} size="sm" />
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => router.push('/auth/login')}>Log In</Button>
                        <Button variant="primary" size="sm" onClick={() => router.push('/auth/signup')}>Sign Up</Button>
                    </div>
                )}
            </div>
        </header>
    );
};
