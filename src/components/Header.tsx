'use client';

import React from 'react';
import { BookOpen, User, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';

export const Header = () => {
    const router = useRouter();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between glass-effect px-4 md:px-8">
            <div className="flex items-center gap-2 md:hidden" onClick={() => router.push('/')}>
                <BookOpen size={24} className="text-primary" />
                <span className="text-lg font-bold text-text-primary tracking-tight">learntok.in</span>
            </div>

            <div className="hidden md:flex flex-1 max-w-xl mx-auto px-4">
                <div className="relative w-full group">
                    <input
                        className="w-full bg-surface-light/50 border border-border rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-text-muted hover:bg-surface-light"
                        placeholder="Search educational shorts..."
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors">
                        <Search size={16} />
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
