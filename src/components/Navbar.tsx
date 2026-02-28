'use client';

import React from 'react';
import { Home, Search, PlusSquare, Bell, User, BookOpen } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Discover', href: '/search' },
    { icon: PlusSquare, label: 'Upload', href: '/upload' },
    { icon: Bell, label: 'Inbox', href: '/notifications' },
    { icon: User, label: 'Profile', href: '/profile' },
];

export const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <>
            {/* Desktop Sidebar */}
            <nav className="fixed left-0 top-0 hidden h-full w-64 border-r border-border bg-background px-4 py-8 md:flex flex-col gap-8">
                <div className="flex items-center gap-2 px-2 pb-4 border-b border-border mb-4 cursor-pointer" onClick={() => router.push('/')}>
                    <div className="bg-primary p-2 rounded-lg">
                        <BookOpen size={24} className="text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">LearnTok</span>
                </div>

                <div className="flex flex-col gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <button
                                key={item.href}
                                onClick={() => router.push(item.href)}
                                className={cn(
                                    'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group',
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-text-secondary hover:bg-surface-light hover:text-white'
                                )}
                            >
                                <Icon size={24} className={cn('transition-transform duration-200 group-hover:scale-110', isActive && 'stroke-[2.5px]')} />
                                <span className={cn('text-lg font-medium', isActive && 'font-semibold')}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-auto p-4 rounded-2xl bg-surface-light border border-border">
                    <p className="text-sm font-semibold text-white mb-1">Learn Premium</p>
                    <p className="text-xs text-text-tertiary mb-3">Get unlimited access to advanced quizzes and doubts.</p>
                    <button className="w-full py-2 bg-accent text-black font-bold rounded-lg text-sm hover:bg-accent-light transition-colors">
                        Upgrade
                    </button>
                </div>
            </nav>

            {/* Mobile Bottom Tab Bar */}
            <nav className="fixed bottom-0 left-0 flex w-full items-center justify-around border-t border-border bg-background px-2 py-3 md:hidden z-50">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <button
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 min-w-[64px]',
                                isActive ? 'text-primary' : 'text-text-tertiary'
                            )}
                        >
                            <Icon size={24} className={cn(isActive && 'stroke-[2.5px]')} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </>
    );
};
